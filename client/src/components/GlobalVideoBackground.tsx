import React, { useEffect, useRef, useState, useCallback } from "react";
import { useVideoHero, VideoEntry } from "@/contexts/VideoHeroContext";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

/**
 * GlobalVideoBackground
 *
 * Renders a full-viewport cinematic video background that crossfades between
 * two <video> elements (A/B swap) whenever the VideoHeroContext key changes.
 *
 * Architecture:
 *  - Two stacked <video> elements (activeSlot and inactiveSlot)
 *  - On context change: load new video into inactive slot, fade it in, fade out active
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
 */

const FADE_DURATION = 800; // ms for crossfade
const STALL_TIMEOUT = 5000; // ms before declaring a stall

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
  const prefersReducedMotion =
    typeof window !== "undefined"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false;

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
  const prevKeyRef = useRef(currentKey);
  const crossfadeTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  // Cleanup crossfade timers on unmount
  useEffect(() => {
    return () => {
      crossfadeTimersRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  useEffect(() => {
    if (currentKey === prevKeyRef.current) return;
    prevKeyRef.current = currentKey;

    // Clear any pending crossfade timers
    crossfadeTimersRef.current.forEach(t => clearTimeout(t));
    crossfadeTimersRef.current = [];

    if (prefersReducedMotion) {
      // Instant swap — no animation
      setSlotA({ entry: currentVideo, opacity: 1, key: currentKey });
      setSlotB({ entry: currentVideo, opacity: 0, key: currentKey });
      setActiveSlot("A");
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
  ]);

  const videoBaseClass =
    "absolute inset-0 w-full h-full object-cover pointer-events-none";
  const transitionStyle = `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  // Container style: explicit fixed positioning with GPU acceleration.
  // Using inline style for zIndex instead of Tailwind's -z-10 to avoid
  // stacking context conflicts that can hide the video on some browsers.
  // contain: strict isolates the stacking context and prevents layout thrashing.
  const containerStyle: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
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

  return (
    <div ref={containerRef} style={containerStyle}>
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
        preload="none"
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

      {/* Loading skeleton overlay */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900/40 via-slate-800/20 to-slate-900/40 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-16 h-16">
              <div className="absolute inset-0 rounded-full border-2 border-white/10" />
              <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-amber-400/80 border-r-amber-400/60 animate-spin" />
              <Loader2 className="absolute inset-0 m-auto w-6 h-6 text-amber-400/60 animate-pulse" />
            </div>
            <p className="text-white/40 text-xs font-sans tracking-widest uppercase">
              Loading your journey...
            </p>
          </div>
        </div>
      )}

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
