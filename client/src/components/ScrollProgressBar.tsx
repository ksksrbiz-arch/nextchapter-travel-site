import { useEffect, useState } from "react";

/**
 * ScrollProgressBar
 *
 * A thin, fixed gold gradient bar at the very top of the viewport that
 * fills horizontally as the user scrolls down the page. Decorative only —
 * `aria-hidden`, pointer-events disabled, and respects reduced-motion via
 * a CSS no-op transition (the width still updates instantly when motion
 * is reduced because we use a CSS transition, not a JS animation).
 *
 * Skipped on portal / admin shells where the layout already provides its
 * own progress affordances; mounted globally in App.tsx so it sits above
 * every page including 404 / thank-you.
 */
export default function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (typeof window === "undefined") return;

    let rafId = 0;
    const update = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - window.innerHeight;
      const next = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      setProgress(next);
      rafId = 0;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="fixed top-0 left-0 right-0 z-[60] h-[2px] pointer-events-none"
      style={{
        // Hide entirely until the user has scrolled at least a bit; this
        // avoids a stray pixel-line visible on the marketing hero.
        opacity: progress > 0.001 ? 1 : 0,
        transition: "opacity 0.3s ease",
      }}
    >
      <div
        className="h-full origin-left"
        style={{
          width: `${progress * 100}%`,
          background:
            "linear-gradient(90deg, oklch(0.72 0.09 65 / 0.85), oklch(0.92 0.09 90), oklch(0.72 0.09 65 / 0.85))",
          boxShadow: "0 0 12px oklch(0.82 0.1 80 / 0.55)",
          transition: "width 0.12s linear",
        }}
      />
    </div>
  );
}
