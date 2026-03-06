import { useAuth } from "@/_core/hooks/useAuth";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import {
  MapPin, MessageSquare, FileText, CheckSquare, Calendar,
  Plane, Shield, Star, ArrowRight, BookOpen, Globe, Users,
  Facebook, Sparkles, Menu, X, Compass
} from "lucide-react";
import { PartnershipDropdown } from "@/components/PartnershipDropdown";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Calendar,
    title: "Day-by-Day Itinerary",
    desc: "Every moment of your trip organized beautifully, from sunrise excursions to evening dining reservations.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Document Vault",
    desc: "Passports, boarding passes, hotel confirmations — all your travel documents secured in one place.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Globe,
    title: "Destination Guides",
    desc: "Curated local tips, currency info, emergency contacts, and insider knowledge for every destination.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    desc: "Reach Jessica instantly with questions, changes, or just to share your excitement before departure.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CheckSquare,
    title: "Smart Packing Lists",
    desc: "Never forget a thing. Customized packing checklists organized by category for every trip.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Plane,
    title: "Booking Tracker",
    desc: "Real-time status on flights, hotels, tours, and transfers — all your confirmations at a glance.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    destination: "Maui, Hawaii",
    quote: "Jessica thought of everything. The app had our boarding passes, hotel info, and even a restaurant list. It was like having a personal concierge in my pocket.",
    rating: 5,
  },
  {
    name: "Linda & Tom R.",
    destination: "Tuscany, Italy",
    quote: "We've traveled with many agents, but this level of organization is unmatched. Every day was laid out perfectly and we never had to worry about a thing.",
    rating: 5,
  },
  {
    name: "The Johnson Family",
    destination: "Walt Disney World",
    quote: "As a Disney specialist, Jessica knew every trick. The packing list alone saved us from forgetting half our gear. Absolute magic.",
    rating: 5,
  },
];

const DESTINATIONS = [
  { label: "Disney World", emoji: "🏰", top: "28%", left: "22%", delay: "0s" },
  { label: "Norwegian Fjords", emoji: "🚢", top: "15%", left: "52%", delay: "0.4s" },
  { label: "Caribbean", emoji: "🌴", top: "55%", left: "28%", delay: "0.8s" },
  { label: "Hawaii", emoji: "🌺", top: "45%", left: "8%", delay: "1.2s" },
  { label: "Universal Orlando", emoji: "🎢", top: "65%", left: "22%", delay: "0.2s" },
  { label: "Royal Caribbean", emoji: "⚓", top: "35%", left: "72%", delay: "0.6s" },
  { label: "Tuscany", emoji: "🍷", top: "20%", left: "68%", delay: "1.0s" },
  { label: "Alaska Cruise", emoji: "🏔️", top: "10%", left: "15%", delay: "1.4s" },
];

function InteractiveGlobe() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 12);
    setRotateY(x * 12);
  };

  // Touch tilt for mobile
  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!containerRef.current || !e.touches[0]) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.touches[0].clientX - rect.left) / rect.width - 0.5;
    const y = (e.touches[0].clientY - rect.top) / rect.height - 0.5;
    setRotateX(-y * 8);
    setRotateY(x * 8);
  };

  const handleMouseLeave = () => { setRotateX(0); setRotateY(0); };
  const handleTouchEnd = () => { setRotateX(0); setRotateY(0); };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[340px] sm:max-w-[420px] md:max-w-[480px] mx-auto select-none touch-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ perspective: "800px" }}
    >
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}
      >
        <div className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.09 65 / 0.15) 0%, transparent 70%)" }} />
        <div className="absolute inset-[10%] rounded-full overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, oklch(0.22 0.06 240) 0%, oklch(0.32 0.08 220) 40%, oklch(0.28 0.07 250) 100%)",
            boxShadow: "inset -20px -20px 60px oklch(0.14 0.04 240 / 0.8), inset 10px 10px 40px oklch(0.72 0.09 65 / 0.1), 0 20px 80px oklch(0.14 0.04 240 / 0.5)"
          }}>
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
            {[30, 50, 70, 90, 110, 130, 150, 170].map(y => (
              <ellipse key={y} cx="100" cy={y} rx="95" ry="8" fill="none" stroke="oklch(0.72 0.09 65)" strokeWidth="0.5" />
            ))}
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map(angle => (
              <ellipse key={angle} cx="100" cy="100" rx="8" ry="95" fill="none" stroke="oklch(0.72 0.09 65)" strokeWidth="0.5"
                transform={`rotate(${angle} 100 100)`} />
            ))}
          </svg>
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
            <ellipse cx="60" cy="80" rx="22" ry="18" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="110" cy="70" rx="30" ry="20" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="130" cy="110" rx="18" ry="14" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="55" cy="120" rx="14" ry="20" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="155" cy="80" rx="10" ry="8" fill="oklch(0.55 0.12 155)" />
          </svg>
          <div className="absolute top-[8%] left-[15%] w-[35%] h-[35%] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        </div>
        <div className="absolute inset-[5%] rounded-full border border-secondary/20"
          style={{ animation: "spin 20s linear infinite", transformStyle: "preserve-3d", transform: "rotateX(70deg)" }} />
        {DESTINATIONS.map((dest) => (
          <div
            key={dest.label}
            className="absolute z-10 cursor-pointer"
            style={{ top: dest.top, left: dest.left, animationDelay: dest.delay }}
            onMouseEnter={() => setHovered(dest.label)}
            onMouseLeave={() => setHovered(null)}
            onTouchStart={() => setHovered(dest.label)}
            onTouchEnd={() => setHovered(null)}
          >
            <div className="relative">
              <div className="absolute -inset-2 rounded-full bg-secondary/30 animate-ping" style={{ animationDuration: "2s", animationDelay: dest.delay }} />
              <div className="relative w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-secondary/90 border-2 border-white/80 flex items-center justify-center shadow-lg text-xs sm:text-sm hover:scale-125 active:scale-125 transition-transform duration-200">
                {dest.emoji}
              </div>
              {hovered === dest.label && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-sans px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-secondary/30 z-20">
                  {dest.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
                </div>
              )}
            </div>
          </div>
        ))}
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center">
          <div className="text-secondary font-serif text-xs font-semibold tracking-widest uppercase opacity-80">Worldwide</div>
        </div>
      </div>
      {/* Floating stat cards — repositioned for mobile */}
      <div className="absolute -bottom-3 -left-2 sm:-bottom-4 sm:-left-4 bg-secondary text-secondary-foreground rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-2xl z-20 animate-float">
        <div className="flex items-center gap-1.5 sm:gap-2">
          <Users className="w-4 h-4 sm:w-5 sm:h-5" />
          <div>
            <div className="text-base sm:text-lg font-serif font-bold leading-none">500+</div>
            <div className="text-[10px] sm:text-xs font-sans opacity-80">Happy Travelers</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-3 -right-2 sm:-top-4 sm:-right-4 bg-card text-card-foreground rounded-xl px-3 py-2 sm:px-4 sm:py-3 shadow-2xl z-20 border border-border animate-float" style={{ animationDelay: "1s" }}>
        <div className="flex gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-secondary text-secondary" />)}
        </div>
        <div className="text-[10px] sm:text-xs font-sans text-muted-foreground">5-Star Rated</div>
      </div>
      <div className="absolute top-1/2 -right-4 sm:-right-6 -translate-y-1/2 bg-primary/90 text-primary-foreground rounded-xl px-2.5 py-2 sm:px-3 shadow-2xl z-20 border border-secondary/20 animate-float" style={{ animationDelay: "0.5s" }}>
        <div className="flex items-center gap-1 sm:gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-secondary" />
          <div className="text-[10px] sm:text-xs font-sans">8 Destinations</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { setVideoContext } = useVideoHero();

  // Set landing page video context on mount
  useEffect(() => {
    setVideoContext("landing");
  }, [setVideoContext]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const portalHref = isAuthenticated ? (user?.role === "admin" ? "/admin" : "/portal") : getLoginUrl();

  return (
    <div className="min-h-screen bg-transparent text-foreground">

      {/* ── Navigation ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-primary/95 backdrop-blur-md shadow-lg"
          : "bg-gradient-to-b from-black/60 to-transparent"
      )}
        style={{ paddingTop: "env(safe-area-inset-top)" }}
      >
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <BookOpen className="w-3.5 h-3.5 text-secondary-foreground" />
            </div>
            <span className="text-white font-serif text-base sm:text-lg font-semibold tracking-wide leading-tight">
              Next Chapter Travel
            </span>
          </div>

          {/* Desktop nav actions */}
          <div className="hidden sm:flex items-center gap-3">
            <PartnershipDropdown />
            <a
              href="https://www.facebook.com/share/1BvCajFoBy/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/70 hover:text-secondary transition-colors p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <Facebook className="w-4 h-4" />
            </a>
            {isAuthenticated ? (
              <Link href={user?.role === "admin" ? "/admin" : "/portal"}>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans min-h-[44px]">
                  My Portal
                </Button>
              </Link>
            ) : (
              <>
                <a href={getLoginUrl()}>
                  <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 font-sans min-h-[44px]">
                    Sign In
                  </Button>
                </a>
                <a href={getLoginUrl()}>
                  <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans min-h-[44px]">
                    Get Started
                  </Button>
                </a>
              </>
            )}
          </div>

          {/* Mobile: single CTA + hamburger */}
          <div className="flex sm:hidden items-center gap-2">
            <a href={portalHref}>
              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans text-xs px-3 min-h-[40px]">
                {isAuthenticated ? "My Portal" : "Get Started"}
              </Button>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown menu */}
        {mobileMenuOpen && (
          <div className="sm:hidden bg-primary/98 backdrop-blur-md border-t border-white/10 px-4 py-4 space-y-1">
            {[
              { href: "#about", label: "About Jessica" },
              { href: "#features", label: "Features" },
              { href: "#how", label: "How It Works" },
            ].map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center px-4 py-3 rounded-xl text-white/80 hover:text-white hover:bg-white/10 font-sans text-sm min-h-[48px] transition-colors"
              >
                {item.label}
              </a>
            ))}
            {/* Divider */}
            <div className="h-px bg-white/10 my-2" />
            {/* Partner links */}
            <a
              href="https://www.thenextchaptertravel.com/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-white/80 hover:text-secondary font-sans text-sm min-h-[48px] transition-colors"
            >
              <Globe className="w-4 h-4" />
              Wendy's Site (CEO)
            </a>
            <a
              href="/portal"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-white/80 hover:text-secondary font-sans text-sm min-h-[48px] transition-colors"
            >
              <Compass className="w-4 h-4" />
              Jessica's Portal (CFO)
            </a>
            {/* Divider */}
            <div className="h-px bg-white/10 my-2" />
            <a
              href="https://www.facebook.com/share/1BvCajFoBy/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-3 rounded-xl text-white/80 hover:text-secondary font-sans text-sm min-h-[48px] transition-colors"
            >
              <Facebook className="w-4 h-4" />
              Follow Jessica on Facebook
            </a>
          </div>
        )}
      </nav>

      {/* ── Hero — Video Editorial ── */}
      {/* GlobalVideoBackground (fixed -z-10) renders the cinematic video behind everything */}
      <section className="relative flex items-center justify-center overflow-hidden min-h-screen"
        style={{ height: "100dvh" }}>

        <div className="relative z-10 text-center text-white px-5 max-w-4xl mx-auto w-full">
          <Badge className="mb-4 sm:mb-6 bg-secondary/90 text-secondary-foreground border-0 font-sans text-[10px] sm:text-xs tracking-widest uppercase px-3 sm:px-4 py-1 sm:py-1.5">
            Next Chapter Travel LLC
          </Badge>
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-4 sm:mb-6 leading-[1.1] opacity-0 animate-fade-in-up">
            Your Journey,
            <br />
            <span className="italic text-secondary">Perfectly Planned</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 sm:mb-10 max-w-2xl mx-auto font-sans font-light leading-relaxed opacity-0 animate-fade-in-up animate-delay-200">
            CFO & Certified Travel Specialist at Next Chapter Travel LLC — Jessica Seiders brings
            expert planning to Disney, cruises, family adventures, and beyond.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center opacity-0 animate-fade-in-up animate-delay-300">
            <Link href="/plan-my-trip" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans px-6 sm:px-8 py-5 sm:py-6 text-base min-h-[56px]">
                Plan My Trip
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <a href={getLoginUrl()} className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto border-white/60 text-white hover:bg-white/10 font-sans px-6 sm:px-8 py-5 sm:py-6 text-base bg-transparent min-h-[56px]">
                Client Portal
              </Button>
            </a>
          </div>
        </div>

        <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <div className="w-px h-10 sm:h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Sticky mobile CTA (appears after scrolling past hero) ── */}
      <div className={cn(
        "sm:hidden fixed bottom-0 left-0 right-0 z-30 transition-all duration-300",
        scrolled ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="bg-primary/95 backdrop-blur-md border-t border-white/10 px-4 py-3">
          <Link href="/plan-my-trip" className="block">
            <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans min-h-[52px] text-base">
              Plan My Trip
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* ── About Jessica — with Interactive Globe ── */}
      <section id="about" className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div>
              <Badge className="mb-3 sm:mb-4 bg-secondary/20 text-secondary border-secondary/30 font-sans text-xs tracking-widest uppercase">
                Your Travel Advisor
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-tight">
                Meet Jessica Seiders
              </h2>
              {/* Partnership callout */}
              <div className="mb-4 sm:mb-5 flex items-start gap-3 bg-secondary/10 border border-secondary/20 rounded-xl px-4 py-3">
                <div className="flex-shrink-0 mt-0.5">
                  <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center">
                    <BookOpen className="w-3 h-3 text-secondary" />
                  </div>
                </div>
                <p className="text-primary-foreground/70 text-sm font-sans leading-relaxed">
                  Partner of{" "}
                  <a
                    href="https://www.thenextchaptertravel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-secondary font-medium hover:underline"
                  >
                    The Next Chapter Travel
                  </a>
                  {" "}— founded by CEO{" "}
                  <span className="text-primary-foreground/90 font-medium">Wendy</span>,
                  curating luxury all-women group travel worldwide.
                </p>
              </div>
              <p className="text-primary-foreground/80 text-base sm:text-lg leading-relaxed mb-4 sm:mb-6 font-sans">
                Jessica Seiders is the <span className="text-secondary font-medium">CFO &amp; Certified Travel Specialist</span> at{" "}
                <span className="text-secondary font-medium">Next Chapter Travel LLC</span> — a Portland,
                Oregon-based travel agency dedicated to planning every kind of vacation with precision and
                heart. A certified Disney specialist with deep expertise across Universal, Norwegian Cruise
                Line, Royal Caribbean, Carnival Cruises, Expedia, and Viator.
              </p>
              <p className="text-primary-foreground/80 text-base sm:text-lg leading-relaxed mb-6 sm:mb-8 font-sans">
                With a background spanning healthcare (former ER Tech at Providence Health Systems) and
                entrepreneurship, Jessica brings calm-under-pressure and meticulous planning to every trip.
              </p>
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {["Disney Specialist", "Universal Studios", "Norwegian Cruise Line", "Royal Caribbean", "Carnival Cruises", "Family Travel"].map((tag) => (
                  <Badge key={tag} className="bg-secondary/20 text-secondary border-secondary/30 font-sans text-xs sm:text-sm">
                    {tag}
                  </Badge>
                ))}
              </div>
              <a
                href="https://www.facebook.com/share/1BvCajFoBy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-secondary/10 hover:bg-secondary/20 active:bg-secondary/30 border border-secondary/30 text-secondary rounded-xl px-4 sm:px-5 py-3 font-sans text-sm font-medium transition-all duration-200 min-h-[48px]"
              >
                <Facebook className="w-4 h-4" />
                Connect with Jessica on Facebook
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* Interactive Globe — shown below text on mobile */}
            <div className="flex items-center justify-center py-6 sm:py-8 order-first md:order-last">
              <InteractiveGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-16 sm:py-24 bg-black/50 backdrop-blur-md">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Everything You Need
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Your Complete Trip Companion
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              From planning to landing back home, every feature you need is built right in.
            </p>
          </div>
          {/* 1-col mobile → 2-col tablet → 3-col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-5 sm:p-8 rounded-2xl border border-border bg-card hover:border-secondary/40 hover:shadow-lg active:scale-[0.98] transition-all duration-300 flex gap-4 sm:block"
              >
                <div className={cn("w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0 sm:mb-5", feature.color)}>
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-xl font-serif font-semibold text-foreground mb-1 sm:mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground font-sans text-sm sm:text-base leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how" className="py-16 sm:py-24 bg-primary/20">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg font-sans">
              Three simple steps to your perfect vacation
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 relative">
            <div className="hidden sm:block absolute top-16 left-1/3 right-1/3 h-px bg-secondary/30" />
            {[
              { step: "01", title: "Book With Jessica", desc: "Connect with Jessica to plan your dream trip. She handles all the details, bookings, and logistics.", icon: MessageSquare },
              { step: "02", title: "Get Your Portal", desc: "Receive access to your personalized travel portal with your complete itinerary and documents.", icon: Shield },
              { step: "03", title: "Travel With Confidence", desc: "Everything you need is in your pocket. Enjoy your trip knowing Jessica is just a message away.", icon: MapPin },
            ].map((step, i) => (
              <div key={step.step} className="flex sm:block items-start sm:items-center sm:text-center gap-5 sm:gap-0 relative">
                {/* Mobile: vertical connector line */}
                {i < 2 && (
                  <div className="sm:hidden absolute left-8 top-16 w-px h-[calc(100%+1.5rem)] bg-secondary/20" />
                )}
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0 sm:mx-auto sm:mb-6 relative z-10">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-secondary font-serif text-3xl sm:text-5xl font-bold mb-1 sm:mb-3 opacity-20">{step.step}</div>
                  <h3 className="text-lg sm:text-xl font-serif font-semibold text-foreground mb-2 sm:mb-3">{step.title}</h3>
                  <p className="text-muted-foreground font-sans text-sm sm:text-base leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4">What Travelers Say</h2>
          </div>
          {/* Horizontal scroll on mobile */}
          <div className="flex sm:grid sm:grid-cols-3 gap-4 sm:gap-8 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 -mx-4 sm:mx-0 px-4 sm:px-0 snap-x snap-mandatory">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-5 sm:p-8 flex-shrink-0 w-[85vw] sm:w-auto snap-center">
                <div className="flex gap-1 mb-3 sm:mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-secondary text-secondary" />)}
                </div>
                <p className="text-primary-foreground/80 font-sans text-sm sm:text-base leading-relaxed mb-4 sm:mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-serif font-semibold text-sm sm:text-base">{t.name}</div>
                  <div className="text-secondary text-xs sm:text-sm font-sans flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {t.destination}
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Scroll indicator dots for mobile */}
          <div className="flex sm:hidden justify-center gap-1.5 mt-4">
            {TESTIMONIALS.map((_, i) => (
              <div key={i} className={cn("w-1.5 h-1.5 rounded-full", i === 0 ? "bg-secondary" : "bg-primary-foreground/20")} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-16 sm:py-24 bg-black/50 backdrop-blur-md">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-4 sm:mb-6">
              Ready to Start Your
              <span className="text-secondary italic"> Next Chapter?</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg mb-8 sm:mb-10 font-sans leading-relaxed">
              Certified in Disney, Universal, Norwegian Cruise Line, Royal Caribbean, Carnival, and more —
              Jessica Seiders (CFO) at Next Chapter Travel LLC has the expertise to plan any adventure you can imagine.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
              <Link href="/plan-my-trip" className="block sm:inline-block">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans px-8 sm:px-10 py-5 sm:py-6 text-base min-h-[56px]">
                  Plan My Trip
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
              <a href={getLoginUrl()} className="block sm:inline-block">
                <Button size="lg" variant="outline" className="w-full sm:w-auto border-primary/30 text-primary hover:bg-primary/5 font-sans px-8 sm:px-10 py-5 sm:py-6 text-base min-h-[56px] bg-transparent">
                  Client Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="bg-primary text-primary-foreground py-10 sm:py-12"
        style={{ paddingBottom: "max(2.5rem, env(safe-area-inset-bottom))" }}>
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-secondary-foreground" />
                </div>
                <span className="font-serif text-lg font-semibold">Next Chapter Travel</span>
              </div>
              <p className="text-primary-foreground/60 text-sm font-sans leading-relaxed mb-4">
                Jessica Seiders — CFO & Certified Travel Specialist, bringing expert planning and personal warmth
                to every trip. Partner of{" "}
                <a href="https://www.thenextchaptertravel.com/" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">The Next Chapter Travel</a>
                , founded by CEO Wendy.
              </p>
              <a
                href="https://www.facebook.com/share/1BvCajFoBy/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-secondary transition-colors text-sm font-sans min-h-[44px]"
              >
                <Facebook className="w-4 h-4" />
                Follow on Facebook
              </a>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm font-sans text-primary-foreground/60">
                <li><a href="#features" className="hover:text-secondary transition-colors py-1 block">Features</a></li>
                <li><a href="#about" className="hover:text-secondary transition-colors py-1 block">About Jessica</a></li>
                <li><a href={getLoginUrl()} className="hover:text-secondary transition-colors py-1 block">Client Portal</a></li>
                <li>
                  <Link href="/plan-my-trip" className="hover:text-secondary transition-colors py-1 block">Plan My Trip</Link>
                </li>
                <li>
                  <a
                    href="https://form.typeform.com/to/BrcCMxGh"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors py-1 block"
                  >Join Our Team</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Contact Jessica</h4>
              <ul className="space-y-2 text-sm font-sans text-primary-foreground/60">
                <li>Portland, Oregon</li>
                <li>CFO &amp; Certified Travel Specialist — Next Chapter Travel LLC</li>
                <li>
                  <a
                    href="https://www.thenextchaptertravel.com/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-secondary transition-colors"
                  >
                    thenextchaptertravel.com (CEO: Wendy)
                  </a>
                </li>
                <li>Disney · Universal · Royal Caribbean · Carnival</li>
                <li className="pt-1">
                  <a
                    href="https://www.facebook.com/share/1BvCajFoBy/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-secondary transition-colors min-h-[44px]"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    Next Chapter Travel on Facebook
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-6 sm:pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/40 text-xs sm:text-sm font-sans text-center sm:text-left">
              © 2026 Next Chapter Travel LLC — Jessica Seiders, CFO. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-primary-foreground/40 text-sm font-sans">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure & Private</span>
              </div>
              <a
                href="https://www.facebook.com/share/1BvCajFoBy/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors p-1 min-h-[44px] min-w-[44px] flex items-center justify-center"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
