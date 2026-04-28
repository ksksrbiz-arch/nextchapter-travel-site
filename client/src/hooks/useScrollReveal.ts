import { useEffect } from "react";

/**
 * useScrollReveal
 *
 * Adds a one-shot IntersectionObserver that toggles
 * `data-revealed="true"` on every element matching `[data-reveal]`
 * inside the scoped root (or the whole document if no root is given)
 * once it scrolls into view. Pairs with the CSS in `index.css` that
 * styles `[data-reveal]` (initial hidden state) and
 * `[data-reveal][data-revealed="true"]` (revealed state).
 *
 * Respects `prefers-reduced-motion` — when reduced motion is on, the
 * CSS already disables the animation, but we still mark elements as
 * revealed immediately so they are visible without any transition.
 */
export function useScrollReveal(rootRef?: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const scope: ParentNode = rootRef?.current ?? document;
    const targets = Array.from(
      scope.querySelectorAll<HTMLElement>("[data-reveal]")
    );
    if (targets.length === 0) return;

    const prefersReducedMotion =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion || typeof IntersectionObserver === "undefined") {
      targets.forEach(el => el.setAttribute("data-revealed", "true"));
      return;
    }

    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            (entry.target as HTMLElement).setAttribute(
              "data-revealed",
              "true"
            );
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, [rootRef]);
}
