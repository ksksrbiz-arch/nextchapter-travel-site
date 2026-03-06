import { useEffect, useRef, useState } from "react";
import { useVideoHero, VIDEO_CATALOG, VideoEntry } from "@/contexts/VideoHeroContext";
import { cn } from "@/lib/utils";

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
 */

const FADE_DURATION = 800; // ms for crossfade

// iOS Safari requires a user gesture for video playback in some cases.
// We attempt autoplay immediately and retry on first user interaction.
function tryPlay(el: HTMLVideoElement | null) {
  if (!el) return;
  el.muted = true; // must be set programmatically for iOS
  const p = el.play();
  if (p !== undefined) {
    p.catch(() => {
      // Autoplay blocked — retry on first touch/click
      const retry = () => {
        el.play().catch(() => {});
        document.removeEventListener("touchstart", retry);
        document.removeEventListener("click", retry);
      };
      document.addEventListener("touchstart", retry, { once: true });
      document.addEventListener("click", retry, { once: true });
    });
  }
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

  // Track if any video has loaded (to remove fallback bg)
  const [videoLoaded, setVideoLoaded] = useState(false);

  // Kick off initial autoplay on mount
  useEffect(() => {
    const el = videoARef.current;
    if (!el) return;
    const onCanPlay = () => setVideoLoaded(true);
    el.addEventListener('canplay', onCanPlay, { once: true });
    // If already ready
    if (el.readyState >= 3) setVideoLoaded(true);
    tryPlay(el);
    return () => el.removeEventListener('canplay', onCanPlay);
  }, []);

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

  useEffect(() => {
    if (currentKey === prevKeyRef.current) return;
    prevKeyRef.current = currentKey;

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
        videoBRef.current?.load();
        tryPlay(videoBRef.current);
        // Fade B in, fade A out
        setTimeout(() => {
          setSlotB(prev => ({ ...prev, opacity: 1 }));
          setSlotA(prev => ({ ...prev, opacity: 0 }));
          // After fade completes, swap active slot
          setTimeout(() => {
            setActiveSlot("B");
          }, FADE_DURATION);
        }, 50);
      });
    } else {
      // Load new video into A
      setSlotA({ entry: currentVideo, opacity: 0, key: currentKey });
      requestAnimationFrame(() => {
        videoARef.current?.load();
        tryPlay(videoARef.current);
        setTimeout(() => {
          setSlotA(prev => ({ ...prev, opacity: 1 }));
          setSlotB(prev => ({ ...prev, opacity: 0 }));
          setTimeout(() => {
            setActiveSlot("A");
          }, FADE_DURATION);
        }, 50);
      });
    }
  }, [currentKey, currentVideo, activeSlot, prefersReducedMotion]);

  const videoBaseClass = "absolute inset-0 w-full h-full object-cover pointer-events-none";
  const transitionStyle = `opacity ${FADE_DURATION}ms cubic-bezier(0.4, 0, 0.2, 1)`;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: videoLoaded ? 'transparent' : '#0a1628' }}>
      {/* Slot A */}
      <video
        ref={videoARef}
        key={`A-${slotA.key}`}
        className={videoBaseClass}
        style={{ opacity: slotA.opacity, transition: transitionStyle }}
        src={slotA.entry.src}
        poster={slotA.entry.poster}
        autoPlay
        muted
        loop
        playsInline
        // @ts-ignore — webkit-playsinline is required for iOS Safari inline playback
        webkit-playsinline="true"
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* Slot B */}
      <video
        ref={videoBRef}
        key={`B-${slotB.key}`}
        className={videoBaseClass}
        style={{ opacity: slotB.opacity, transition: transitionStyle }}
        src={slotB.entry.src}
        poster={slotB.entry.poster}
        autoPlay
        muted
        loop
        playsInline
        // @ts-ignore — webkit-playsinline is required for iOS Safari inline playback
        webkit-playsinline="true"
        preload="none"
        disablePictureInPicture
        disableRemotePlayback
      />

      {/* Multi-layer gradient overlay for text legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/70" />

      {/* Subtle vignette */}
      <div className="absolute inset-0"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)"
        }}
      />

      {/* Context label — subtle cinematic caption */}
      <ContextLabel label={currentVideo.label} videoKey={currentKey} />
    </div>
  );
}

// ─── Context Label ─────────────────────────────────────────────────────────────

function ContextLabel({ label, videoKey }: { label: string; videoKey: string }) {
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

    return () => { clearTimeout(t1); clearTimeout(t2); };
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
  const link = document.createElement("link");
  link.rel = "preload";
  link.as = "video";
  link.href = src;
  document.head.appendChild(link);
  // Clean up after 10s
  setTimeout(() => link.remove(), 10000);
}
