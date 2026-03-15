import { useEffect, useCallback } from "react";

type KeyCombo = {
  key: string;
  ctrl?: boolean;
  shift?: boolean;
  alt?: boolean;
  meta?: boolean;
};

type ShortcutHandler = () => void;

interface Shortcut {
  combo: KeyCombo;
  handler: ShortcutHandler;
  description: string;
  /** Only active when this element (or its children) is focused */
  scope?: string;
}

/**
 * Keyboard shortcut manager hook.
 *
 * @example
 * ```tsx
 * useKeyboardShortcuts([
 *   {
 *     combo: { key: "k", meta: true },
 *     handler: () => setSearchOpen(true),
 *     description: "Open search"
 *   },
 *   {
 *     combo: { key: "Escape" },
 *     handler: () => setModalOpen(false),
 *     description: "Close modal"
 *   },
 * ]);
 * ```
 */
export function useKeyboardShortcuts(shortcuts: Shortcut[], enabled = true) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in inputs
      const target = event.target as HTMLElement;
      const isEditable =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      for (const shortcut of shortcuts) {
        const { combo, handler, scope } = shortcut;

        // Check if scope matches (if specified)
        if (scope) {
          const scopeElement = document.querySelector(scope);
          if (!scopeElement?.contains(document.activeElement)) continue;
        }

        // Allow Escape in editable fields (for closing modals)
        if (isEditable && combo.key !== "Escape") continue;

        const keyMatches =
          event.key.toLowerCase() === combo.key.toLowerCase() ||
          event.code.toLowerCase() === combo.key.toLowerCase();

        const modifiersMatch =
          !!combo.ctrl === (event.ctrlKey || event.metaKey) &&
          !!combo.shift === event.shiftKey &&
          !!combo.alt === event.altKey;

        // Special handling for meta key on Mac
        const metaMatches = combo.meta ? event.metaKey || event.ctrlKey : true;

        if (keyMatches && modifiersMatch && metaMatches) {
          event.preventDefault();
          event.stopPropagation();
          handler();
          return;
        }
      }
    },
    [shortcuts, enabled]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);
}

/**
 * Common shortcut patterns
 */
export const SHORTCUTS = {
  search: { key: "k", meta: true },
  escape: { key: "Escape" },
  save: { key: "s", ctrl: true },
  new: { key: "n", ctrl: true },
  delete: { key: "Backspace", ctrl: true },
  goBack: { key: "ArrowLeft", alt: true },
  goForward: { key: "ArrowRight", alt: true },
  nextItem: { key: "j" },
  prevItem: { key: "k" },
  toggleSidebar: { key: "b", ctrl: true },
  help: { key: "/" },
};

/**
 * Creates a shortcut string for display (e.g., "⌘K" or "Ctrl+K")
 */
export function formatShortcut(combo: KeyCombo): string {
  const isMac =
    typeof navigator !== "undefined" && navigator.platform.includes("Mac");
  const parts: string[] = [];

  if (combo.ctrl) parts.push(isMac ? "⌃" : "Ctrl");
  if (combo.meta) parts.push(isMac ? "⌘" : "Ctrl");
  if (combo.shift) parts.push(isMac ? "⇧" : "Shift");
  if (combo.alt) parts.push(isMac ? "⌥" : "Alt");

  // Format the key nicely
  const key =
    combo.key.length === 1
      ? combo.key.toUpperCase()
      : combo.key.replace("Arrow", "").replace("Escape", "Esc");

  parts.push(key);

  return isMac ? parts.join("") : parts.join("+");
}
