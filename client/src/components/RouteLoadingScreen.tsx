import { Loader2 } from "lucide-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const ROUTE_LOADING_Z_INDEX = 70;

export default function RouteLoadingScreen() {
  const reducedMotion = useReducedMotion();

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950/65 via-slate-900/35 to-slate-950/70 backdrop-blur-sm px-4"
      style={{
        zIndex: ROUTE_LOADING_Z_INDEX,
        // Use the dynamic viewport unit so the overlay always fills the
        // visible area on mobile (URL bar collapsing/expanding) without
        // overlapping system UI. Falls back to 100vh for older browsers.
        minHeight: "100dvh",
      }}
      role="status"
      aria-live="polite"
      aria-label="Loading page"
    >
      <div className="absolute top-0 left-0 right-0 h-1 overflow-hidden bg-white/10">
        <div
          className={reducedMotion ? "h-full w-full bg-amber-400/70" : "route-progress-bar"}
        />
      </div>
      <div className="flex flex-col items-center gap-3 sm:gap-4 rounded-2xl border border-white/10 bg-black/25 px-6 py-5 sm:px-8 sm:py-7 backdrop-blur-md max-w-[92vw]">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full border border-amber-300/30 bg-amber-400/10 flex items-center justify-center">
          <Loader2
            className={
              reducedMotion
                ? "w-5 h-5 sm:w-6 sm:h-6 text-amber-300"
                : "w-5 h-5 sm:w-6 sm:h-6 text-amber-300 animate-spin"
            }
          />
        </div>
        <p className="text-[10px] sm:text-[11px] tracking-[0.22em] uppercase text-white/70 font-sans text-center">
          Loading your journey...
        </p>
      </div>
    </div>
  );
}
