import { useRef, useState, type ReactNode, type TouchEvent } from "react";
import { cn } from "@/lib/utils";
import { Check, Trash2, Edit, MoreHorizontal } from "lucide-react";

interface SwipeAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  color: "default" | "danger" | "success" | "warning";
}

interface SwipeableCardProps {
  children: ReactNode;
  /** Left swipe reveals these actions */
  leftActions?: SwipeAction[];
  /** Right swipe reveals these actions */
  rightActions?: SwipeAction[];
  /** Threshold in pixels to trigger action reveal */
  threshold?: number;
  /** Maximum swipe distance */
  maxSwipe?: number;
  /** Additional classes */
  className?: string;
  /** Called when card is tapped (not swiped) */
  onClick?: () => void;
}

const ACTION_COLORS = {
  default: "bg-muted text-foreground",
  danger: "bg-red-500 text-white",
  success: "bg-green-500 text-white",
  warning: "bg-amber-500 text-white",
};

/**
 * Swipeable card component for mobile touch interactions.
 * Swipe left or right to reveal action buttons.
 *
 * @example
 * ```tsx
 * <SwipeableCard
 *   leftActions={[
 *     { icon: <Check />, label: "Done", onClick: markDone, color: "success" }
 *   ]}
 *   rightActions={[
 *     { icon: <Trash2 />, label: "Delete", onClick: deleteItem, color: "danger" }
 *   ]}
 * >
 *   <ItineraryItem {...item} />
 * </SwipeableCard>
 * ```
 */
export function SwipeableCard({
  children,
  leftActions = [],
  rightActions = [],
  threshold = 50,
  maxSwipe = 120,
  className,
  onClick,
}: SwipeableCardProps) {
  const [translateX, setTranslateX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);
  const startY = useRef(0);
  const currentX = useRef(0);
  const isHorizontalSwipe = useRef<boolean | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: TouchEvent) => {
    startX.current = e.touches[0].clientX;
    startY.current = e.touches[0].clientY;
    currentX.current = translateX;
    isHorizontalSwipe.current = null;
    setIsDragging(true);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - startX.current;
    const deltaY = e.touches[0].clientY - startY.current;

    // Determine swipe direction on first significant movement
    if (isHorizontalSwipe.current === null) {
      if (Math.abs(deltaX) > 10 || Math.abs(deltaY) > 10) {
        isHorizontalSwipe.current = Math.abs(deltaX) > Math.abs(deltaY);
      }
    }

    // Only handle horizontal swipes
    if (!isHorizontalSwipe.current) return;

    // Prevent vertical scroll during horizontal swipe
    e.preventDefault();

    let newTranslateX = currentX.current + deltaX;

    // Apply resistance at edges
    if (newTranslateX > 0 && leftActions.length === 0) {
      newTranslateX = newTranslateX * 0.3;
    } else if (newTranslateX < 0 && rightActions.length === 0) {
      newTranslateX = newTranslateX * 0.3;
    }

    // Clamp to max swipe
    newTranslateX = Math.max(-maxSwipe, Math.min(maxSwipe, newTranslateX));

    setTranslateX(newTranslateX);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    // Snap to action reveal or reset
    if (translateX > threshold && leftActions.length > 0) {
      setTranslateX(maxSwipe);
    } else if (translateX < -threshold && rightActions.length > 0) {
      setTranslateX(-maxSwipe);
    } else {
      setTranslateX(0);
    }
  };

  const resetSwipe = () => {
    setTranslateX(0);
  };

  const handleClick = () => {
    if (translateX !== 0) {
      resetSwipe();
    } else {
      onClick?.();
    }
  };

  return (
    <div className={cn("relative overflow-hidden rounded-xl", className)}>
      {/* Left actions (revealed on right swipe) */}
      {leftActions.length > 0 && (
        <div className="absolute left-0 top-0 bottom-0 flex items-stretch">
          {leftActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                action.onClick();
                resetSwipe();
              }}
              className={cn(
                "w-20 flex flex-col items-center justify-center gap-1 transition-transform",
                ACTION_COLORS[action.color]
              )}
              style={{
                transform: `translateX(${Math.min(0, translateX - maxSwipe)}px)`,
              }}
              aria-label={action.label}
            >
              {action.icon}
              <span className="text-xs font-sans">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Right actions (revealed on left swipe) */}
      {rightActions.length > 0 && (
        <div className="absolute right-0 top-0 bottom-0 flex items-stretch">
          {rightActions.map((action, i) => (
            <button
              key={i}
              onClick={() => {
                action.onClick();
                resetSwipe();
              }}
              className={cn(
                "w-20 flex flex-col items-center justify-center gap-1 transition-transform",
                ACTION_COLORS[action.color]
              )}
              style={{
                transform: `translateX(${Math.max(0, translateX + maxSwipe)}px)`,
              }}
              aria-label={action.label}
            >
              {action.icon}
              <span className="text-xs font-sans">{action.label}</span>
            </button>
          ))}
        </div>
      )}

      {/* Main card content */}
      <div
        ref={cardRef}
        className={cn(
          "relative bg-card border border-border transition-transform duration-200",
          isDragging && "transition-none"
        )}
        style={{ transform: `translateX(${translateX}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleClick}
      >
        {children}
      </div>
    </div>
  );
}

// Pre-built action configurations
export const SWIPE_ACTIONS = {
  delete: (onClick: () => void): SwipeAction => ({
    icon: <Trash2 className="w-5 h-5" />,
    label: "Delete",
    onClick,
    color: "danger",
  }),
  complete: (onClick: () => void): SwipeAction => ({
    icon: <Check className="w-5 h-5" />,
    label: "Done",
    onClick,
    color: "success",
  }),
  edit: (onClick: () => void): SwipeAction => ({
    icon: <Edit className="w-5 h-5" />,
    label: "Edit",
    onClick,
    color: "default",
  }),
  more: (onClick: () => void): SwipeAction => ({
    icon: <MoreHorizontal className="w-5 h-5" />,
    label: "More",
    onClick,
    color: "default",
  }),
};
