import { useState, useEffect, useRef, useMemo, type ReactNode } from "react";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";
import {
  Search,
  X,
  LayoutDashboard,
  Calendar,
  MessageSquare,
  CheckSquare,
  FileText,
  Globe,
  Plane,
  Bell,
  Home,
  Settings,
  HelpCircle,
  ArrowRight,
} from "lucide-react";
import {
  useKeyboardShortcuts,
  SHORTCUTS,
  formatShortcut,
} from "@/hooks/useKeyboardShortcuts";

interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon?: ReactNode;
  shortcut?: string;
  onSelect: () => void;
  category?: string;
  keywords?: string[];
}

interface CommandPaletteProps {
  /** Whether the palette is open */
  isOpen: boolean;
  /** Callback when palette should close */
  onClose: () => void;
  /** Additional custom commands */
  commands?: CommandItem[];
  /** Placeholder text */
  placeholder?: string;
}

/**
 * Command palette for quick navigation and actions.
 * Opens with ⌘K (Ctrl+K on Windows).
 *
 * @example
 * ```tsx
 * const { isOpen, open, close } = useCommandPalette();
 *
 * return (
 *   <CommandPalette isOpen={isOpen} onClose={close} />
 * );
 * ```
 */
export function CommandPalette({
  isOpen,
  onClose,
  commands = [],
  placeholder = "Search pages, commands, or type '?' for help...",
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [, navigate] = useLocation();

  // Default navigation commands
  const defaultCommands: CommandItem[] = useMemo(
    () => [
      {
        id: "home",
        label: "Go to Home",
        icon: <Home className="w-4 h-4" />,
        onSelect: () => {
          navigate("/");
          onClose();
        },
        category: "Navigation",
        keywords: ["landing", "main"],
      },
      {
        id: "dashboard",
        label: "Go to Dashboard",
        icon: <LayoutDashboard className="w-4 h-4" />,
        shortcut: formatShortcut({ key: "1", alt: true }),
        onSelect: () => {
          navigate("/portal");
          onClose();
        },
        category: "Navigation",
        keywords: ["portal", "overview"],
      },
      {
        id: "itinerary",
        label: "Go to Itinerary",
        icon: <Calendar className="w-4 h-4" />,
        shortcut: formatShortcut({ key: "2", alt: true }),
        onSelect: () => {
          navigate("/portal/itinerary");
          onClose();
        },
        category: "Navigation",
        keywords: ["schedule", "trip", "plan"],
      },
      {
        id: "messages",
        label: "Go to Messages",
        icon: <MessageSquare className="w-4 h-4" />,
        shortcut: formatShortcut({ key: "3", alt: true }),
        onSelect: () => {
          navigate("/portal/messages");
          onClose();
        },
        category: "Navigation",
        keywords: ["chat", "contact", "jessica"],
      },
      {
        id: "packing",
        label: "Go to Packing List",
        icon: <CheckSquare className="w-4 h-4" />,
        shortcut: formatShortcut({ key: "4", alt: true }),
        onSelect: () => {
          navigate("/portal/packing");
          onClose();
        },
        category: "Navigation",
        keywords: ["checklist", "items"],
      },
      {
        id: "documents",
        label: "Go to Documents",
        icon: <FileText className="w-4 h-4" />,
        onSelect: () => {
          navigate("/portal/documents");
          onClose();
        },
        category: "Navigation",
        keywords: ["files", "passport", "tickets"],
      },
      {
        id: "guides",
        label: "Go to Travel Guides",
        icon: <Globe className="w-4 h-4" />,
        onSelect: () => {
          navigate("/portal/guides");
          onClose();
        },
        category: "Navigation",
        keywords: ["tips", "destination"],
      },
      {
        id: "bookings",
        label: "Go to Bookings",
        icon: <Plane className="w-4 h-4" />,
        onSelect: () => {
          navigate("/portal/bookings");
          onClose();
        },
        category: "Navigation",
        keywords: ["reservations", "flights", "hotels"],
      },
      {
        id: "alerts",
        label: "Go to Alerts",
        icon: <Bell className="w-4 h-4" />,
        onSelect: () => {
          navigate("/portal/alerts");
          onClose();
        },
        category: "Navigation",
        keywords: ["notifications", "updates"],
      },
      {
        id: "help",
        label: "Show Keyboard Shortcuts",
        icon: <HelpCircle className="w-4 h-4" />,
        shortcut: "/",
        onSelect: () => {
          document.dispatchEvent(new KeyboardEvent("keydown", { key: "/" }));
          onClose();
        },
        category: "Help",
        keywords: ["shortcuts", "hotkeys"],
      },
    ],
    [navigate, onClose]
  );

  const allCommands = [...defaultCommands, ...commands];

  // Filter commands based on query
  const filteredCommands = useMemo(() => {
    if (!query.trim()) return allCommands;

    const lowerQuery = query.toLowerCase();
    return allCommands.filter(cmd => {
      const searchText = [
        cmd.label,
        cmd.description,
        cmd.category,
        ...(cmd.keywords || []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchText.includes(lowerQuery);
    });
  }, [query, allCommands]);

  // Group by category
  const groupedCommands = useMemo(() => {
    const groups: Record<string, CommandItem[]> = {};
    filteredCommands.forEach(cmd => {
      const cat = cmd.category || "General";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(cmd);
    });
    return groups;
  }, [filteredCommands]);

  const flatCommands = filteredCommands;

  // Reset selection when query changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 10);
    }
  }, [isOpen]);

  // Keyboard navigation
  useKeyboardShortcuts(
    [
      { combo: SHORTCUTS.escape, handler: onClose, description: "Close" },
      {
        combo: { key: "ArrowDown" },
        handler: () =>
          setSelectedIndex(i => Math.min(i + 1, flatCommands.length - 1)),
        description: "Next",
      },
      {
        combo: { key: "ArrowUp" },
        handler: () => setSelectedIndex(i => Math.max(i - 1, 0)),
        description: "Previous",
      },
      {
        combo: { key: "Enter" },
        handler: () => flatCommands[selectedIndex]?.onSelect(),
        description: "Select",
      },
    ],
    isOpen
  );

  // Scroll selected item into view
  useEffect(() => {
    const selectedEl = listRef.current?.querySelector(
      `[data-index="${selectedIndex}"]`
    );
    selectedEl?.scrollIntoView({ block: "nearest" });
  }, [selectedIndex]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 animate-in fade-in-0 duration-150"
        onClick={onClose}
      />

      {/* Palette */}
      <div className="fixed inset-x-4 top-[15%] max-w-xl mx-auto z-50 animate-in fade-in-0 slide-in-from-top-4 duration-200">
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
          {/* Search input */}
          <div className="flex items-center px-4 border-b border-border">
            <Search className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={placeholder}
              className="flex-1 px-3 py-4 bg-transparent border-0 outline-none text-foreground placeholder:text-muted-foreground font-sans"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 rounded hover:bg-accent text-muted-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <kbd className="ml-2 px-2 py-1 bg-muted border border-border rounded text-xs text-muted-foreground font-mono">
              esc
            </kbd>
          </div>

          {/* Results */}
          <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-2">
            {flatCommands.length === 0 ? (
              <div className="py-12 text-center">
                <Search className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground font-sans text-sm">
                  No results found for "{query}"
                </p>
              </div>
            ) : (
              Object.entries(groupedCommands).map(([category, items]) => (
                <div key={category} className="mb-2">
                  <div className="px-3 py-2 text-xs font-sans font-semibold text-muted-foreground uppercase tracking-wider">
                    {category}
                  </div>
                  {items.map(cmd => {
                    const index = flatCommands.indexOf(cmd);
                    const isSelected = index === selectedIndex;
                    return (
                      <button
                        key={cmd.id}
                        data-index={index}
                        onClick={cmd.onSelect}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-left",
                          isSelected
                            ? "bg-secondary text-secondary-foreground"
                            : "text-foreground hover:bg-accent"
                        )}
                      >
                        <div
                          className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                            isSelected
                              ? "bg-secondary-foreground/20"
                              : "bg-muted"
                          )}
                        >
                          {cmd.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-sans font-medium truncate">
                            {cmd.label}
                          </p>
                          {cmd.description && (
                            <p
                              className={cn(
                                "text-xs truncate",
                                isSelected
                                  ? "text-secondary-foreground/70"
                                  : "text-muted-foreground"
                              )}
                            >
                              {cmd.description}
                            </p>
                          )}
                        </div>
                        {cmd.shortcut && (
                          <kbd
                            className={cn(
                              "px-2 py-1 rounded text-xs font-mono flex-shrink-0",
                              isSelected
                                ? "bg-secondary-foreground/20 text-secondary-foreground"
                                : "bg-muted text-muted-foreground"
                            )}
                          >
                            {cmd.shortcut}
                          </kbd>
                        )}
                        {isSelected && (
                          <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-50" />
                        )}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-border bg-muted/30 flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-sans">
              <kbd className="px-1.5 py-0.5 bg-muted rounded mx-1">↑</kbd>
              <kbd className="px-1.5 py-0.5 bg-muted rounded mx-1">↓</kbd>
              to navigate
            </span>
            <span className="font-sans">
              <kbd className="px-1.5 py-0.5 bg-muted rounded mx-1">Enter</kbd>
              to select
            </span>
          </div>
        </div>
      </div>
    </>
  );
}

/**
 * Hook to manage command palette state.
 * Includes ⌘K shortcut to open.
 */
export function useCommandPalette() {
  const [isOpen, setIsOpen] = useState(false);

  useKeyboardShortcuts([
    {
      combo: SHORTCUTS.search,
      handler: () => setIsOpen(true),
      description: "Open command palette",
    },
  ]);

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen(v => !v),
  };
}
