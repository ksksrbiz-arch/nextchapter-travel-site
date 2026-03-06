import { useEffect, useState } from "react";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { ArrowLeft, BookOpen, Star, Shield, Clock, CheckCircle } from "lucide-react";

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

      {/* ── Sticky top nav bar ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-primary/95 backdrop-blur-md shadow-lg"
        style={{ paddingTop: "env(safe-area-inset-top)" }}>
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
        style={{ background: "linear-gradient(to bottom, oklch(0.18 0.05 240 / 0.85), oklch(0.18 0.05 240 / 0.65))" }}
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
            Fill out the form below and Jessica will personally review your request and reach out
            within 24 hours with a customized travel plan — completely free.
          </p>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {TRUST_BADGES.map((badge) => (
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
      <section className="relative px-0 sm:px-4 pb-16 sm:pb-24"
        style={{ background: "oklch(0.18 0.05 240 / 0.60)" }}
      >
        <div className="max-w-4xl mx-auto">
          {/* Loading skeleton */}
          {!iframeLoaded && (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
              <div className="w-10 h-10 rounded-full border-2 border-secondary border-t-transparent animate-spin" />
              <p className="text-white/50 font-sans text-sm">Loading your trip planner…</p>
            </div>
          )}

          <iframe
            src="https://traveljoy.com/webforms/omtyxcxwds2mzw21lnthlkrk/forms/dbaww6cshuxeiaac8kanrn9w/link"
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

      {/* ── Footer note ── */}
      <footer className="bg-primary text-primary-foreground py-6 text-center"
        style={{ paddingBottom: "max(1.5rem, env(safe-area-inset-bottom))" }}>
        <p className="text-primary-foreground/40 text-xs font-sans">
          © 2026 Next Chapter Travel LLC — Jessica Seiders. All rights reserved.
        </p>
        <p className="text-primary-foreground/30 text-xs font-sans mt-1">
          Your information is kept private and never shared with third parties.
        </p>
      </footer>
    </div>
  );
}
