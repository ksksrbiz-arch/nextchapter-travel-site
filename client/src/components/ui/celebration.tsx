import { useEffect, useState, useCallback } from "react";
import { cn } from "@/lib/utils";

interface ConfettiPiece {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  size: number;
}

interface ConfettiProps {
  /** Trigger confetti animation */
  active: boolean;
  /** Number of confetti pieces */
  count?: number;
  /** Duration in ms before auto-cleanup */
  duration?: number;
  /** Callback when animation completes */
  onComplete?: () => void;
  /** Custom colors (defaults to gold/amber theme) */
  colors?: string[];
}

const DEFAULT_COLORS = [
  "oklch(0.72 0.09 65)", // gold
  "oklch(0.80 0.10 75)", // light gold
  "oklch(0.65 0.08 60)", // dark gold
  "oklch(0.90 0.05 90)", // cream
  "oklch(0.50 0.03 240)", // navy accent
];

/**
 * Celebration confetti component.
 * Triggers a burst of confetti pieces that fall with physics-based animation.
 *
 * @example
 * ```tsx
 * const [celebrate, setCelebrate] = useState(false);
 *
 * <Confetti
 *   active={celebrate}
 *   onComplete={() => setCelebrate(false)}
 * />
 *
 * <Button onClick={() => setCelebrate(true)}>
 *   Book Trip!
 * </Button>
 * ```
 */
export function Confetti({
  active,
  count = 50,
  duration = 3000,
  onComplete,
  colors = DEFAULT_COLORS,
}: ConfettiProps) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  const generatePieces = useCallback(() => {
    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < count; i++) {
      newPieces.push({
        id: i,
        x: Math.random() * 100, // % from left
        color: colors[Math.floor(Math.random() * colors.length)],
        delay: Math.random() * 500, // stagger start
        duration: 2000 + Math.random() * 1500, // fall duration
        rotation: Math.random() * 360,
        size: 6 + Math.random() * 8, // 6-14px
      });
    }
    return newPieces;
  }, [count, colors]);

  useEffect(() => {
    if (active) {
      setPieces(generatePieces());

      const timeout = setTimeout(() => {
        setPieces([]);
        onComplete?.();
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      setPieces([]);
    }
  }, [active, duration, generatePieces, onComplete]);

  if (!active || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      {pieces.map(piece => (
        <div
          key={piece.id}
          className="absolute top-0 animate-confetti-fall"
          style={{
            left: `${piece.x}%`,
            animationDelay: `${piece.delay}ms`,
            animationDuration: `${piece.duration}ms`,
          }}
        >
          <div
            className="animate-confetti-spin"
            style={{
              width: `${piece.size}px`,
              height: `${piece.size * 0.6}px`,
              backgroundColor: piece.color,
              borderRadius: "2px",
              transform: `rotate(${piece.rotation}deg)`,
              animationDuration: `${500 + Math.random() * 500}ms`,
            }}
          />
        </div>
      ))}
    </div>
  );
}

/**
 * Success checkmark animation - great for form completions
 */
export function SuccessCheckmark({
  show,
  size = 64,
  className,
}: {
  show: boolean;
  size?: number;
  className?: string;
}) {
  if (!show) return null;

  return (
    <div
      className={cn("flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg
        className="animate-success-checkmark"
        viewBox="0 0 52 52"
        width={size}
        height={size}
      >
        <circle
          className="animate-success-circle"
          cx="26"
          cy="26"
          r="24"
          fill="none"
          stroke="oklch(0.72 0.09 65)"
          strokeWidth="3"
        />
        <path
          className="animate-success-check"
          fill="none"
          stroke="oklch(0.72 0.09 65)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M14 27l7 7 16-16"
        />
      </svg>
    </div>
  );
}

/**
 * Pulsing dot indicator - for active/live states
 */
export function PulsingDot({
  color = "bg-green-500",
  size = "sm",
  className,
}: {
  color?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const sizes = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  return (
    <span className={cn("relative inline-flex", className)}>
      <span
        className={cn(
          "animate-ping absolute inline-flex h-full w-full rounded-full opacity-75",
          color
        )}
      />
      <span
        className={cn("relative inline-flex rounded-full", color, sizes[size])}
      />
    </span>
  );
}

/**
 * Typing indicator (three bouncing dots)
 */
export function TypingIndicator({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  );
}

/**
 * Shimmer loading placeholder - for images or cards
 */
export function ShimmerPlaceholder({
  className,
  rounded = "rounded-lg",
}: {
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn("relative overflow-hidden bg-muted", rounded, className)}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
