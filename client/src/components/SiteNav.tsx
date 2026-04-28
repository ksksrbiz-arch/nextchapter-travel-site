import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Menu, X, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Destinations", href: "/destinations" },
  { label: "Deals", href: "/deals" },
  { label: "Services", href: "/services" },
  { label: "About", href: "/about" },
];

interface SiteNavProps {
  /** Force the scrolled (solid) style even when the page is at the top */
  alwaysSolid?: boolean;
  /** Context key to preload on hover of the CTA */
  ctaPreloadContext?: string;
}

export default function SiteNav({ alwaysSolid = false, ctaPreloadContext }: SiteNavProps) {
  const { preloadContext } = useVideoHero();
  const [isScrolled, setIsScrolled] = useState(alwaysSolid);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location] = useLocation();

  useEffect(() => {
    if (alwaysSolid) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [alwaysSolid]);

  const handleCtaHover = () => {
    if (ctaPreloadContext) preloadContext(ctaPreloadContext);
    else preloadContext("plan-my-trip");
  };

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 sm:h-20">
        {/* Brand */}
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer group">
            <BookOpen className="w-5 h-5 text-secondary group-hover:scale-110 transition-transform" />
            <span className="text-xl sm:text-2xl font-serif font-bold text-secondary hover:text-secondary/80 transition-colors">
              Next Chapter Travel
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(link => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "nav-link-underline relative text-foreground hover:text-secondary transition-colors font-sans text-sm pb-0.5",
                  isActive && "text-secondary"
                )}
              >
                {link.label}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute bottom-[-3px] left-0 right-0 h-[2px] rounded bg-gradient-to-r from-secondary to-secondary/70"
                  />
                )}
              </Link>
            );
          })}
          <Link href="/plan-my-trip">
            <Button
              size="sm"
              className="btn-shimmer bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold"
              onMouseEnter={handleCtaHover}
              onFocus={handleCtaHover}
            >
              Plan My Trip
            </Button>
          </Link>
          <a href={getLoginUrl()}>
            <Button
              size="sm"
              variant="outline"
              className="bg-background/40 backdrop-blur-md border-border hover:bg-background/60 font-sans font-bold"
            >
              Client Portal
            </Button>
          </a>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(prev => !prev)}
          className="md:hidden p-3 min-w-[48px] min-h-[48px] flex items-center justify-center hover:bg-secondary/10 rounded-xl transition-colors active:scale-95"
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={cn(
          "md:hidden bg-primary/98 backdrop-blur-lg border-t border-border overflow-y-auto transition-all duration-300 ease-out",
          mobileMenuOpen
            ? "max-h-[calc(100dvh-4rem)] opacity-100"
            : "max-h-0 opacity-0"
        )}
      >
        <div
          className="container py-6 flex flex-col gap-3"
          style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))" }}
        >
          {NAV_LINKS.map(link => {
            const isActive = location === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "transition-colors font-sans py-3 px-4 rounded-xl min-h-[48px] flex items-center active:scale-[0.98]",
                  isActive
                    ? "text-secondary bg-secondary/15 border border-secondary/30"
                    : "text-foreground hover:text-secondary hover:bg-secondary/10"
                )}
              >
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border/50 flex flex-col gap-3">
            <Link
              href="/plan-my-trip"
              onClick={() => setMobileMenuOpen(false)}
              onMouseEnter={handleCtaHover}
              onFocus={handleCtaHover}
            >
              <Button className="btn-shimmer w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold min-h-[52px] text-base rounded-xl active:scale-[0.98] transition-transform">
                Plan My Trip
              </Button>
            </Link>
            <a href={getLoginUrl()} className="w-full">
              <Button
                variant="outline"
                className="w-full bg-background/40 backdrop-blur-md border-border hover:bg-background/60 font-sans font-bold min-h-[52px] text-base rounded-xl active:scale-[0.98] transition-transform"
              >
                Client Portal
              </Button>
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
