import { useVideoHero } from "@/contexts/VideoHeroContext";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import {
  MapPin,
  MessageSquare,
  FileText,
  CheckSquare,
  Calendar,
  Plane,
  Shield,
  Star,
  ArrowRight,
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
} from "lucide-react";

import { cn } from "@/lib/utils";
import { jessicaTrips } from "@/data/jessica-trips";

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

export default function Home() {
  const { setVideoContext } = useVideoHero();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);

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
            "md:hidden bg-primary/98 backdrop-blur-lg border-t border-border overflow-hidden transition-all duration-300 ease-out",
            mobileMenuOpen ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="container py-6 flex flex-col gap-3">
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
      <section className="pt-32 sm:pt-40 md:pt-48 pb-16 sm:pb-24 md:pb-32 relative">
        <div className="container">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 sm:mb-6 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase inline-block">
              Your Personal Travel Concierge
            </Badge>
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-bold mb-6 sm:mb-8 leading-tight">
              Every Trip, Perfectly Planned
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 font-sans leading-relaxed max-w-2xl mx-auto">
              From Disney magic to Caribbean cruises, Jessica Seiders at Next
              Chapter Travel LLC creates unforgettable journeys with every
              detail handled.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="/plan-my-trip">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-12 py-8 text-xl font-sans font-bold rounded-2xl shadow-xl shadow-secondary/20 active:scale-95 transition-all"
                >
                  Plan My Trip
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-12 py-8 text-xl font-sans font-bold rounded-2xl active:scale-95 transition-all"
                >
                  Client Portal
                </Button>
              </a>
              <a href="#how-it-works" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full sm:w-auto text-secondary hover:text-secondary/80 px-10 py-8 text-xl font-sans font-bold rounded-2xl active:scale-95 transition-all"
                >
                  See How It Works
                </Button>
              </a>
            </div>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-left max-w-3xl mx-auto">
              <div className="bg-secondary/10 border border-secondary/20 rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 w-full sm:w-auto">
                <Star className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-bold font-sans text-secondary">
                    Trusted by 50+ families
                  </p>
                  <p className="text-sm text-muted-foreground font-sans">
                    “Jessica handled every detail so we could just enjoy the
                    trip.”
                  </p>
                </div>
              </div>
              <div className="bg-card/60 border border-border rounded-2xl px-4 py-3 sm:px-5 sm:py-4 flex items-center gap-3 w-full sm:w-auto">
                <Shield className="w-6 h-6 text-secondary" />
                <div>
                  <p className="font-bold font-sans">Concierge support</p>
                  <p className="text-sm text-muted-foreground font-sans">
                    Real humans, real-time help while you travel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Portal Value Recap ── */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              What's in your portal
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Everything arrives together once you book
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Your portal ties booking to delivery: itinerary, documents,
              messaging, packing lists, guides, and live updates — all in one
              place.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {FEATURES.map(feature => (
              <div
                key={`portal-${feature.title}`}
                className="bg-card/50 backdrop-blur-sm p-5 sm:p-6 rounded-2xl border border-border flex items-start gap-4"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${feature.color} flex items-center justify-center shrink-0`}
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
      <section className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-10 sm:mb-14">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Client Voices
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Trusted trips, happy travelers
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Real feedback from families and cruisers who planned with Jessica.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map(t => (
              <div
                key={t.name}
                className="bg-card/60 backdrop-blur-sm border border-border rounded-2xl p-6 sm:p-7 shadow-lg shadow-black/10 flex flex-col gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-secondary/15 border border-secondary/30 flex items-center justify-center">
                    <Star className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold font-sans text-foreground">
                      {t.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-sans">
                      {t.trip}
                    </p>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-muted-foreground font-sans leading-relaxed">
                  “{t.quote}”
                </p>
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
            {FEATURES.map(feature => (
              <div
                key={feature.title}
                className="group bg-card/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border hover:border-secondary/50 hover:shadow-lg transition-all"
              >
                <div
                  className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed mb-3">
                  {feature.desc}
                </p>
                <div className="text-xs sm:text-sm text-secondary font-sans inline-flex items-center gap-2 bg-secondary/10 px-3 py-2 rounded-full border border-secondary/20">
                  <Sparkles className="w-4 h-4" />
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
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-3xl animate-pulse" />

                {/* Main featured photo */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-2xl mb-4">
                  <img
                    src={JESSICA_PHOTOS[activePhotoIndex].src}
                    alt={JESSICA_PHOTOS[activePhotoIndex].alt}
                    className="w-full h-auto object-contain transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />

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
                      <img
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
        className="py-16 sm:py-24 bg-primary text-primary-foreground"
      >
        <div className="container">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">
              How It Works
            </h2>
            <p className="text-primary-foreground/60 text-base sm:text-lg font-sans">
              Three simple steps to your perfect vacation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />

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
              <div key={i} className="relative text-center group">
                <div className="text-6xl sm:text-8xl font-serif font-black text-secondary/10 mb-[-30px] sm:mb-[-40px] group-hover:text-secondary/20 transition-colors">
                  {item.step}
                </div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10">
                  {item.title}
                </h3>
                <p className="text-primary-foreground/70 text-sm sm:text-base leading-relaxed font-sans max-w-[280px] mx-auto">
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
            {jessicaTrips.map(trip => (
              <div
                key={trip.id}
                className="group bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-secondary/50 transition-all hover:shadow-2xl"
              >
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-xs">
                      {trip.date}
                    </Badge>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-secondary/80 font-sans text-xs mb-2">
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
                    <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold rounded-xl">
                      Book This Trip
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
        <div className="absolute inset-0 bg-secondary/10 backdrop-blur-sm" />
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 sm:mb-8">
              Ready to Start Your Next Chapter?
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 font-sans leading-relaxed">
              Certified in Disney, Universal, Norwegian Cruise Line, Royal
              Caribbean, Carnival, and more — Jessica Seiders at Next Chapter
              Travel LLC has the expertise to plan any adventure you can
              imagine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="/plan-my-trip">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-12 py-8 text-xl font-sans font-bold rounded-2xl shadow-xl shadow-secondary/20 active:scale-95 transition-all"
                >
                  Plan My Trip
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-12 py-8 text-xl font-sans font-bold rounded-2xl active:scale-95 transition-all"
                >
                  Client Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 sm:py-16 bg-primary text-primary-foreground border-t border-white/5">
        <div className="container">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 sm:gap-12 mb-12 sm:mb-16">
            <div>
              <h3 className="font-serif font-bold text-lg mb-4">
                Next Chapter Travel
              </h3>
              <p className="text-primary-foreground/60 text-sm font-sans leading-relaxed">
                Your personal travel concierge, crafting unforgettable journeys
                with expert planning and care.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">
                Quick Links
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <a
                    href="#features"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors py-1 inline-block"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#how-it-works"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors py-1 inline-block"
                  >
                    How It Works
                  </a>
                </li>
                <li>
                  <a
                    href="#about-jessica"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors py-1 inline-block"
                  >
                    About Jessica
                  </a>
                </li>
                <li>
                  <Link
                    href="/plan-my-trip"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors py-1 inline-block"
                  >
                    Plan My Trip
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">
                Company
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li>
                  <a
                    href="https://www.facebook.com/nextchaptertravel/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors py-1 inline-block"
                  >
                    Facebook
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.instagram.com/nextchaptertravelllc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary-foreground/60 hover:text-primary-foreground transition-colors py-1 inline-block"
                  >
                    Instagram
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">
                Team
              </h4>
              <ul className="space-y-3 font-sans text-sm">
                <li className="text-primary-foreground/60">
                  <span className="font-semibold">Jessica Seiders</span>
                  <div className="text-xs text-primary-foreground/50">
                    Chief Financial Officer (CFO)
                  </div>
                </li>
                <li className="text-primary-foreground/60">
                  <span className="font-semibold">Wendy</span>
                  <div className="text-xs text-primary-foreground/50">
                    Chief Operating Officer (COO)
                  </div>
                  <div className="text-xs text-primary-foreground/50 mt-1">
                    Based in North Carolina. Craft business owner (wood crafts,
                    candles, wax melts). Travel enthusiast, dog lover, motocross
                    fan.
                  </div>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">
                Contact
              </h4>
              <p className="text-primary-foreground/60 text-sm font-sans mb-2">
                <a
                  href="mailto:jessica@nextchaptertravel.com"
                  className="hover:text-primary-foreground transition-colors"
                >
                  jessica@nextchaptertravel.com
                </a>
              </p>
              <p className="text-primary-foreground/60 text-sm font-sans">
                Next Chapter Travel LLC
              </p>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 sm:pt-10 text-center text-primary-foreground/60 text-sm font-sans">
            <p>&copy; 2026 Next Chapter Travel LLC. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── Scroll to Top Button (Mobile) ── */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={cn(
          "fixed bottom-20 right-4 z-40 w-12 h-12 sm:w-14 sm:h-14 bg-secondary text-secondary-foreground rounded-full shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90",
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
