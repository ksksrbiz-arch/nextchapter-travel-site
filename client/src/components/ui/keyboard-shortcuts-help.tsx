import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { X, Keyboard, Command } from "lucide-react";
import {
  useKeyboardShortcuts,
  formatShortcut,
  SHORTCUTS,
} from "@/hooks/useKeyboardShortcuts";

interface KeyboardShortcut {
  keys: string;
  description: string;
  category?: string;
}

const PORTAL_SHORTCUTS: KeyboardShortcut[] = [
  {
    keys: formatShortcut(SHORTCUTS.search),
    description: "Open search",
    category: "Navigation",
  },
  {
    keys: formatShortcut(SHORTCUTS.escape),
    description: "Close dialog / Cancel",
    category: "Navigation",
  },
  {
    keys: formatShortcut(SHORTCUTS.goBack),
    description: "Go back",
    category: "Navigation",
  },
  {
    keys: formatShortcut({ key: "1", alt: true }),
    description: "Go to Dashboard",
    category: "Navigation",
  },
  {
    keys: formatShortcut({ key: "2", alt: true }),
    description: "Go to Itinerary",
    category: "Navigation",
  },
  {
    keys: formatShortcut({ key: "3", alt: true }),
    description: "Go to Messages",
    category: "Navigation",
  },
  {
    keys: formatShortcut({ key: "4", alt: true }),
    description: "Go to Packing",
    category: "Navigation",
  },
  {
    keys: formatShortcut(SHORTCUTS.new),
    description: "New message / item",
    category: "Actions",
  },
  {
    keys: formatShortcut(SHORTCUTS.save),
    description: "Save changes",
    category: "Actions",
  },
  {
    keys: formatShortcut(SHORTCUTS.help),
    description: "Show this help",
    category: "Help",
  },
];

interface KeyboardShortcutsHelpProps {
  /** Whether the help dialog is open */
  isOpen: boolean;
  /** Callback when dialog should close */
  onClose: () => void;
  /** Additional shortcuts specific to the current page */
  pageShortcuts?: KeyboardShortcut[];
  /** Title for the dialog */
  title?: string;
}

/**
 * Keyboard shortcuts help dialog.
 * Shows all available keyboard shortcuts organized by category.
 */
export function KeyboardShortcutsHelp({
  isOpen,
  onClose,
  pageShortcuts = [],
  title = "Keyboard Shortcuts",
}: KeyboardShortcutsHelpProps) {
  // Close on escape
  useKeyboardShortcuts(
    [{ combo: SHORTCUTS.escape, handler: onClose, description: "Close help" }],
    isOpen
  );

  if (!isOpen) return null;

  const allShortcuts = [...PORTAL_SHORTCUTS, ...pageShortcuts];
  const categories = Array.from(
    new Set(allShortcuts.map(s => s.category || "General"))
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="fixed inset-x-4 top-[10%] max-w-lg mx-auto z-50 animate-in fade-in-0 slide-in-from-bottom-4 duration-300">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                <Keyboard className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <h2 className="font-serif font-bold text-lg text-foreground">
                  {title}
                </h2>
                <p className="text-xs text-muted-foreground font-sans">
                  Press{" "}
                  <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs mx-0.5">
                    /
                  </kbd>{" "}
                  anytime to show this
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Shortcuts list */}
          <div className="max-h-[60vh] overflow-y-auto p-6 space-y-6">
            {categories.map(category => (
              <div key={category}>
                <h3 className="text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                  {category}
                </h3>
                <div className="space-y-2">
                  {allShortcuts
                    .filter(s => (s.category || "General") === category)
                    .map((shortcut, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <span className="text-sm font-sans text-foreground">
                          {shortcut.description}
                        </span>
                        <kbd className="px-2 py-1 bg-muted border border-border rounded-md text-xs font-mono text-muted-foreground min-w-[40px] text-center">
                          {shortcut.keys}
                        </kbd>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-border bg-muted/30">
            <p className="text-xs text-muted-foreground font-sans text-center flex items-center justify-center gap-2">
              <Command className="w-3.5 h-3.5" />
              Pro tip: Use{" "}
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs">
                ⌘K
              </kbd>{" "}
              to quickly search anything
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Hook to manage keyboard shortcuts help dialog state.
 * Includes the "/" shortcut to open the dialog.
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useKeyboardShortcutsHelp();
 *
 * return (
 *   <>
 *     <button onClick={open}>Show shortcuts</button>
 *     <KeyboardShortcutsHelp isOpen={isOpen} onClose={close} />
 *   </>
 * );
 * ```
 */
export function useKeyboardShortcutsHelp() {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcuts([
    {
      combo: SHORTCUTS.help,
      handler: () => setIsOpen(true),
      description: "Show keyboard shortcuts",
    },
  ]);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(v => !v),
  };
}
