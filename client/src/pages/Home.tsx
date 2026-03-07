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

export default function Home() {
  const { setVideoContext } = useVideoHero();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setVideoContext("landing");
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [setVideoContext]);

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      {/* ── Navigation ── */}
      <nav className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        isScrolled 
          ? "bg-background/80 backdrop-blur-md py-3 border-border shadow-sm" 
          : "bg-transparent py-6 border-transparent"
      )}>
        <div className="container flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Compass className="w-6 h-6 text-secondary-foreground" />
            </div>
            <span className="text-xl font-bold tracking-tight text-foreground">
              Next Chapter Travel
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <PartnershipDropdown />
            <a href="https://www.facebook.com/share/1BvCajFoBy/" target="_blank" rel="noopener noreferrer" className="text-sm font-sans font-medium text-muted-foreground hover:text-secondary transition-colors">
              <Facebook className="w-5 h-5" />
            </a>
            <div className="h-4 w-px bg-border mx-2" />
            <a href={getLoginUrl()} className="text-sm font-sans font-medium text-muted-foreground hover:text-secondary transition-colors">
              Sign In
            </a>
            <Link href="/join">
              <Button variant="secondary" size="sm" className="font-sans font-semibold px-6 rounded-full shadow-md hover:shadow-lg transition-all active:scale-95">
                Get Started
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2 text-foreground"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-6 animate-in fade-in slide-in-from-top-5 duration-300">
            <div className="flex flex-col gap-6">
              <PartnershipDropdown />
              <a href={getLoginUrl()} className="text-lg font-sans font-medium">Sign In</a>
              <Link href="/join">
                <Button className="w-full bg-secondary text-secondary-foreground font-sans font-bold py-6 text-lg">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* ── Hero Section ── */}
      <section className="relative min-h-[100dvh] flex items-center pt-20 overflow-hidden">
        <div className="container relative z-10">
          <div className="max-w-3xl">
            <Badge className="mb-6 bg-secondary/20 text-secondary border-secondary/30 px-4 py-1.5 font-sans text-xs tracking-[0.2em] uppercase backdrop-blur-sm">
              Next Chapter Travel LLC
            </Badge>
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-foreground mb-6 leading-[1.1] tracking-tight">
              Your Journey, <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary via-secondary/80 to-secondary/60">
                Perfectly Planned
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed max-w-2xl font-sans">
              CFO & Certified Travel Specialist at Next Chapter Travel LLC — Jessica Seiders brings expert planning to Disney, cruises, family adventures, and beyond.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/plan">
                <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 px-10 py-7 text-lg font-sans font-bold rounded-2xl shadow-xl shadow-secondary/20 group transition-all active:scale-95">
                  Plan My Trip
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <a href={getLoginUrl()}>
                <Button size="lg" variant="outline" className="bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-10 py-7 text-lg font-sans font-bold rounded-2xl transition-all active:scale-95">
                  Client Portal
                </Button>
              </a>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 animate-bounce opacity-50">
          <div className="w-px h-12 bg-gradient-to-b from-transparent via-secondary to-transparent" />
          <span className="text-[10px] font-sans tracking-[0.3em] uppercase text-secondary">Explore the World</span>
        </div>
      </section>

      {/* ── About Jessica — with Professional Headshot ── */}
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

            {/* Jessica's Professional Headshot — shown below text on mobile */}
            <div className="flex items-center justify-center py-6 sm:py-8 order-first md:order-last">
              <div className="relative w-full aspect-square max-w-[340px] sm:max-w-[420px] md:max-w-[480px] mx-auto">
                {/* Decorative background elements */}
                <div className="absolute inset-0 rounded-full bg-secondary/10 blur-3xl animate-pulse" />
                <div className="absolute -inset-4 rounded-full border border-secondary/20 animate-spin-slow" style={{ animationDuration: '20s' }} />
                
                {/* Main Image Container */}
                <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-secondary/30 shadow-2xl">
                  <img 
                    src="/assets/jessica-headshot.jpg" 
                    alt="Jessica Seiders - CFO & Certified Travel Specialist"
                    className="w-full h-full object-cover"
                  />
                  {/* Subtle overlay for branding consistency */}
                  <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                </div>

                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-secondary text-secondary-foreground px-4 py-2 rounded-xl shadow-xl font-serif font-bold text-sm sm:text-base animate-float">
                  Jessica Seiders
                </div>
              </div>
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
                className="group p-5 sm:p-8 rounded-2xl border border-border bg-card hover:border-secondary/40 hover:shadow-lg active:scale-[0.98] transition-all duration-300 flex gap-4 sm:block"
              >
                <div className={cn("w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center mb-0 sm:mb-6 group-hover:scale-110 transition-transform duration-300 flex-shrink-0", feature.color)}>
                  <feature.icon className="w-6 h-6 sm:w-7 sm:h-7" />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold mb-1 sm:mb-3 group-hover:text-secondary transition-colors">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-sans">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground">
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

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-24 bg-black/20 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-12 sm:mb-16">
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              What Travelers Say
            </Badge>
          </div>
          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-card p-6 sm:p-8 rounded-2xl border border-border shadow-sm hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-4 sm:mb-6">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
                </div>
                <p className="text-foreground text-base sm:text-lg italic mb-6 sm:mb-8 leading-relaxed font-serif">"{t.quote}"</p>
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-bold font-sans">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base">{t.name}</div>
                    <div className="text-xs sm:text-sm text-muted-foreground font-sans">{t.destination}</div>
                  </div>
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
            <div className="col-span-1 lg:col-span-2">
              <Link href="/" className="flex items-center gap-2.5 mb-6">
                <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                  <Compass className="w-5 h-5 text-secondary-foreground" />
                </div>
                <span className="text-xl font-bold tracking-tight">Next Chapter Travel</span>
              </Link>
              <p className="text-primary-foreground/60 font-sans leading-relaxed max-w-sm mb-8">
                Expertly curated travel experiences by Jessica Seiders. From magical Disney vacations to luxury cruises and family adventures worldwide.
              </p>
              <div className="flex gap-4">
                <a href="https://www.facebook.com/share/1BvCajFoBy/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-secondary hover:text-secondary-foreground transition-all">
                  <Facebook className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h4 className="font-bold mb-6 font-sans uppercase tracking-widest text-xs text-secondary">Quick Links</h4>
              <ul className="space-y-4 font-sans text-sm text-primary-foreground/60">
                <li><a href="#features" className="hover:text-secondary transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-secondary transition-colors">About Jessica</a></li>
                <li><a href={getLoginUrl()} className="hover:text-secondary transition-colors">Client Portal</a></li>
                <li><Link href="/plan" className="hover:text-secondary transition-colors">Plan My Trip</Link></li>
                <li><Link href="/join" className="hover:text-secondary transition-colors">Join Our Team</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold mb-6 font-sans uppercase tracking-widest text-xs text-secondary">Partnerships</h4>
              <ul className="space-y-4 font-sans text-sm text-primary-foreground/60">
                <li><a href="https://www.thenextchaptertravel.com/" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">thenextchaptertravel.com (CEO: Wendy)</a></li>
                <li><a href="https://www.facebook.com/groups/123456789" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">Next Chapter Travel on Facebook</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-sans text-primary-foreground/40">
            <p>© 2026 Next Chapter Travel LLC. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="hover:text-secondary transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-secondary transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
