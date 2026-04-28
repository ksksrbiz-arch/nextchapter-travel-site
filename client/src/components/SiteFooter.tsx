import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { BookOpen, Facebook, Instagram, Compass } from "lucide-react";

const QUICK_LINKS = [
  { label: "Destinations", href: "/destinations", internal: true },
  { label: "Services", href: "/services", internal: true },
  { label: "About Jessica", href: "/about", internal: true },
  { label: "Plan My Trip", href: "/plan-my-trip", internal: true },
  { label: "Client Portal", href: null, internal: false },
];

const SPECIALTIES = [
  "Disney World & Disneyland",
  "Caribbean Cruises",
  "Universal Studios",
  "All-Inclusive Resorts",
  "Hawaiian Getaways",
  "European River Cruises",
];

export default function SiteFooter() {
  return (
    <footer
      className="relative bg-primary text-primary-foreground"
      style={{ paddingBottom: "max(3rem, calc(2rem + env(safe-area-inset-bottom, 0px)))" }}
    >
      {/* Wave SVG divider at top — bridges from dark section to navy footer */}
      <div className="wave-divider overflow-hidden leading-[0]" aria-hidden={true}>
        <svg
          viewBox="0 0 1440 60"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-10 sm:h-16 block"
          style={{ display: "block", marginBottom: "-1px" }}
        >
          <path
            d="M0 0C360 60 720 60 1080 30C1260 15 1350 5 1440 0V60H0V0Z"
            fill="oklch(0.22 0.06 240)"
            fillOpacity="0.85"
          />
          <path
            d="M0 20C240 50 600 55 960 35C1200 20 1350 10 1440 20V60H0V20Z"
            fill="oklch(0.22 0.06 240)"
          />
        </svg>
      </div>

      <div className="py-10 sm:py-14">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-10 sm:mb-14">
          {/* Brand column */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-secondary" />
              <h3 className="font-serif font-bold text-lg text-secondary">
                Next Chapter Travel
              </h3>
            </div>
            <p className="text-primary-foreground/60 text-sm font-sans leading-relaxed mb-4">
              Your personal travel concierge, crafting unforgettable journeys
              with expert planning and genuine care.
            </p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/nextchaptertravel"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-secondary/20 border border-white/10 hover:border-secondary/40 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4 text-primary-foreground/70" />
              </a>
              <a
                href="https://www.instagram.com/nextchaptertravelllc"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-secondary/20 border border-white/10 hover:border-secondary/40 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4 text-primary-foreground/70" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest text-secondary/80">
              Quick Links
            </h4>
            <ul className="space-y-2 font-sans text-sm">
              {QUICK_LINKS.map(link =>
                link.href === null ? (
                  <li key={link.label}>
                    <a
                      href={getLoginUrl()}
                      className="text-primary-foreground/60 hover:text-secondary transition-colors py-0.5 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                ) : link.internal ? (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-primary-foreground/60 hover:text-secondary transition-colors py-0.5 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ) : (
                  <li key={link.label}>
                    <a
                      href={link.href ?? "#"}
                      className="text-primary-foreground/60 hover:text-secondary transition-colors py-0.5 inline-block"
                    >
                      {link.label}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Specialties */}
          <div>
            <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest text-secondary/80">
              Specialties
            </h4>
            <ul className="space-y-2 font-sans text-sm text-primary-foreground/60">
              {SPECIALTIES.map(dest => (
                <li key={dest} className="flex items-center gap-2">
                  <Compass className="w-3 h-3 text-secondary/50 flex-shrink-0" />
                  {dest}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest text-secondary/80">
              Contact
            </h4>
            <ul className="space-y-3 font-sans text-sm">
              <li>
                <p className="text-primary-foreground/40 text-xs uppercase tracking-wider mb-0.5">
                  Email
                </p>
                <a
                  href="mailto:seidersconsulting@gmail.com"
                  className="text-primary-foreground/70 hover:text-secondary transition-colors"
                >
                  seidersconsulting@gmail.com
                </a>
              </li>
              <li>
                <p className="text-primary-foreground/40 text-xs uppercase tracking-wider mb-0.5">
                  Company
                </p>
                <p className="text-primary-foreground/60">
                  Next Chapter Travel LLC
                </p>
              </li>
              <li className="pt-2">
                <Link href="/plan-my-trip">
                  <Button
                    size="sm"
                    className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold text-xs rounded-lg"
                  >
                    Start Planning — Free
                  </Button>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-primary-foreground/40 text-xs font-sans">
          <p>&copy; {new Date().getFullYear()} Next Chapter Travel LLC. All rights reserved.</p>
          <p>
            <a href="/sitemap.xml" className="hover:text-primary-foreground/60 transition-colors">
              Sitemap
            </a>
            <span className="mx-2">·</span>
            <a href="mailto:seidersconsulting@gmail.com" className="hover:text-primary-foreground/60 transition-colors">
              Privacy
            </a>
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}
