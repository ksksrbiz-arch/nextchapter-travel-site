import { useEffect, useState, useRef, type ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

interface PageTransitionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wraps page content with smooth fade/slide transitions on route change.
 * Uses CSS animations for optimal performance.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  const [location] = useLocation();
  const [isVisible, setIsVisible] = useState(true);
  const [displayChildren, setDisplayChildren] = useState(children);
  const prevLocation = useRef(location);

  useEffect(() => {
    if (location !== prevLocation.current) {
      // Route changed - trigger exit animation
      setIsVisible(false);

      const timeout = setTimeout(() => {
        // After exit animation, update content and trigger enter animation
        setDisplayChildren(children);
        prevLocation.current = location;
        setIsVisible(true);
      }, 150); // Match exit animation duration

      return () => clearTimeout(timeout);
    } else {
      // Same route, just update children directly
      setDisplayChildren(children);
    }
  }, [location, children]);

  return (
    <div
      className={cn(
        "transition-all duration-200 ease-out",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2",
        className
      )}
    >
      {displayChildren}
    </div>
  );
}

/**
 * Simpler stagger animation for list items.
 * Wrap a list container and children will animate in sequence.
 */
export function StaggerContainer({
  children,
  className,
  delay = 50,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <div
      className={className}
      style={{ "--stagger-delay": `${delay}ms` } as React.CSSProperties}
    >
      {children}
    </div>
  );
}

/**
 * Individual stagger item - use inside StaggerContainer
 */
export function StaggerItem({
  children,
  index = 0,
  className,
}: {
  children: ReactNode;
  index?: number;
  className?: string;
}) {
  return (
    <div
      className={cn("animate-fade-in-up opacity-0", className)}
      style={{
        animationDelay: `calc(var(--stagger-delay, 50ms) * ${index})`,
        animationFillMode: "forwards",
      }}
    >
      {children}
    </div>
  );
}
