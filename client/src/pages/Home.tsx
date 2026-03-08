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
import { jessicaTrips } from "@/data/jessica-trips";

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

const WENDY_GROUP_TRIPS = [
  {
    title: "Morocco: Intentional Group Travel",
    date: "May 16-23, 2026",
    location: "Morocco",
    description: "Experiences designed with intention, grounded in feminism, and shaped by the women who make them possible.",
    image: "https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&q=80&w=800",
    category: "Group Trip",
  },
  {
    title: "Greece: Mediterranean Escape",
    date: "June 2-11, 2026",
    location: "Greece",
    description: "Explore the stunning islands and ancient history of Greece with a community of like-minded women.",
    image: "https://images.unsplash.com/photo-1503152394-c571994fd383?auto=format&fit=crop&q=80&w=800",
    category: "Luxury Group Trip",
  },
  {
    title: "Ireland: Emerald Isle Adventure",
    date: "June 29 - July 9, 2026",
    location: "Ireland",
    description: "Discover the lush landscapes and vibrant culture of Ireland on this 10-day guided journey.",
    image: "https://images.unsplash.com/photo-1590089415225-401ed6f9db8e?auto=format&fit=crop&q=80&w=800",
    category: "Group Trip",
  },
  {
    title: "Italy: Tuscan Dreams",
    date: "August 19-28, 2026",
    location: "Italy",
    description: "A journey through the heart of Tuscany, featuring world-class wine, art, and unforgettable landscapes.",
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&q=80&w=800",
    category: "Luxury Group Trip",
  },
  {
    title: "Guatemala: Culture & Connection",
    date: "Late 2026 (TBD)",
    location: "Guatemala",
    description: "Escape the ordinary and embark on a journey filled with adventure, culture, and empowerment in stunning Guatemala.",
    image: "https://images.unsplash.com/photo-1528150177508-7cc0c36cda5c?auto=format&fit=crop&q=80&w=800",
    category: "Group Trip",
  },
];

export default function Home() {
  const { setVideoContext } = useVideoHero();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const nextSlide = () => {
    setCarouselIndex((prev) => (prev + 1) % WENDY_GROUP_TRIPS.length);
  };

  const prevSlide = () => {
    setCarouselIndex((prev) => (prev - 1 + WENDY_GROUP_TRIPS.length) % WENDY_GROUP_TRIPS.length);
  };

  useEffect(() => {
    setVideoContext("landing");
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setVideoContext]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      {/* ── Navigation ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-primary/95 backdrop-blur-md shadow-lg" : "bg-transparent"
      )}>
        <div className="container flex items-center justify-between h-16 sm:h-20">
          <Link href="/">
            <div className="text-xl sm:text-2xl font-serif font-bold text-secondary cursor-pointer hover:text-secondary/80 transition-colors">
              Next Chapter Travel
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-secondary transition-colors font-sans text-sm">Features</a>
            <a href="#how-it-works" className="text-foreground hover:text-secondary transition-colors font-sans text-sm">How It Works</a>
            <Link href="/plan">
              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold">
                Plan My Trip
              </Button>
            </Link>
            <a href={getLoginUrl()}>
              <Button size="sm" variant="outline" className="bg-background/40 backdrop-blur-md border-border hover:bg-background/60 font-sans font-bold">
                Client Portal
              </Button>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-secondary/10 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-primary/95 backdrop-blur-md border-t border-border">
            <div className="container py-4 flex flex-col gap-4">
              <a href="#features" className="text-foreground hover:text-secondary transition-colors font-sans">Features</a>
              <a href="#how-it-works" className="text-foreground hover:text-secondary transition-colors font-sans">How It Works</a>
              <Link href="/plan">
                <Button className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold">
                  Plan My Trip
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full">
                <Button variant="outline" className="w-full bg-background/40 backdrop-blur-md border-border hover:bg-background/60 font-sans font-bold">
                  Client Portal
                </Button>
              </a>
            </div>
          </div>
        )}
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
              From Disney magic to Caribbean cruises, Jessica Seiders (CFO) at Next Chapter Travel LLC creates unforgettable journeys with every detail handled.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="/plan">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-12 py-8 text-xl font-sans font-bold rounded-2xl shadow-xl shadow-secondary/20 active:scale-95 transition-all">
                  Plan My Trip
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-12 py-8 text-xl font-sans font-bold rounded-2xl active:scale-95 transition-all">
                  Client Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Grid ── */}
      <section id="features" className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm">
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
                className="group bg-card/50 backdrop-blur-sm p-6 sm:p-8 rounded-2xl border border-border hover:border-secondary/50 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-xl ${feature.color} flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">{feature.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── About Jessica Section ── */}
      <section className="py-16 sm:py-24 relative">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
            <div className="order-last md:order-first">
              <Badge className="mb-4 sm:mb-6 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
                Meet Jessica
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-6 sm:mb-8">
                Your Travel Expert
              </h2>
              <p className="text-muted-foreground text-base sm:text-lg font-sans mb-4 sm:mb-6 leading-relaxed">
                Hi, I'm Jessica! As the CFO and a Certified Travel Specialist at Next Chapter Travel LLC, I'm passionate about helping you create memories that last a lifetime. Whether it's the magic of Disney, the thrill of a Universal adventure, or the relaxation of a luxury cruise, I'm here to handle every detail.
              </p>
              <p className="text-muted-foreground text-base sm:text-lg font-sans mb-8 sm:mb-10 leading-relaxed">
                My goal is to make your travel planning as stress-free as the vacation itself. From hand-picked destinations to personalized itineraries, I'm dedicated to crafting the perfect journey for you and your loved ones.
              </p>
              <Link href="/plan">
                <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-3 text-lg font-sans font-bold rounded-xl">
                  Start Planning With Jessica
                </Button>
              </Link>
              <div className="mt-10 sm:mt-12 pt-10 sm:pt-12 border-t border-border">
                <p className="text-sm font-sans text-muted-foreground mb-4">Connect with Jessica on social media:</p>
                <a href="https://www.facebook.com/nextchaptertravel" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors">
                  <Facebook className="w-5 h-5" />
                  <span className="font-sans font-semibold">Facebook</span>
                </a>
              </div>
            </div>

            {/* Jessica's Photo Gallery — three photos shown in a staggered grid */}
            <div className="flex items-center justify-center py-6 sm:py-8 order-first md:order-last">
              <div className="relative w-full max-w-[420px] md:max-w-[500px] mx-auto">
                {/* Decorative glow */}
                <div className="absolute inset-0 bg-secondary/10 blur-3xl rounded-3xl animate-pulse" />

                {/* Large hero photo */}
                <div className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-2xl mb-3">
                  <img
                    src="/jesshero3.jpeg"
                    alt="Jessica Seiders - CFO & Certified Travel Specialist"
                    className="w-full object-cover object-top"
                    style={{ maxHeight: '420px' }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                </div>

                {/* Two smaller photos side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-xl">
                    <img
                      src="/jesshero2.jpeg"
                      alt="Jessica Seiders holding books"
                      className="w-full object-cover object-top"
                      style={{ maxHeight: '220px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                  </div>
                  <div className="relative rounded-2xl overflow-hidden border-2 border-secondary/30 shadow-xl">
                    <img
                      src="/jesshero_01.jpeg"
                      alt="Jessica Seiders at the bookstore"
                      className="w-full object-cover object-top"
                      style={{ maxHeight: '220px' }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                  </div>
                </div>

                {/* Floating name badge */}
                <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-5 py-2 rounded-xl shadow-xl font-serif font-bold text-sm sm:text-base animate-float whitespace-nowrap">
                  Jessica Seiders
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 sm:mb-6">How It Works</h2>
            <p className="text-primary-foreground/60 text-base sm:text-lg font-sans">Three simple steps to your perfect vacation</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 relative">
            {/* Connector line for desktop */}
            <div className="hidden md:block absolute top-1/4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-secondary/30 to-transparent" />
            
            {[
              { step: "01", title: "Book With Jessica", desc: "Connect with Jessica to plan your dream trip. She handles all the details, bookings, and logistics." },
              { step: "02", title: "Get Your Portal", desc: "Receive access to your personalized travel portal with your complete itinerary and documents." },
              { step: "03", title: "Travel With Confidence", desc: "Everything you need is in your pocket. Enjoy your trip knowing Jessica is just a message away." }
            ].map((item, i) => (
              <div key={i} className="relative text-center group">
                <div className="text-6xl sm:text-8xl font-serif font-black text-secondary/10 mb-[-30px] sm:mb-[-40px] group-hover:text-secondary/20 transition-colors">{item.step}</div>
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 relative z-10">{item.title}</h3>
                <p className="text-primary-foreground/70 text-sm sm:text-base leading-relaxed font-sans max-w-[280px] mx-auto">{item.desc}</p>
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
              Explore these hand-picked destinations curated by Jessica. Perfect for families, couples, and solo travelers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {jessicaTrips.map((trip) => (
              <div key={trip.id} className="group bg-card/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-border hover:border-secondary/50 transition-all hover:shadow-2xl">
                <div className="relative h-48 sm:h-64 overflow-hidden">
                  <img src={trip.image} alt={trip.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-xs">{trip.date}</Badge>
                  </div>
                </div>
                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-secondary/80 font-sans text-xs mb-2">
                    <MapPin className="w-3 h-3" />
                    {trip.destination}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3">{trip.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base font-sans mb-6 leading-relaxed">{trip.description}</p>
                  <Link href="/plan">
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

      {/* ── Wendy's Group Trips Carousel ── */}
      <section className="py-16 sm:py-24 bg-black/20 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Wendy's Signature Group Trips
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              The Next Chapter Group Travel
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Join Wendy and a community of like-minded women on transformative journeys around the world.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <div ref={carouselRef} className="relative h-[500px] sm:h-[600px] rounded-3xl overflow-hidden">
              {WENDY_GROUP_TRIPS.map((trip, idx) => (
                <div
                  key={idx}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    idx === carouselIndex ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {/* Background Image */}
                  <img
                    src={trip.image}
                    alt={trip.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

                  {/* Content */}
                  <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 md:p-10">
                    <div className="max-w-2xl">
                      <div className="flex items-center gap-3 mb-3 sm:mb-4">
                        <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-xs sm:text-sm">
                          {trip.category}
                        </Badge>
                        <div className="flex items-center gap-2 text-secondary/80 font-sans text-sm">
                          <MapPin className="w-4 h-4" />
                          {trip.location}
                        </div>
                      </div>
                      <h3 className="text-2xl sm:text-4xl md:text-5xl font-serif font-bold text-white mb-2 sm:mb-3">
                        {trip.title}
                      </h3>
                      <p className="text-white/80 text-sm sm:text-base font-sans mb-4 sm:mb-6 leading-relaxed">
                        {trip.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="text-secondary font-sans font-semibold text-base sm:text-lg">
                          {trip.date}
                        </div>
                        <Link href="/plan">
                          <Button className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold px-6 sm:px-8 py-2 sm:py-3 rounded-xl">
                            Learn More
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all active:scale-95"
              aria-label="Previous slide"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white rotate-180" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm flex items-center justify-center transition-all active:scale-95"
              aria-label="Next slide"
            >
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
            </button>

            {/* Dot Indicators */}
            <div className="flex items-center justify-center gap-2 mt-6 sm:mt-8">
              {WENDY_GROUP_TRIPS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCarouselIndex(idx)}
                  className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all ${
                    idx === carouselIndex
                      ? "bg-secondary w-8 sm:w-10"
                      : "bg-secondary/30 hover:bg-secondary/50"
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-secondary/10 backdrop-blur-sm" />
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 sm:mb-8">Ready to Start Your Next Chapter?</h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 font-sans leading-relaxed">
              Certified in Disney, Universal, Norwegian Cruise Line, Royal Caribbean, Carnival, and more — Jessica Seiders (CFO) at Next Chapter Travel LLC has the expertise to plan any adventure you can imagine.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6">
              <Link href="/plan">
                <Button size="lg" className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-12 py-8 text-xl font-sans font-bold rounded-2xl shadow-xl shadow-secondary/20 active:scale-95 transition-all">
                  Plan My Trip
                </Button>
              </Link>
              <a href={getLoginUrl()} className="w-full sm:w-auto">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-12 py-8 text-xl font-sans font-bold rounded-2xl active:scale-95 transition-all">
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
              <h3 className="font-serif font-bold text-lg mb-4">Next Chapter Travel</h3>
              <p className="text-primary-foreground/60 text-sm font-sans leading-relaxed">
                Your personal travel concierge, crafting unforgettable journeys with expert planning and care.
              </p>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-2 font-sans text-sm">
                <li><a href="#features" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">How It Works</a></li>
                <li><Link href="/plan" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Plan My Trip</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">Company</h4>
              <ul className="space-y-2 font-sans text-sm">
                <li><a href="https://www.travelingwomenofficial.com" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Traveling Women Official</a></li>
                <li><a href="https://www.facebook.com/nextchaptertravel" target="_blank" rel="noopener noreferrer" className="text-primary-foreground/60 hover:text-primary-foreground transition-colors">Facebook</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-4 font-sans text-sm uppercase tracking-widest">Contact</h4>
              <p className="text-primary-foreground/60 text-sm font-sans mb-2">
                <a href="mailto:jessica@nextchaptertravel.com" className="hover:text-primary-foreground transition-colors">jessica@nextchaptertravel.com</a>
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
    </div>
  );
}
