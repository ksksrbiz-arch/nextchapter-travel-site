import { useVideoHero } from "@/contexts/VideoHeroContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import LazyImage from "@/components/LazyImage";
import { Link } from "wouter";
import { useEffect, useState } from "react";
import { SEOHead } from "@/components/SEOHead";
import {
  MapPin,
  MessageSquare,
  FileText,
  CheckSquare,
  Calendar,
  Plane,
  Shield,
  Star,
  BookOpen,
  Globe,
  Users,
  Facebook,
  Instagram,
  Sparkles,
  Menu,
  X,
  Compass,
  ChevronUp,
  Award,
  Heart,
  Ship,
  Castle,
  ArrowRight,
  Quote,
  Clock,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { jessicaTrips } from "@/data/jessica-trips";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const FEATURES = [
  {
    icon: Calendar,
    title: "Day-by-Day Itinerary",
    desc: "Every moment of your trip organized beautifully, from sunrise excursions to evening dining reservations.",
    example:
      "Day 2: Magic Kingdom — 9:00 Genie+ lightning lane, 1:00 lunch at Skipper Canteen, 7:30 fireworks.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: FileText,
    title: "Document Vault",
    desc: "Passports, boarding passes, hotel confirmations — all your travel documents secured in one place.",
    example:
      "Boarding passes, cruise set-sail pass, airport transfer voucher stored with offline access.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: Globe,
    title: "Destination Guides",
    desc: "Curated local tips, currency info, emergency contacts, and insider knowledge for every destination.",
    example:
      "Oahu: best reef-safe sunscreen spots, kid-friendly shave ice, 24/7 urgent care numbers.",
    color: "bg-teal-50 text-teal-600",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    desc: "Reach Jessica instantly with questions, changes, or just to share your excitement before departure.",
    example:
      "“Flight delayed” → Jessica rebooks transfers and pushes a new pickup time to your portal.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: CheckSquare,
    title: "Smart Packing Lists",
    desc: "Never forget a thing. Customized packing checklists organized by category for every trip.",
    example:
      "Cruise carry-on: passports, swimsuits, chargers, motion bands, reef-safe sunscreen, lanyards.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: Plane,
    title: "Booking Tracker",
    desc: "Real-time status on flights, hotels, tours, and transfers — all your confirmations at a glance.",
    example:
      "Flight UA1183 — gate C14, seats 18A/18B, hotel check-in 3pm, transfer driver WhatsApp link.",
    color: "bg-indigo-50 text-indigo-600",
  },
];

const DESTINATION_EXAMPLES = [
  "Orlando Theme Parks",
  "Western Caribbean Cruise",
  "Hawaiian Islands",
  "European River Cruise",
];

const TESTIMONIALS = [
  {
    quote:
      "I am late leaving this review, but life is busy. I would recommend Jessica 1000%. We took our first trip. She helped me with anything and everything I needed, no matter my budget, answered my questions, and was so super helpful during my trip! I ended up with severe sunburns and could barely walk. She was amazing. I don't think she knows how much she truly helped me and my whole fam out with the whole trip. I will forever be grateful. I would also most definitely use her in the future to travel five-star all around ❤️",
    name: "Jamie Hardesty",
    trip: "January 3rd, 2024",
  },
  {
    quote:
      "Jessica was fantastic to work with. She was so helpful. We'll definitely work together again in the future.",
    name: "Brandy Cheville Bouldin",
    trip: "September 16th, 2022",
  },
  {
    quote:
      "Five, definitely. You did an amazing job explaining everything. We got a great deal. We had an amazing time.",
    name: "Poppy Wilson",
    trip: "Portland, Oregon",
  },
];
const JESSICA_CERTIFICATIONS = [
  { icon: Castle, label: "Disney Specialist" },
  { icon: Ship, label: "Royal Caribbean Expert" },
  { icon: Globe, label: "Universal Specialist" },
  { icon: Award, label: "Certified Travel Advisor" },
];

const JESSICA_PHOTOS = [
  { src: "/jesshero3.jpeg", alt: "Jessica Seiders - Your Travel Expert" },
  { src: "/jesshero.jpeg", alt: "Jessica planning a trip" },
  { src: "/jesshero2.jpeg", alt: "Jessica with happy clients" },
  { src: "/jesshero_01.jpeg", alt: "Jessica at a destination" },
];

// Brand strip — looped marquee under the hero. These are partner brands
// Jessica is certified to book; rendered as text chips in a continuous
// scroll for an "as featured / certified by" effect.
const BRAND_STRIP = [
  "Disney Specialist",
  "Royal Caribbean Expert",
  "Universal Studios Certified",
  "Norwegian Cruise Line",
  "Carnival Cruise Line",
  "All-Inclusive Resort Pro",
  "Hawaiian Islands",
  "European River Cruises",
];

export default function Home() {
  const { setVideoContext, preloadContext } = useVideoHero();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

  // Apply scroll-triggered reveal animations to every element flagged
  // with `data-reveal`. Cheap, one-shot IntersectionObserver — see hook.
  useScrollReveal();

  useEffect(() => {
    setVideoContext("landing");

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setVideoContext]);

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      <SEOHead
        canonical="/"
        includeLocalBusiness
      />
      {/* ── Navigation ── */}
      <nav
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled
            ? "bg-primary/95 backdrop-blur-md shadow-lg"
            : "bg-transparent"
        )}
      >
        <div className="container flex items-center justify-between h-16 sm:h-20">
          <Link href="/">
            <div className="text-xl sm:text-2xl font-serif font-bold text-secondary cursor-pointer hover:text-secondary/80 transition-colors">
              Next Chapter Travel
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-foreground hover:text-secondary transition-colors font-sans text-sm"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-foreground hover:text-secondary transition-colors font-sans text-sm"
            >
              How It Works
            </a>
            <a
              href="#about-jessica"
              className="text-foreground hover:text-secondary transition-colors font-sans text-sm"
            >
              About Jessica
            </a>
              <Link href="/plan-my-trip">
                <Button
                  size="sm"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold"
                  onMouseEnter={() => preloadContext("plan-my-trip")}
                  onFocus={() => preloadContext("plan-my-trip")}
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
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

        {/* Mobile Menu */}
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
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-secondary transition-colors font-sans py-3 px-4 rounded-xl hover:bg-secondary/10 min-h-[48px] flex items-center active:scale-98"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-secondary transition-colors font-sans py-3 px-4 rounded-xl hover:bg-secondary/10 min-h-[48px] flex items-center active:scale-98"
            >
              How It Works
            </a>
            <a
              href="#about-jessica"
              onClick={() => setMobileMenuOpen(false)}
              className="text-foreground hover:text-secondary transition-colors font-sans py-3 px-4 rounded-xl hover:bg-secondary/10 min-h-[48px] flex items-center active:scale-98"
            >
              About Jessica
            </a>
            <div className="pt-3 border-t border-border/50 flex flex-col gap-3">
              <Link
                href="/plan-my-trip"
                onClick={() => setMobileMenuOpen(false)}
                onMouseEnter={() => preloadContext("plan-my-trip")}
                onFocus={() => preloadContext("plan-my-trip")}
              >
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold min-h-[52px] text-base rounded-xl active:scale-98 transition-transform">
                  Plan My Trip
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full">
                <Button
                  variant="outline"
                  className="w-full bg-background/40 backdrop-blur-md border-border hover:bg-background/60 font-sans font-bold min-h-[52px] text-base rounded-xl active:scale-98 transition-transform"
                >
                  Client Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* ── Hero Section ── */}
      <section className="pt-24 sm:pt-32 md:pt-44 pb-14 sm:pb-24 md:pb-32 relative overflow-hidden">
        {/* Aurora gradient mesh — purely decorative, behind hero copy */}
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="aurora-blob gold" style={{ width: "44rem", height: "44rem", top: "-12rem", left: "-10rem" }} />
          <span className="aurora-blob navy" style={{ width: "40rem", height: "40rem", top: "-6rem", right: "-12rem" }} />
          <span className="aurora-blob cream" style={{ width: "32rem", height: "32rem", bottom: "-10rem", left: "30%" }} />
        </div>
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge
              data-reveal
              className="mb-4 sm:mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-[10px] sm:text-xs tracking-[0.18em] uppercase inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md"
            >
              <Sparkles className="w-3 h-3" />
              Your Personal Travel Concierge
            </Badge>
            <h1
              data-reveal
              data-reveal-delay="100"
              className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl lg:text-[5.25rem] font-serif font-bold mb-5 sm:mb-8 sm:leading-[1.05] tracking-tight hero-text-shadow"
            >
              Every Trip,{" "}
              <span className="text-gradient-gold italic">
                Perfectly Planned
              </span>
            </h1>
            <p
              data-reveal
              data-reveal-delay="200"
              className="text-base sm:text-xl md:text-2xl text-muted-foreground/90 mb-8 sm:mb-12 font-sans font-light leading-relaxed max-w-2xl mx-auto"
            >
              From Disney magic to Caribbean cruises, Jessica Seiders crafts
              unforgettable journeys with{" "}
              <span className="underline-gold text-foreground font-medium">
                every detail handled
              </span>
              .
            </p>
            <div
              data-reveal
              data-reveal-delay="300"
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5"
            >
              <Link href="/plan-my-trip" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-7 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] cta-glow active:scale-95 transition-all"
                  onMouseEnter={() => preloadContext("plan-my-trip")}
                  onFocus={() => preloadContext("plan-my-trip")}
                >
                  <span>Get My Free Proposal</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-6 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] active:scale-95 transition-all"
                >
                  Client Portal
                </Button>
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-secondary hover:text-secondary/80 px-6 sm:px-10 py-5 sm:py-8 text-sm sm:text-xl font-sans font-bold rounded-2xl min-h-[48px] sm:min-h-[56px] active:scale-95 transition-all"
                >
                  See How It Works
                </Button>
              </a>
            </div>
            {/* Free / 24-hour promise micro-line */}
            <p
              data-reveal
              data-reveal-delay="400"
              className="mt-5 sm:mt-7 text-xs sm:text-sm font-sans text-muted-foreground/80 inline-flex items-center justify-center gap-2 flex-wrap"
            >
              <Shield className="w-4 h-4 text-secondary" />
              <span>100% free planning</span>
              <span className="opacity-40">·</span>
              <Clock className="w-4 h-4 text-secondary" />
              <span>Personal proposal within 24 hours</span>
              <span className="opacity-40">·</span>
              <Star className="w-4 h-4 text-secondary fill-secondary" />
              <span>Zero obligation</span>
            </p>
            <div
              data-reveal
              data-reveal-delay="500"
              className="mt-10 sm:mt-14 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto w-full"
            >
              {[
                { value: "50+", label: "Families Served", icon: Users },
                { value: "100+", label: "Trips Planned", icon: Plane },
                { value: "5★", label: "Average Rating", icon: Star },
                { value: "Free", label: "Consultation", icon: Shield },
              ].map(stat => (
                <div
                  key={stat.label}
                  className="gradient-border-gold bg-card/45 backdrop-blur-md rounded-2xl px-3 py-4 sm:px-4 sm:py-6 flex flex-col items-center gap-1.5 text-center hover:bg-card/65 transition-all group lift-on-hover"
                >
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform" />
                  <p className="text-xl sm:text-3xl font-serif font-bold text-gradient-gold leading-none">
                    {stat.value}
                  </p>
                  <p className="text-[11px] sm:text-xs text-muted-foreground font-sans leading-tight tracking-wide">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Brand / Trust Marquee ── */}
      <section
        aria-label="Certifications and partners"
        className="py-7 sm:py-9 border-y border-border/40 bg-black/30 backdrop-blur-sm relative"
      >
        <div className="container">
          <p className="text-center text-[10px] sm:text-xs uppercase tracking-[0.28em] text-muted-foreground/70 font-sans mb-4">
            Certified Specialist · Trusted Partners
          </p>
          <div className="marquee" aria-hidden>
            {[0, 1].map(loop => (
              <ul
                key={loop}
                className="marquee-track list-none m-0 p-0"
              >
                {BRAND_STRIP.map(brand => (
                  <li
                    key={`${loop}-${brand}`}
                    className="flex items-center gap-2 text-secondary/85 font-sans text-sm sm:text-base font-semibold whitespace-nowrap"
                  >
                    <Sparkles className="w-3.5 h-3.5 opacity-60" />
                    {brand}
                  </li>
                ))}
              </ul>
            ))}
          </div>
          {/* Screen-reader equivalent of the marquee */}
          <p className="sr-only">
            Certified in {BRAND_STRIP.join(", ")}.
          </p>
        </div>
      </section>

      {/* ── Portal Value Recap ── */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-10 sm:mb-14" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              What's in your portal
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Everything arrives together{" "}
              <span className="text-gradient-gold italic">once you book</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Your portal ties booking to delivery: itinerary, documents,
              messaging, packing lists, guides, and live updates — all in one
              place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {FEATURES.map((feature, idx) => (
              <div
                key={`portal-${feature.title}`}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="gradient-border-gold bg-card/55 backdrop-blur-md p-5 sm:p-6 rounded-2xl flex items-start gap-4 lift-on-hover"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0 shadow-lg`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed">
                    {feature.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <span className="aurora-blob gold" style={{ width: "30rem", height: "30rem", top: "-6rem", right: "-6rem", opacity: 0.35 }} />
        </div>
        <div className="container relative">
          <div className="text-center mb-10 sm:mb-14" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Client Voices
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Trusted trips,{" "}
              <span className="text-gradient-gold italic">happy travelers</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Real feedback from families and cruisers who planned with Jessica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={t.name}
                data-reveal
                data-reveal-delay={String((idx + 1) * 100)}
                className="gradient-border-gold relative bg-card/65 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/20 flex flex-col gap-4 lift-on-hover"
              >
                {/* Decorative giant quote mark */}
                <Quote
                  className="absolute -top-3 -left-1 w-12 h-12 text-secondary/25 fill-secondary/15 rotate-180"
                  aria-hidden
                />
                {/* 5-star rating */}
                <div className="flex gap-1 relative">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 text-secondary fill-secondary"
                    />
                  ))}
                </div>
                <p className="text-sm sm:text-base text-foreground/85 font-sans leading-relaxed flex-1 relative">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-2 border-t border-border/50 relative">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 ring-2 ring-secondary/40 ring-offset-2 ring-offset-card flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-secondary font-sans">
                      {t.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold font-sans text-foreground text-sm">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {t.trip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section
        id="features"
        className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm"
      >
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Everything You Need
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Your Complete Trip Companion
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              From planning to landing back home, every feature you need is
              built right in.
            </p>
          </div>
          {/* 1-col mobile → 2-col tablet → 3-col desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="group gradient-border-gold bg-card/55 backdrop-blur-md p-6 sm:p-8 rounded-2xl lift-on-hover"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 sm:mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed mb-3">
                  {feature.desc}
                </p>
                <div className="text-xs sm:text-sm text-secondary font-sans inline-flex items-start gap-2 bg-secondary/10 px-3 py-2 rounded-xl border border-secondary/20">
                  <Sparkles className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Example: {feature.example}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Jessica Section ── */}
      <section id="about-jessica" className="py-16 sm:py-24 relative">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            <div className="order-last md:order-first">
              <Badge className="mb-4 sm:mb-6 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
                Meet Your Travel Expert
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">
                Jessica Seiders
              </h2>
              <p className="text-secondary font-sans font-semibold text-lg mb-6">
                Founder & Certified Travel Advisor
              </p>

              {/* Certification Badges - Mobile scrollable */}
              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {JESSICA_CERTIFICATIONS.map(cert => (
                  <div
                    key={cert.label}
                    className="flex items-center gap-2 bg-secondary/10 border border-secondary/20 px-3 py-2 rounded-xl text-sm font-sans"
                  >
                    <cert.icon className="w-4 h-4 text-secondary" />
                    <span className="text-foreground">{cert.label}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 sm:space-y-5 text-muted-foreground text-base sm:text-lg font-sans leading-relaxed">
                <p>
                  Hi, I'm Jessica! As the founder of Next Chapter Travel LLC, I
                  bring over a decade of travel expertise and an unwavering
                  passion for creating unforgettable vacation experiences.
                </p>
                <p>
                  Whether it's the magic of Disney parks, the thrill of
                  Universal adventures, the relaxation of an all-inclusive beach
                  resort, or the wonder of a luxury cruise, I handle every
                  detail so you can focus on making memories.
                </p>
                <p className="flex items-start gap-3">
                  <Heart className="w-5 h-5 text-secondary mt-1 flex-shrink-0" />
                  <span>
                    <strong className="text-foreground">My Promise:</strong> I
                    treat every trip like it's my own family's vacation — with
                    that same level of care, attention, and excitement.
                  </span>
                </p>
              </div>

              <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <Link href="/plan-my-trip">
                  <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-sans font-bold rounded-xl min-h-[56px] active:scale-98 transition-transform">
                    Start Planning With Me
                  </Button>
                </Link>
                <a href="#how-it-works">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-secondary/30 hover:bg-secondary/10 px-8 py-6 text-lg font-sans font-bold rounded-xl min-h-[56px] active:scale-98 transition-transform"
                  >
                    See How It Works
                  </Button>
                </a>
              </div>

              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                <p className="text-sm font-sans text-muted-foreground mb-4">
                  Connect with me:
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.facebook.com/nextchaptertravel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors bg-secondary/10 px-4 py-3 rounded-xl min-h-[48px] active:scale-98"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="font-sans font-semibold">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/nextchaptertravelllc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors bg-secondary/10 px-4 py-3 rounded-xl min-h-[48px] active:scale-98"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-sans font-semibold">Instagram</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Jessica's Interactive Photo Gallery */}
            <div className="flex flex-col items-center py-4 sm:py-8 order-first md:order-last">
              <div className="relative w-full max-w-[420px] md:max-w-[500px] mx-auto">
                {/* Main featured photo with layered conic glow ring */}
                <div className="ring-glow relative rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-2xl mb-4">
                  <LazyImage
                    src={JESSICA_PHOTOS[activePhotoIndex].src}
                    alt={JESSICA_PHOTOS[activePhotoIndex].alt}
                    className="w-full h-auto object-contain transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/10 to-transparent" />

                  {/* Floating name badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-5 py-2 rounded-xl shadow-xl font-serif font-bold text-sm sm:text-base whitespace-nowrap">
                    Jessica Seiders
                  </div>
                </div>

                {/* Thumbnail gallery - scrollable on mobile */}
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                  {JESSICA_PHOTOS.map((photo, index) => (
                    <button
                      key={photo.src}
                      onClick={() => setActivePhotoIndex(index)}
                      className={cn(
                        "relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-center active:scale-95",
                        activePhotoIndex === index
                          ? "border-secondary ring-2 ring-secondary/30 ring-offset-2 ring-offset-primary"
                          : "border-border/50 hover:border-secondary/50 opacity-70 hover:opacity-100"
                      )}
                    >
                      <LazyImage
                        src={photo.src}
                        alt={photo.alt}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section
        id="how-it-works"
        className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden"
      >
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="aurora-blob gold" style={{ width: "30rem", height: "30rem", top: "-8rem", left: "10%", opacity: 0.25 }} />
          <span className="aurora-blob navy" style={{ width: "30rem", height: "30rem", bottom: "-10rem", right: "5%", opacity: 0.4 }} />
        </div>
        <div className="container relative">
          <div className="text-center mb-12 sm:mb-20" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/15 text-secondary border-secondary/30 font-sans text-xs tracking-widest uppercase">
              The Process
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">
              How It{" "}
              <span className="text-gradient-gold italic">Works</span>
            </h2>
            <p className="text-primary-foreground/65 text-base sm:text-lg font-sans">
              Three simple steps to your perfect vacation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-10 sm:gap-12 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-10 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-secondary/40 to-transparent" />

            {[
              {
                step: "01",
                title: "Book With Jessica",
                desc: "Schedule a free 15-minute call or complete a 3-minute travel questionnaire to share your dates, travelers, and must-do moments.",
              },
              {
                step: "02",
                title: "Get Your Portal",
                desc: "Review a tailored proposal, approve, and receive your personal portal with itinerary, documents, guides, and messaging.",
              },
              {
                step: "03",
                title: "Travel With Confidence",
                desc: "Use your portal on the go. Get real-time help for delays, changes, and on-the-ground recommendations.",
              },
            ].map((item, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String((i + 1) * 150)}
                className="relative text-center group"
              >
                {/* Gradient step circle */}
                <div className="relative mx-auto mb-5 sm:mb-6 w-20 h-20 rounded-full flex items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-secondary/70 text-secondary-foreground shadow-[0_0_30px_-4px_oklch(0.72_0.09_65/0.6)] group-hover:scale-110 transition-transform">
                  <span className="text-2xl font-serif font-black">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  {item.title}
                </h3>
                <p className="text-primary-foreground/75 text-sm sm:text-base leading-relaxed font-sans max-w-[280px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Jessica's Upcoming Trips Section ── */}
      <section className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Jessica's Featured Destinations
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Destinations Anyone Can Book
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Explore these hand-picked destinations curated by Jessica. Perfect
              for families, couples, and solo travelers.
            </p>
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mt-4 sm:mt-6">
              {DESTINATION_EXAMPLES.map(item => (
                <span
                  key={item}
                  className="text-xs sm:text-sm font-sans px-3 py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                >
                  <Compass className="inline w-4 h-4 mr-1" />
                  {item}
                </span>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {jessicaTrips.map((trip, idx) => (
              <div
                key={trip.id}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="group gradient-border-gold bg-card/55 backdrop-blur-md rounded-2xl overflow-hidden lift-on-hover"
              >
                <div className="relative h-44 sm:h-64 overflow-hidden">
                  <LazyImage
                    src={trip.image}
                    alt={trip.title}
                    width="800"
                    height="500"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                  <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                    <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-[10px] sm:text-xs shadow-lg">
                      {trip.date}
                    </Badge>
                  </div>
                </div>
                <div className="p-5 sm:p-8">
                  <div className="flex items-center gap-2 text-secondary/85 font-sans text-xs mb-2 tracking-wide uppercase">
                    <MapPin className="w-3 h-3" />
                    {trip.destination}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3">
                    {trip.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base font-sans mb-6 leading-relaxed">
                    {trip.description}
                  </p>
                  <Link href="/plan-my-trip">
                    <Button className="group/btn w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold rounded-xl">
                      Book This Trip
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-secondary/5 via-secondary/10 to-secondary/5 backdrop-blur-sm" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,oklch(0.72_0.09_65/0.18)_0%,transparent_70%)]" />
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="aurora-blob gold" style={{ width: "36rem", height: "36rem", top: "-8rem", left: "10%" }} />
          <span className="aurora-blob navy" style={{ width: "32rem", height: "32rem", bottom: "-10rem", right: "10%", opacity: 0.4 }} />
        </div>
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto" data-reveal>
            <Badge className="mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-xs tracking-[0.2em] uppercase px-3 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              Your Dream Vacation Awaits
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif font-bold mb-6 sm:mb-8 leading-[1.05]">
              Ready to Start Your{" "}
              <span className="text-gradient-gold italic">Next Chapter?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-4 font-sans leading-relaxed">
              Certified in Disney, Universal, Norwegian, Royal Caribbean,
              Carnival, and more — Jessica handles every detail so you can
              focus on the memories.
            </p>
            <p className="text-sm sm:text-base text-secondary/90 font-sans font-semibold mb-10 sm:mb-12 inline-flex items-center justify-center gap-2 flex-wrap">
              <Clock className="w-4 h-4" />
              Free personalized proposal in 24 hours
              <span className="opacity-40">·</span>
              <Shield className="w-4 h-4" />
              No fees, no obligation
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-6">
              <Link href="/plan-my-trip" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-7 sm:px-14 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] cta-glow active:scale-95 transition-all"
                >
                  <span>Get My Free Proposal</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-6 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] active:scale-95 transition-all"
                >
                  Client Portal
                </Button>
              </a>
            </div>
            {/* Certification strip */}
            <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
              {["Disney Specialist", "Royal Caribbean Expert", "Universal Studios", "Carnival Certified", "Norwegian Cruise Line"].map(cert => (
                <span key={cert} className="text-xs font-sans text-muted-foreground/70 px-3 py-1 rounded-full border border-secondary/20 bg-card/30 backdrop-blur-sm">
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer
        className="py-12 sm:py-16 bg-primary text-primary-foreground border-t border-white/10"
        style={{ paddingBottom: "max(3rem, calc(2rem + env(safe-area-inset-bottom, 0px)))" }}
      >
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
                {[
                  { label: "Features", href: "#features", internal: false },
                  { label: "How It Works", href: "#how-it-works", internal: false },
                  { label: "About Jessica", href: "#about-jessica", internal: false },
                  { label: "Plan My Trip", href: "/plan-my-trip", internal: true },
                  { label: "Client Portal", href: null, external: true },
                ].map(link =>
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
                        href={link.href}
                        className="text-primary-foreground/60 hover:text-secondary transition-colors py-0.5 inline-block"
                      >
                        {link.label}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Destinations */}
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest text-secondary/80">
                Specialties
              </h4>
              <ul className="space-y-2 font-sans text-sm text-primary-foreground/60">
                {[
                  "Disney World & Disneyland",
                  "Caribbean Cruises",
                  "Universal Studios",
                  "All-Inclusive Resorts",
                  "Hawaiian Getaways",
                  "European River Cruises",
                ].map(dest => (
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
                    href="mailto:jessica@nextchaptertravel.com"
                    className="text-primary-foreground/70 hover:text-secondary transition-colors"
                  >
                    jessica@nextchaptertravel.com
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
            <p>&copy; 2026 Next Chapter Travel LLC. All rights reserved.</p>
            <p>
              <a href="/sitemap.xml" className="hover:text-primary-foreground/60 transition-colors">
                Sitemap
              </a>
              <span className="mx-2">·</span>
              <a href="mailto:jessica@nextchaptertravel.com" className="hover:text-primary-foreground/60 transition-colors">
                Privacy
              </a>
            </p>
          </div>
        </div>
      </footer>

      {/* ── Scroll to Top Button (Mobile) ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed right-4 sm:right-6 bottom-safe-offset z-40 w-12 h-12 sm:w-14 sm:h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90",
          showScrollTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none"
        )}
        aria-label="Scroll to top"
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </div>
  );
}
