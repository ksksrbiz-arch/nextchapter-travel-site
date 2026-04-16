import { useEffect, useState } from "react";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import {
  ArrowLeft,
  BookOpen,
  Star,
  Shield,
  Clock,
  CheckCircle,
} from "lucide-react";

const TRUST_BADGES = [
  { icon: Star, label: "Disney Certified Specialist" },
  { icon: CheckCircle, label: "Norwegian Cruise Line Expert" },
  { icon: Shield, label: "Royal Caribbean & Carnival" },
  { icon: Clock, label: "CFO — Next Chapter Travel LLC" },
];

export default function PlanMyTrip() {
  const { setVideoContext } = useVideoHero();
  const [iframeLoaded, setIframeLoaded] = useState(false);

  useEffect(() => {
    setVideoContext("landing");
  }, [setVideoContext]);

  return (
    <div className="min-h-screen bg-transparent text-foreground">
      <SEOHead
        title="Plan My Trip — Start Your Dream Vacation"
        description="Tell Jessica about your dream vacation. Disney, cruises, all-inclusive resorts, and more — get a free personalized travel plan within 24 hours."
        canonical="/plan-my-trip"
      />
      {/* ── Sticky top nav bar ── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-lg"
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <ArrowLeft className="w-4 h-4 text-white/60 group-hover:text-secondary transition-colors" />
              <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-3.5 h-3.5 text-secondary-foreground" />
              </div>
              <span className="text-white font-serif text-base sm:text-lg font-semibold tracking-wide leading-tight">
                Next Chapter Travel
              </span>
            </div>
          </Link>
          <Badge className="bg-secondary/20 text-secondary border-secondary/30 font-sans text-xs tracking-widest uppercase hidden sm:flex">
            Plan Your Trip
          </Badge>
        </div>
      </nav>

      {/* ── Hero header ── */}
      <section
        className="relative pt-24 sm:pt-28 pb-8 sm:pb-12 px-4 text-center"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.18 0.05 240 / 0.85), oklch(0.18 0.05 240 / 0.65))",
        }}
      >
        <div className="max-w-3xl mx-auto">
          <Badge className="mb-3 sm:mb-4 bg-secondary/90 text-secondary-foreground border-0 font-sans text-[10px] sm:text-xs tracking-widest uppercase px-3 sm:px-4 py-1 sm:py-1.5">
            Let's Start Planning
          </Badge>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-3 sm:mb-4 leading-tight">
            Tell Me About Your
            <span className="italic text-secondary"> Dream Trip</span>
          </h1>
          <p className="text-white/70 text-base sm:text-lg font-sans font-light leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8">
            Fill out the form below and Jessica will personally review your
            request and reach out within 24 hours with a customized travel plan
            — completely free.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {TRUST_BADGES.map(badge => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 bg-white/10 border border-white/20 rounded-full px-3 py-1.5 text-white/80 text-xs font-sans"
              >
                <badge.icon className="w-3 h-3 text-secondary flex-shrink-0" />
                {badge.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Embedded TravelJoy Form ── */}
      <section
        className="relative px-0 sm:px-4 pb-16 sm:pb-24"
        style={{ background: "oklch(0.18 0.05 240 / 0.60)" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Loading skeleton */}
          {!iframeLoaded && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <p className="text-white/50 font-sans text-sm">
                Loading your trip planner…
              </p>
            </div>
          )}

          <iframe
            src="https://traveljoy.com/webforms/omtyxcxwds2mzw21lnthlkrk/forms/dbaww6cshuxeiaac8kanrn9w"
            title="Plan My Trip — Next Chapter Travel"
            onLoad={() => setIframeLoaded(true)}
            className={`w-full transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0 h-0"}`}
            style={{
              height: iframeLoaded ? "calc(100vh - 120px)" : "0",
              minHeight: iframeLoaded ? "700px" : "0",
              border: "none",
              borderRadius: "0 0 1rem 1rem",
              background: "transparent",
            }}
            allow="camera; microphone"
            loading="lazy"
          />
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section
        className="relative px-4 pb-16 sm:pb-24"
        style={{ background: "oklch(0.14 0.04 240 / 0.88)" }}
      >
        <div className="max-w-3xl mx-auto pt-12 sm:pt-16">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-white/60 font-sans text-sm sm:text-base">
              Everything you need to know before we start planning.
            </p>
          </div>
          <div className="space-y-3">
            {[
              {
                q: "Is there a fee to work with Jessica?",
                a: "No — Jessica's planning services are completely free to you. She is compensated by travel suppliers, which means you get expert, personalized service at no extra cost.",
              },
              {
                q: "How long does it take to get a travel proposal?",
                a: "Jessica typically responds within 24 hours of receiving your inquiry. Complex itineraries (multi-destination, group travel) may take 2–3 business days for a full proposal.",
              },
              {
                q: "What types of trips does Jessica specialize in?",
                a: "Jessica is certified in Disney vacations, Universal Studios, Royal Caribbean, Carnival, Norwegian Cruise Line, and all-inclusive resorts. She also books Europe, Hawaii, and custom adventure trips.",
              },
              {
                q: "What is the client portal?",
                a: "Once your trip is booked, you receive access to your personal portal with your day-by-day itinerary, all booking confirmations, a secure document vault, packing lists, destination guides, and a direct line to Jessica.",
              },
              {
                q: "Can Jessica help with travel insurance?",
                a: "Yes! Jessica highly recommends travel protection and can walk you through options that make sense for your trip, budget, and travel style.",
              },
            ].map((item, i) => (
              <details
                key={i}
                className="group bg-white/5 border border-white/10 rounded-xl overflow-hidden"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-white font-sans font-medium text-sm sm:text-base select-none hover:bg-white/5 transition-colors">
                  {item.q}
                  <span className="text-secondary flex-shrink-0 text-lg leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 text-white/70 font-sans text-sm leading-relaxed border-t border-white/10 pt-4">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer note ── */}
      <footer
        className="bg-primary text-primary-foreground py-8 text-center border-t border-white/10"
        style={{ paddingBottom: "max(2rem, env(safe-area-inset-bottom))" }}
      >
        <p className="text-secondary font-serif font-bold text-base mb-1">
          Next Chapter Travel LLC
        </p>
        <p className="text-primary-foreground/40 text-xs font-sans mb-1">
          © 2026 Next Chapter Travel LLC — Jessica Seiders. All rights reserved.
        </p>
        <p className="text-primary-foreground/30 text-xs font-sans">
          Your information is kept private and never shared with third parties.
        </p>
      </footer>
    </div>
  );
}
