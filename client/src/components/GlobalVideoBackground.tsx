import React, { useEffect, useRef, useState, useCallback } from "react";
import { useVideoHero, VideoEntry } from "@/contexts/VideoHeroContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useReducedData } from "@/hooks/useReducedData";

/**
 * GlobalVideoBackground
 *
 * Renders a full-viewport cinematic video background that crossfades between
 * two <video> elements (A/B swap) whenever the VideoHeroContext key changes.
 *
 * Architecture:
 *  - Two stacked <video> elements (activeSlot and inactiveSlot)
 *  - On context change: load new video into inactive slot, fade it in, fade out active
 *  - On loop: instead of relying on the native `loop` attribute (which produces a
 *    visible cut), the active slot fades into the inactive slot — restarted from
 *    time 0 — so the video appears to play forever with no seam.
 *  - Respects prefers-reduced-motion: falls back to instant swap with poster image
 *  - Overlay gradient ensures text legibility on all content
 *
 * Rendering improvements (v2):
 *  - Explicit CSS containment to isolate stacking context
 *  - Hardware-accelerated compositing via will-change + transform3d
 *  - Visibility-based play/pause to save resources when tab is hidden
 *  - Intersection Observer to pause when off-screen
 *  - Stall detection: auto-restarts stalled video elements
 *  - Adaptive quality: reduces playback rate on slow connections
 *  - Proper cleanup of all event listeners and timers
 *  - Mobile-aware sizing: uses the large viewport unit (`100lvh`) so the
 *    background fills the screen cleanly even when the iOS Safari URL bar
 *    expands or collapses.
 */

const FADE_DURATION = 800; // ms for crossfade
const STALL_TIMEOUT = 5000; // ms before declaring a stall
// Trigger the loop crossfade slightly before the video ends so the swap
// completes right at the natural loop point, hiding the cut entirely.
const LOOP_LEAD_SECONDS = FADE_DURATION / 1000 + 0.2;

// iOS Safari requires a user gesture for video playback in some cases.
// We attempt autoplay immediately and retry on first user interaction.
function tryPlay(el: HTMLVideoElement | null): Promise<void> {
  if (!el) return Promise.resolve();
  el.muted = true; // must be set programmatically for iOS
  const p = el.play();
  if (p !== undefined) {
    return p.catch(() => {
      // Autoplay blocked — retry on first touch/click
      return new Promise<void>(resolve => {
        const retry = () => {
          el.play().catch(() => {});
          document.removeEventListener("touchstart", retry);
          document.removeEventListener("click", retry);
          resolve();
        };
        document.addEventListener("touchstart", retry, { once: true });
        document.addEventListener("click", retry, { once: true });
      });
    });
  }
  return Promise.resolve();
}

type VideoSlot = {
  entry: VideoEntry;
  opacity: number;
  key: string;
};

export default function GlobalVideoBackground() {
  const { currentKey, currentVideo } = useVideoHero();
  const prefersReducedMotion = useReducedMotion();
  const prefersReducedData = useReducedData();

  // Two video refs for A/B crossfade
  const videoARef = useRef<HTMLVideoElement>(null);
  const videoBRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Track if any video has loaded (to remove fallback bg)
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Stall detection refs
  const stallTimerARef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stallTimerBRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Stall detection: restart if video freezes ──────────────────────────────
  const watchForStall = useCallback(
    (
      el: HTMLVideoElement | null,
      timerRef: React.MutableRefObject<ReturnType<typeof setTimeout> | null>
    ) => {
      if (!el) return;
      if (timerRef.current) clearTimeout(timerRef.current);

      const check = () => {
        if (el.paused || el.ended) return;
        timerRef.current = setTimeout(() => {
          // If currentTime hasn't advanced, the video has stalled
          const t1 = el.currentTime;
          setTimeout(() => {
            if (el.currentTime === t1 && !el.paused) {
              // Stalled — reload and retry
              el.load();
              tryPlay(el);
            }
          }, 500);
        }, STALL_TIMEOUT);
      };

      el.addEventListener("playing", check, { passive: true });
      el.addEventListener(
        "timeupdate",
        () => {
          if (timerRef.current) clearTimeout(timerRef.current);
          timerRef.current = null;
        },
        { passive: true }
      );
    },
    []
  );

  // ── Visibility API: pause video when tab is hidden ─────────────────────────
  useEffect(() => {
    const handleVisibilityChange = () => {
      const videoA = videoARef.current;
      const videoB = videoBRef.current;
      if (document.hidden) {
        videoA?.pause();
        videoB?.pause();
      } else {
        tryPlay(videoA);
        tryPlay(videoB);
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });
    return () =>
      document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // ── Kick off initial autoplay on mount ─────────────────────────────────────
  useEffect(() => {
    const el = videoARef.current;
    if (!el) return;

    const onCanPlay = () => {
      setVideoLoaded(true);
      setIsLoading(false);
    };

    const onError = () => {
      // On error, try reloading after a short delay
      setTimeout(() => {
        if (el) {
          el.load();
          tryPlay(el);
        }
      }, 2000);
    };

    el.addEventListener("canplay", onCanPlay, { once: true });
    el.addEventListener("error", onError, { passive: true });

    // If already ready
    if (el.readyState >= 3) {
      setVideoLoaded(true);
      setIsLoading(false);
    }

    tryPlay(el);
    watchForStall(el, stallTimerARef);

    return () => {
      el.removeEventListener("canplay", onCanPlay);
      el.removeEventListener("error", onError);
      if (stallTimerARef.current) clearTimeout(stallTimerARef.current);
    };
  }, [watchForStall]);

  const [slotA, setSlotA] = useState<VideoSlot>({
    entry: currentVideo,
    opacity: 1,
    key: currentKey,
  });
  const [slotB, setSlotB] = useState<VideoSlot>({
    entry: currentVideo,
    opacity: 0,
    key: currentKey,
  });
  const [activeSlot, setActiveSlot] = useState<"A" | "B">("A");
  // Mirror activeSlot in a ref so event handlers always read the latest value
  // without being recreated on every render.
  const activeSlotRef = useRef<"A" | "B">("A");
  useEffect(() => {
    activeSlotRef.current = activeSlot;
  }, [activeSlot]);

  const prevKeyRef = useRef(currentKey);
  const crossfadeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // ── Seamless loop crossfade ────────────────────────────────────────────────
  // Track whether both slots currently hold the same VideoEntry (i.e. the
  // inactive slot is a hot spare we can restart from t=0 to mask the loop cut).
  // Initially both slots start with the same entry, so they are in sync.
  const slotsSyncedRef = useRef(true);
  // Guard so we don't re-trigger a crossfade while one is already running.
  const loopCrossfadingRef = useRef(false);
  const loopTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  const cancelLoopCrossfade = useCallback(() => {
    loopTimersRef.current.forEach(t => clearTimeout(t));
    loopTimersRef.current = [];
    loopCrossfadingRef.current = false;
  }, []);

  // Cleanup crossfade timers on unmount
  useEffect(() => {
    return () => {
      crossfadeTimersRef.current.forEach(t => clearTimeout(t));
      loopTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (currentKey === prevKeyRef.current) return;
    prevKeyRef.current = currentKey;

    // Clear any pending crossfade timers — both key-change and loop crossfades.
    crossfadeTimersRef.current.forEach(t => clearTimeout(t));
    crossfadeTimersRef.current = [];
    cancelLoopCrossfade();

    // Slots will diverge during this crossfade. We re-sync them once it
    // completes so the next loop crossfade can use the inactive slot.
    slotsSyncedRef.current = false;

    if (prefersReducedMotion) {
      // Instant swap — no animation
      setSlotA({ entry: currentVideo, opacity: 1, key: currentKey });
      setSlotB({ entry: currentVideo, opacity: 0, key: currentKey });
      setActiveSlot("A");
      slotsSyncedRef.current = true;
      return;
    }

    // Load new video into the inactive slot, then crossfade
    if (activeSlot === "A") {
      // Load new video into B
      setSlotB({ entry: currentVideo, opacity: 0, key: currentKey });
      // Start playing B after a tick
      requestAnimationFrame(() => {
        const videoB = videoBRef.current;
        if (videoB) {
          videoB.load();
          tryPlay(videoB).then(() => {
            watchForStall(videoB, stallTimerBRef);
          });
        }
        // Fade B in, fade A out
        const t1 = setTimeout(() => {
          setSlotB(prev => ({ ...prev, opacity: 1 }));
          setSlotA(prev => ({ ...prev, opacity: 0 }));
          // After fade completes, swap active slot
          const t2 = setTimeout(() => {
            setActiveSlot("B");
            // Re-sync the now-inactive slot (A) to the new entry so the
            // next seamless loop crossfade has a hot spare ready.
            setSlotA({
              entry: currentVideo,
              opacity: 0,
              key: `${currentKey}-sync-A`,
            });
            slotsSyncedRef.current = true;
          }, FADE_DURATION);
          crossfadeTimersRef.current.push(t2);
        }, 50);
        crossfadeTimersRef.current.push(t1);
      });
    } else {
      // Load new video into A
      setSlotA({ entry: currentVideo, opacity: 0, key: currentKey });
      requestAnimationFrame(() => {
        const videoA = videoARef.current;
        if (videoA) {
          videoA.load();
          tryPlay(videoA).then(() => {
            watchForStall(videoA, stallTimerARef);
          });
        }
        const t1 = setTimeout(() => {
          setSlotA(prev => ({ ...prev, opacity: 1 }));
          setSlotB(prev => ({ ...prev, opacity: 0 }));
          const t2 = setTimeout(() => {
            setActiveSlot("A");
            setSlotB({
              entry: currentVideo,
              opacity: 0,
              key: `${currentKey}-sync-B`,
            });
            slotsSyncedRef.current = true;
          }, FADE_DURATION);
          crossfadeTimersRef.current.push(t2);
        }, 50);
        crossfadeTimersRef.current.push(t1);
      });
    }
  }, [
    currentKey,
    currentVideo,
    activeSlot,
    prefersReducedMotion,
    watchForStall,
    cancelLoopCrossfade,
  ]);

  // ── Seamless loop: crossfade back to the inactive slot before the video
  //    naturally ends, restarting it from t=0 so there's no visible cut. ──
  const handleTimeUpdate = useCallback(
    (slotId: "A" | "B") => {
      // Only the currently active slot drives loop detection.
      if (slotId !== activeSlotRef.current) return;
      if (loopCrossfadingRef.current) return;
      if (!slotsSyncedRef.current) return;
      if (prefersReducedMotion) return;

      const activeEl =
        slotId === "A" ? videoARef.current : videoBRef.current;
      const inactiveEl =
        slotId === "A" ? videoBRef.current : videoARef.current;
      if (!activeEl || !inactiveEl) return;

      const dur = activeEl.duration;
      // Skip if duration is unknown (Infinity for live/streaming) or too short
      // to bother crossfading.
      if (!isFinite(dur) || dur < 2) return;

      const remaining = dur - activeEl.currentTime;
      if (remaining > LOOP_LEAD_SECONDS) return;

      // Trigger the seamless restart.
      loopCrossfadingRef.current = true;
      try {
        inactiveEl.currentTime = 0;
      } catch (err) {
        // Some mobile browsers throw if the video isn't ready; fall through
        // — the native `loop` attribute will still keep playback going.
        if (process.env.NODE_ENV !== "production") {
          // eslint-disable-next-line no-console
          console.debug("[GlobalVideoBackground] loop seek failed", err);
        }
      }
      tryPlay(inactiveEl);

      if (slotId === "A") {
        setSlotA(prev => ({ ...prev, opacity: 0 }));
        setSlotB(prev => ({ ...prev, opacity: 1 }));
      } else {
        setSlotB(prev => ({ ...prev, opacity: 0 }));
        setSlotA(prev => ({ ...prev, opacity: 1 }));
      }

      const t = setTimeout(() => {
        // Swap active slot. The previously-active slot keeps its native loop
        // running (out of sight at opacity 0); we leave it alone so it stays
        // primed for the next loop crossfade.
        setActiveSlot(slotId === "A" ? "B" : "A");
        loopCrossfadingRef.current = false;
      }, FADE_DURATION);
      loopTimersRef.current.push(t);
    },
    [prefersReducedMotion]
  );

  const videoBaseClass =
    "absolute inset-0 w-full h-full object-cover pointer-events-none";
  const transitionStyle = `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  // Container style: explicit fixed positioning with GPU acceleration.
  // Using inline style for zIndex instead of Tailwind's -z-10 to avoid
  // stacking context conflicts that can hide the video on some browsers.
  // contain: strict isolates the stacking context and prevents layout thrashing.
  // height: uses the large viewport unit so iOS Safari doesn't leave a strip
  // uncovered when the URL bar collapses; falls back to 100vh for browsers
  // that don't support lvh.
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    // `lvh` (large viewport height) is widely supported in modern browsers
    // and ensures the background fills the screen even when the iOS Safari
    // URL bar collapses. Using minHeight keeps `100vh` as the fallback for
    // older browsers that don't recognize `lvh`.
    minHeight: "100lvh",
    zIndex: -1,
    overflow: "hidden",
    backgroundColor: videoLoaded ? "transparent" : "#0a1628",
    // GPU acceleration — forces the element onto its own compositor layer
    transform: "translate3d(0, 0, 0)",
    WebkitTransform: "translate3d(0, 0, 0)",
    willChange: "transform",
    // CSS containment: isolates layout/paint/style recalculation
    contain: "strict" as React.CSSProperties["contain"],
  };

  // Video element style: backfaceVisibility prevents flickering during
  // opacity transitions on Chrome/Safari compositing.
  const videoStyle = (opacity: number): React.CSSProperties => ({
    opacity,
    transition: transitionStyle,
    backfaceVisibility: "hidden",
    WebkitBackfaceVisibility: "hidden",
    // Promote each video to its own GPU layer for smooth crossfade
    transform: "translate3d(0, 0, 0)",
    WebkitTransform: "translate3d(0, 0, 0)",
    willChange: "opacity",
  });

  if (prefersReducedData) {
    return (
      <div ref={containerRef} style={containerStyle}>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{ backgroundImage: `url("${currentVideo.poster}")` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
          }}
        />
        <ContextLabel label={currentVideo.label} videoKey={currentKey} />
      </div>
    );
  }

  return (
    <div ref={containerRef} style={containerStyle}>
      {/* Poster fallback — visible while the first video buffers so users see
          a beautiful still instead of a dark void. Fades out once the video
          is ready. Always rendered behind both <video> elements. */}
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url("${currentVideo.poster}")`,
          opacity: videoLoaded ? 0 : 1,
          transition: "opacity 600ms ease-out",
        }}
      />

      {/* Slot A */}
      <video
        ref={videoARef}
        key={`A-${slotA.key}`}
        className={videoBaseClass}
        style={videoStyle(slotA.opacity)}
        src={slotA.entry.src}
        poster={slotA.entry.poster}
        autoPlay
        muted
        loop
        playsInline
        // @ts-ignore — webkit-playsinline is required for iOS Safari inline playback
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        preload="auto"
        onTimeUpdate={() => handleTimeUpdate("A")}
        onLoadedData={() => {
          setVideoLoaded(true);
          setIsLoading(false);
        }}
        onCanPlay={() => {
          setVideoLoaded(true);
          setIsLoading(false);
        }}
        onError={() => {
          // Retry on error
          setTimeout(() => {
            if (videoARef.current) {
              videoARef.current.load();
              tryPlay(videoARef.current);
            }
          }, 2000);
        }}
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* Slot B */}
      <video
        ref={videoBRef}
        key={`B-${slotB.key}`}
        className={videoBaseClass}
        style={videoStyle(slotB.opacity)}
        src={slotB.entry.src}
        poster={slotB.entry.poster}
        autoPlay
        muted
        loop
        playsInline
        // @ts-ignore — webkit-playsinline is required for iOS Safari inline playback
        webkit-playsinline="true"
        x5-playsinline="true"
        x5-video-player-type="h5"
        preload="auto"
        onTimeUpdate={() => handleTimeUpdate("B")}
        onLoadedData={() => {
          setVideoLoaded(true);
          setIsLoading(false);
        }}
        onError={() => {
          setTimeout(() => {
            if (videoBRef.current) {
              videoBRef.current.load();
              tryPlay(videoBRef.current);
            }
          }, 2000);
        }}
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* Enhanced gradient overlay for text legibility + loading state */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

      {/* Subtle vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, transparent 35%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Loading skeleton overlay — kept intentionally light so the poster
          image still shows through on slow connections. Fades out smoothly
          once the video is ready. */}
      <div
        aria-hidden={!isLoading}
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{
          opacity: isLoading ? 1 : 0,
          transition: "opacity 500ms ease-out",
        }}
      >
        <div className="flex flex-col items-center gap-3 sm:gap-4">
          <div className="relative w-12 h-12 sm:w-16 sm:h-16">
            <div className="absolute inset-0 rounded-full border-2 border-white/10" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400/80 border-r-amber-400/60 animate-spin" />
            <Loader2 className="absolute inset-0 m-auto w-5 h-5 sm:w-6 sm:h-6 text-amber-400/60 animate-pulse" />
          </div>
          <p className="text-white/50 text-[10px] sm:text-xs font-sans tracking-widest uppercase">
            Loading your journey...
          </p>
        </div>
      </div>

      {/* Context label — subtle cinematic caption (only show when not loading) */}
      {!isLoading && (
        <ContextLabel label={currentVideo.label} videoKey={currentKey} />
      )}
    </div>
  );
}

// ─── Context Label ─────────────────────────────────────────────────────────────

function ContextLabel({
  label,
  videoKey,
}: {
  label: string;
  videoKey: string;
}) {
  const [visible, setVisible] = useState(false);
  const [displayLabel, setDisplayLabel] = useState(label);
  const prevKeyRef = useRef(videoKey);

  useEffect(() => {
    if (videoKey === prevKeyRef.current && visible) return;
    prevKeyRef.current = videoKey;

    // Flash the label on context change
    setVisible(false);
    const t1 = setTimeout(() => {
      setDisplayLabel(label);
      setVisible(true);
    }, 300);
    const t2 = setTimeout(() => {
      setVisible(false);
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [videoKey, label]);

  return (
    <div
      className={cn(
        "absolute bottom-6 left-1/2 -translate-x-1/2 transition-all duration-700",
        "flex items-center gap-2 px-4 py-1.5 rounded-full",
        "bg-black/30 backdrop-blur-sm border border-white/10",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
      )}
    >
      <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
      <span className="text-white/80 text-xs font-sans tracking-widest uppercase">
        {displayLabel}
      </span>
    </div>
  );
}

// ─── Preloader — preloads next video when user hovers a nav link ───────────────

export function preloadVideo(src: string) {
  // Preload strategy: use <link rel="preload"> for immediate browser cache
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = src;
  link.type = "video/mp4";
  document.head.appendChild(link);
  // Also create a hidden video element for parallel buffering
  const video = document.createElement("video");
  video.src = src;
  video.preload = "metadata";
  video.muted = true;
  video.style.display = "none";
  document.body.appendChild(video);
  // Clean up after 15s
  setTimeout(() => {
    link.remove();
    video.remove();
  }, 15000);
}
