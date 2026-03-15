import { useState, useRef, useEffect, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Plus, X } from "lucide-react";

interface FABAction {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  className?: string;
}

interface FloatingActionButtonProps {
  /** Primary icon when closed (defaults to Plus) */
  icon?: ReactNode;
  /** Icon when open (defaults to X) */
  openIcon?: ReactNode;
  /** Speed dial actions */
  actions?: FABAction[];
  /** Single action mode - just one button */
  onClick?: () => void;
  /** Position on screen */
  position?: "bottom-right" | "bottom-left" | "bottom-center";
  /** Custom class for main button */
  className?: string;
  /** Label for accessibility */
  label?: string;
  /** Whether to show above mobile nav */
  aboveMobileNav?: boolean;
}

/**
 * Floating Action Button with optional speed-dial menu.
 * Great for primary actions like "New Message", "Add Item", etc.
 *
 * @example
 * ```tsx
 * // Simple FAB
 * <FloatingActionButton
 *   icon={<Plus />}
 *   onClick={() => setShowForm(true)}
 *   label="Add new item"
 * />
 *
 * // Speed dial FAB
 * <FloatingActionButton
 *   actions={[
 *     { icon: <MessageSquare />, label: "New Message", onClick: () => {} },
 *     { icon: <Phone />, label: "Call Agent", onClick: () => {} },
 *   ]}
 * />
 * ```
 */
export function FloatingActionButton({
  icon,
  openIcon,
  actions,
  onClick,
  position = "bottom-right",
  className,
  label = "Quick actions",
  aboveMobileNav = true,
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on escape
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  const hasActions = actions && actions.length > 0;

  const handleMainClick = () => {
    if (hasActions) {
      setIsOpen(!isOpen);
    } else {
      onClick?.();
    }
  };

  const handleActionClick = (action: FABAction) => {
    action.onClick();
    setIsOpen(false);
  };

  const positionClasses = {
    "bottom-right": "right-4 sm:right-6",
    "bottom-left": "left-4 sm:left-6",
    "bottom-center": "left-1/2 -translate-x-1/2",
  };

  const bottomOffset = aboveMobileNav ? "bottom-20 md:bottom-6" : "bottom-6";

  return (
    <div
      ref={containerRef}
      className={cn("fixed z-40", positionClasses[position], bottomOffset)}
    >
      {/* Speed dial actions */}
      {hasActions && (
        <div
          className={cn(
            "absolute bottom-full mb-3 flex flex-col-reverse gap-2 transition-all duration-200",
            isOpen
              ? "opacity-100 translate-y-0 pointer-events-auto"
              : "opacity-0 translate-y-4 pointer-events-none"
          )}
        >
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={() => handleActionClick(action)}
              className={cn(
                "group flex items-center gap-3 transition-all duration-200",
                isOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              )}
              style={{
                transitionDelay: isOpen ? `${index * 50}ms` : "0ms",
              }}
              aria-label={action.label}
            >
              {/* Label tooltip */}
              <span className="px-3 py-1.5 bg-card border border-border rounded-lg text-sm font-sans text-foreground shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {action.label}
              </span>

              {/* Action button */}
              <div
                className={cn(
                  "w-12 h-12 rounded-full bg-card border border-border shadow-lg flex items-center justify-center text-foreground hover:bg-secondary hover:text-secondary-foreground hover:border-secondary transition-all active:scale-95",
                  action.className
                )}
              >
                {action.icon}
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Main FAB */}
      <button
        onClick={handleMainClick}
        className={cn(
          "w-14 h-14 rounded-full bg-secondary text-secondary-foreground shadow-xl flex items-center justify-center transition-all duration-200 hover:bg-secondary/90 active:scale-95 focus-visible:ring-2 focus-visible:ring-secondary focus-visible:ring-offset-2",
          isOpen &&
            "rotate-45 bg-muted text-muted-foreground hover:bg-muted/90",
          className
        )}
        aria-label={label}
        aria-expanded={hasActions ? isOpen : undefined}
      >
        {isOpen
          ? openIcon || <X className="w-6 h-6" />
          : icon || <Plus className="w-6 h-6" />}
      </button>

      {/* Backdrop for mobile */}
      {isOpen && hasActions && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
}
