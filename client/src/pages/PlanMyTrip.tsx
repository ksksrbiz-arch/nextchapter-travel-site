import { useEffect, useRef, useState } from "react";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { SEOHead } from "@/components/SEOHead";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Star,
  Shield,
  Clock,
  CheckCircle,
  Mail,
  ExternalLink,
  AlertCircle,
  Sparkles,
  MessageSquare,
  Send,
} from "lucide-react";
import { useScrollReveal } from "@/hooks/useScrollReveal";

// If the embedded TravelJoy form hasn't loaded by this point, assume it's
// being blocked (ad-blocker, network, CSP) and surface a fallback path so
// the user is never stranded on an infinite spinner.
const IFRAME_LOAD_TIMEOUT_MS = 12_000;
const TRAVELJOY_FORM_URL =
  "https://traveljoy.com/webforms/omtyxcxwds2mzw21lnthlkrk/forms/dbaww6cshuxeiaac8kanrn9w";

const TRUST_BADGES = [
  { icon: Star, label: "Disney Certified Specialist" },
  { icon: CheckCircle, label: "Norwegian Cruise Line Expert" },
  { icon: Shield, label: "Royal Caribbean & Carnival" },
  { icon: Clock, label: "CFO — Next Chapter Travel LLC" },
];

export default function PlanMyTrip() {
  const { setVideoContext } = useVideoHero();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeFailed, setIframeFailed] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useScrollReveal();

  useEffect(() => {
    setVideoContext("plan-my-trip");
  }, [setVideoContext]);

  // Start a load watchdog; if onLoad doesn't fire in time, surface the
  // fallback contact paths.
  useEffect(() => {
    if (iframeLoaded) return;
    timeoutRef.current = setTimeout(() => {
      setIframeFailed(true);
    }, IFRAME_LOAD_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [iframeLoaded]);

  const handleIframeLoad = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIframeFailed(false);
    setIframeLoaded(true);
  };

  const handleIframeError = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIframeFailed(true);
  };

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
        className="relative pt-24 sm:pt-28 pb-10 sm:pb-14 px-4 text-center overflow-hidden"
        style={{
          background:
            "linear-gradient(to bottom, oklch(0.18 0.05 240 / 0.88), oklch(0.18 0.05 240 / 0.65))",
        }}
      >
        {/* Aurora backdrop */}
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="aurora-blob gold" style={{ width: "32rem", height: "32rem", top: "-10rem", left: "-6rem", opacity: 0.4 }} />
          <span className="aurora-blob navy" style={{ width: "30rem", height: "30rem", top: "-6rem", right: "-6rem", opacity: 0.5 }} />
        </div>
        <div className="max-w-3xl mx-auto relative">
          <Badge
            data-reveal
            className="mb-3 sm:mb-4 bg-secondary/90 text-secondary-foreground border-0 font-sans text-[10px] sm:text-xs tracking-[0.2em] uppercase px-3 sm:px-4 py-1.5 inline-flex items-center gap-1.5 shadow-lg"
          >
            <Sparkles className="w-3 h-3" />
            Free · 24-Hour Personal Proposal
          </Badge>
          <h1
            data-reveal
            data-reveal-delay="100"
            className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white mb-3 sm:mb-5 leading-[1.05] tracking-tight"
          >
            Tell Me About Your{" "}
            <span className="text-gradient-gold italic">Dream Trip</span>
          </h1>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-white/75 text-base sm:text-lg md:text-xl font-sans font-light leading-relaxed max-w-2xl mx-auto mb-6 sm:mb-8"
          >
            Share a few details and Jessica will personally craft a custom
            travel plan with itinerary, pricing, and recommendations —{" "}
            <span className="underline-gold text-white font-medium">
              completely free
            </span>
            , delivered within 24 hours.
          </p>

          {/* Trust badges */}
          <div
            data-reveal
            data-reveal-delay="300"
            className="flex flex-wrap justify-center gap-2 sm:gap-3"
          >
            {TRUST_BADGES.map(badge => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 bg-white/10 border border-white/20 backdrop-blur-md rounded-full px-3 py-1.5 text-white/90 text-xs font-sans"
              >
                <badge.icon className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                {badge.label}
              </div>
            ))}
          </div>

          {/* What happens next — visual 3-step promise */}
          <div
            data-reveal
            data-reveal-delay="400"
            className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-left max-w-3xl mx-auto"
          >
            {[
              {
                step: "01",
                icon: Send,
                title: "You share your trip",
                desc: "Tell us travelers, dates, destination ideas, and budget — takes about 3 minutes.",
              },
              {
                step: "02",
                icon: MessageSquare,
                title: "Jessica crafts a plan",
                desc: "Within 24 hours she sends a custom proposal with options, pricing, and ideas.",
              },
              {
                step: "03",
                icon: CheckCircle,
                title: "You travel, she handles it",
                desc: "Approve, get your portal, and let Jessica handle every booking and detail.",
              },
            ].map(item => (
              <div
                key={item.step}
                className="gradient-border-gold relative bg-white/5 backdrop-blur-md rounded-2xl p-4 sm:p-5 lift-on-hover"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-secondary to-secondary/70 text-secondary-foreground flex items-center justify-center font-serif font-bold text-sm shadow-lg shadow-secondary/40">
                    {item.step}
                  </div>
                  <item.icon className="w-4 h-4 text-secondary" />
                </div>
                <h3 className="text-white font-sans font-bold text-sm sm:text-base mb-1">
                  {item.title}
                </h3>
                <p className="text-white/70 text-xs sm:text-sm font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Down-arrow nudge to the form */}
          <p className="mt-8 sm:mt-10 text-secondary/90 font-sans text-xs sm:text-sm uppercase tracking-[0.18em] inline-flex items-center justify-center gap-2">
            Start below
            <ArrowRight className="w-3.5 h-3.5 rotate-90 animate-bounce" />
          </p>
        </div>
      </section>

      {/* ── Embedded TravelJoy Form ── */}
      <section
        className="relative px-0 sm:px-4 pb-16 sm:pb-24"
        style={{ background: "oklch(0.18 0.05 240 / 0.60)" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Loading skeleton — shown until either onLoad or the watchdog fires */}
          {!iframeLoaded && !iframeFailed && (
            <div
              className="flex flex-col items-center justify-center py-20 sm:py-24 gap-4 px-4 text-center"
              role="status"
              aria-live="polite"
            >
              <div className="w-10 h-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <p className="text-white/60 font-sans text-sm">
                Loading your trip planner…
              </p>
              <p className="text-white/40 font-sans text-xs max-w-sm">
                If this takes more than a few seconds, an ad-blocker or network
                policy may be blocking the form.
              </p>
            </div>
          )}

          {/* Fallback path — shown if the iframe fails or stalls past the watchdog */}
          {iframeFailed && !iframeLoaded && (
            <div className="px-4 py-12 sm:py-16">
              <div className="max-w-xl mx-auto bg-white/5 border border-white/15 rounded-2xl p-6 sm:p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-6 h-6 text-secondary" />
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-white mb-2">
                  Form having trouble loading?
                </h2>
                <p className="text-white/70 font-sans text-sm sm:text-base mb-6 leading-relaxed">
                  No problem — Jessica will still get your details. Pick the
                  option that's easiest for you and we'll be in touch within
                  24&nbsp;hours.
                </p>
                <div className="flex flex-col gap-3">
                  <Button
                    asChild
                    className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold min-h-[52px] rounded-xl active:scale-[0.99] transition-transform"
                  >
                    <a
                      href="mailto:seidersconsulting@gmail.com?subject=Plan%20My%20Trip&body=Hi%20Jessica%2C%0A%0AI%27d%20like%20to%20start%20planning%20a%20trip.%20Here%27s%20a%20bit%20about%20what%20we%27re%20looking%20for%3A%0A%0A%E2%80%A2%20Travelers%3A%0A%E2%80%A2%20Travel%20dates%3A%0A%E2%80%A2%20Destination(s)%3A%0A%E2%80%A2%20Approximate%20budget%3A%0A%E2%80%A2%20Anything%20else%3A%0A%0AThanks%21"
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Email Jessica directly
                    </a>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-white/30 text-white hover:bg-white/10 font-sans font-bold min-h-[52px] rounded-xl active:scale-[0.99] transition-transform"
                  >
                    <a href={TRAVELJOY_FORM_URL} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Open the form in a new tab
                    </a>
                  </Button>
                </div>
                <p className="text-white/40 font-sans text-xs mt-5">
                  Tip: try disabling your ad-blocker for this page and refreshing.
                </p>
              </div>
            </div>
          )}

          <iframe
            src={TRAVELJOY_FORM_URL}
            title="Plan My Trip — Next Chapter Travel"
            onLoad={handleIframeLoad}
            onError={handleIframeError}
            className={`w-full transition-opacity duration-500 ${iframeLoaded ? "opacity-100" : "opacity-0 h-0"}`}
            style={{
              // 100dvh handles iOS Safari address-bar collapse; 100vh is fallback
              height: iframeLoaded ? "calc(100dvh - 120px)" : "0",
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
                <summary className="flex items-center justify-between gap-4 px-4 sm:px-5 py-4 min-h-[56px] cursor-pointer list-none text-white font-sans font-medium text-[15px] sm:text-base leading-snug select-none hover:bg-white/5 active:bg-white/10 transition-colors">
                  <span className="flex-1">{item.q}</span>
                  <span className="text-secondary flex-shrink-0 text-2xl leading-none group-open:rotate-45 transition-transform duration-200">
                    +
                  </span>
                </summary>
                <div className="px-4 sm:px-5 pb-5 text-white/70 font-sans text-sm leading-relaxed border-t border-white/10 pt-4">
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
