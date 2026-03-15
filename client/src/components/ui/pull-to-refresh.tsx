import { useRef, useState, type ReactNode, type TouchEvent } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";

interface PullToRefreshProps {
  /** Content to wrap */
  children: ReactNode;
  /** Called when refresh is triggered */
  onRefresh: () => Promise<void>;
  /** Minimum pull distance to trigger refresh */
  threshold?: number;
  /** Maximum pull distance */
  maxPull?: number;
  /** Custom refresh indicator */
  refreshIndicator?: ReactNode;
  /** Additional classes */
  className?: string;
  /** Whether refresh is currently disabled */
  disabled?: boolean;
}

/**
 * Pull-to-refresh wrapper for mobile scroll containers.
 * Pull down from top to trigger a refresh action.
 *
 * @example
 * ```tsx
 * <PullToRefresh onRefresh={async () => {
 *   await refetch();
 * }}>
 *   <div className="overflow-y-auto">
 *     {items.map(...)}
 *   </div>
 * </PullToRefresh>
 * ```
 */
export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  maxPull = 120,
  refreshIndicator,
  className,
  disabled = false,
}: PullToRefreshProps) {
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);
  const startY = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    if (disabled || isRefreshing) return;

    // Only start pull if at top of scroll container
    const container = containerRef.current;
    if (container && container.scrollTop > 0) return;

    startY.current = e.touches[0].clientY;
    setIsPulling(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isPulling || disabled || isRefreshing) return;

    const deltaY = e.touches[0].clientY - startY.current;

    // Only pull down, not up
    if (deltaY < 0) {
      setPullDistance(0);
      return;
    }

    // Apply resistance as pull increases
    const resistance = 0.5;
    const pull = Math.min(maxPull, deltaY * resistance);

    setPullDistance(pull);

    // Prevent scroll while pulling
    if (pull > 10) {
      e.preventDefault();
    }
  };

  const handleTouchEnd = async () => {
    if (!isPulling) return;

    setIsPulling(false);

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true);
      setPullDistance(60); // Hold at indicator position

      try {
        await onRefresh();
      } finally {
        setIsRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  };

  const progress = Math.min(1, pullDistance / threshold);
  const shouldTrigger = pullDistance >= threshold;

  return (
    <div className={cn("relative", className)}>
      {/* Pull indicator */}
      <div
        className={cn(
          "absolute left-0 right-0 flex items-center justify-center transition-transform duration-200 z-10",
          isPulling ? "transition-none" : ""
        )}
        style={{
          top: -60,
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {refreshIndicator || (
          <div
            className={cn(
              "w-10 h-10 rounded-full bg-card border border-border shadow-lg flex items-center justify-center transition-all",
              shouldTrigger && "bg-secondary border-secondary",
              isRefreshing && "animate-pulse"
            )}
          >
            <RefreshCw
              className={cn(
                "w-5 h-5 transition-all",
                shouldTrigger
                  ? "text-secondary-foreground"
                  : "text-muted-foreground",
                isRefreshing && "animate-spin"
              )}
              style={{
                transform: `rotate(${progress * 180}deg)`,
              }}
            />
          </div>
        )}
      </div>

      {/* Content wrapper */}
      <div
        ref={containerRef}
        className={cn(
          "transition-transform duration-200",
          isPulling && "transition-none"
        )}
        style={{
          transform: `translateY(${pullDistance}px)`,
        }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {children}
      </div>

      {/* Pull hint text */}
      {isPulling && pullDistance > 20 && (
        <div
          className="absolute left-0 right-0 text-center text-xs text-muted-foreground font-sans transition-opacity"
          style={{
            top: pullDistance - 20,
            opacity: progress,
          }}
        >
          {isRefreshing
            ? "Refreshing..."
            : shouldTrigger
              ? "Release to refresh"
              : "Pull to refresh"}
        </div>
      )}
    </div>
  );
}
