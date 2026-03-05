import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { useEffect, useRef, useState } from "react";
import {
  MapPin, MessageSquare, FileText, CheckSquare, Calendar,
  Plane, Shield, Star, ArrowRight, BookOpen, Globe, Users,
  Facebook, Anchor, Ship, Sparkles
} from "lucide-react";

const FEATURES = [
  {
    icon: Calendar,
    title: "Day-by-Day Itinerary",
    desc: "Every moment of your trip organized beautifully, from sunrise excursions to evening dining reservations.",
  },
  {
    icon: FileText,
    title: "Document Vault",
    desc: "Passports, boarding passes, hotel confirmations — all your travel documents secured in one place.",
  },
  {
    icon: Globe,
    title: "Destination Guides",
    desc: "Curated local tips, currency info, emergency contacts, and insider knowledge for every destination.",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    desc: "Reach Jessica instantly with questions, changes, or just to share your excitement before departure.",
  },
  {
    icon: CheckSquare,
    title: "Smart Packing Lists",
    desc: "Never forget a thing. Customized packing checklists organized by category for every trip.",
  },
  {
    icon: Plane,
    title: "Booking Tracker",
    desc: "Real-time status on flights, hotels, tours, and transfers — all your confirmations at a glance.",
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

// Floating destination pins for the interactive globe visual
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

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-square max-w-[480px] mx-auto select-none"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: "800px" }}
    >
      {/* 3D tilt container */}
      <div
        className="relative w-full h-full transition-transform duration-200 ease-out"
        style={{ transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`, transformStyle: "preserve-3d" }}
      >
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full"
          style={{ background: "radial-gradient(circle, oklch(0.72 0.09 65 / 0.15) 0%, transparent 70%)" }} />

        {/* Globe sphere */}
        <div className="absolute inset-[10%] rounded-full overflow-hidden shadow-2xl"
          style={{
            background: "linear-gradient(135deg, oklch(0.22 0.06 240) 0%, oklch(0.32 0.08 220) 40%, oklch(0.28 0.07 250) 100%)",
            boxShadow: "inset -20px -20px 60px oklch(0.14 0.04 240 / 0.8), inset 10px 10px 40px oklch(0.72 0.09 65 / 0.1), 0 20px 80px oklch(0.14 0.04 240 / 0.5)"
          }}>
          {/* Grid lines SVG */}
          <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 200 200">
            {/* Latitude lines */}
            {[30, 50, 70, 90, 110, 130, 150, 170].map(y => (
              <ellipse key={y} cx="100" cy={y} rx="95" ry="8" fill="none" stroke="oklch(0.72 0.09 65)" strokeWidth="0.5" />
            ))}
            {/* Longitude lines */}
            {[0, 22.5, 45, 67.5, 90, 112.5, 135, 157.5].map(angle => (
              <ellipse key={angle} cx="100" cy="100" rx="8" ry="95" fill="none" stroke="oklch(0.72 0.09 65)" strokeWidth="0.5"
                transform={`rotate(${angle} 100 100)`} />
            ))}
          </svg>
          {/* Continent blobs */}
          <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 200 200">
            <ellipse cx="60" cy="80" rx="22" ry="18" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="110" cy="70" rx="30" ry="20" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="130" cy="110" rx="18" ry="14" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="55" cy="120" rx="14" ry="20" fill="oklch(0.55 0.12 155)" />
            <ellipse cx="155" cy="80" rx="10" ry="8" fill="oklch(0.55 0.12 155)" />
          </svg>
          {/* Shine highlight */}
          <div className="absolute top-[8%] left-[15%] w-[35%] h-[35%] rounded-full opacity-20"
            style={{ background: "radial-gradient(circle, white 0%, transparent 70%)" }} />
        </div>

        {/* Orbiting ring */}
        <div className="absolute inset-[5%] rounded-full border border-secondary/20"
          style={{ animation: "spin 20s linear infinite", transformStyle: "preserve-3d", transform: "rotateX(70deg)" }} />

        {/* Destination pins */}
        {DESTINATIONS.map((dest) => (
          <div
            key={dest.label}
            className="absolute z-10 cursor-pointer"
            style={{ top: dest.top, left: dest.left, animationDelay: dest.delay }}
            onMouseEnter={() => setHovered(dest.label)}
            onMouseLeave={() => setHovered(null)}
          >
            <div className="relative">
              {/* Pulse ring */}
              <div className="absolute -inset-2 rounded-full bg-secondary/30 animate-ping" style={{ animationDuration: "2s", animationDelay: dest.delay }} />
              {/* Pin dot */}
              <div className="relative w-7 h-7 rounded-full bg-secondary/90 border-2 border-white/80 flex items-center justify-center shadow-lg text-sm
                hover:scale-125 transition-transform duration-200">
                {dest.emoji}
              </div>
              {/* Tooltip */}
              {hovered === dest.label && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-sans px-2.5 py-1.5 rounded-lg whitespace-nowrap shadow-xl border border-secondary/30 z-20">
                  {dest.label}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-primary" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Center label */}
        <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 text-center">
          <div className="text-secondary font-serif text-xs font-semibold tracking-widest uppercase opacity-80">
            Worldwide
          </div>
        </div>
      </div>

      {/* Floating stat cards */}
      <div className="absolute -bottom-4 -left-4 bg-secondary text-secondary-foreground rounded-xl px-4 py-3 shadow-2xl z-20 animate-float">
        <div className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          <div>
            <div className="text-lg font-serif font-bold leading-none">500+</div>
            <div className="text-xs font-sans opacity-80">Happy Travelers</div>
          </div>
        </div>
      </div>
      <div className="absolute -top-4 -right-4 bg-card text-card-foreground rounded-xl px-4 py-3 shadow-2xl z-20 border border-border animate-float" style={{ animationDelay: "1s" }}>
        <div className="flex gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-secondary text-secondary" />)}
        </div>
        <div className="text-xs font-sans text-muted-foreground">5-Star Rated</div>
      </div>
      <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-primary/90 text-primary-foreground rounded-xl px-3 py-2 shadow-2xl z-20 border border-secondary/20 animate-float" style={{ animationDelay: "0.5s" }}>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-secondary" />
          <div className="text-xs font-sans">8 Destinations</div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { user, isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gradient-to-b from-black/60 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-secondary-foreground" />
          </div>
          <span className="text-white font-serif text-lg font-semibold tracking-wide">
            Next Chapter Travel
          </span>
        </div>
        <div className="flex items-center gap-3">
          {/* Facebook link in nav */}
          <a
            href="https://www.facebook.com/jessica.hoffman.520"
            target="_blank"
            rel="noopener noreferrer"
            className="text-white/70 hover:text-secondary transition-colors"
            title="Jessica on Facebook"
          >
            <Facebook className="w-4 h-4" />
          </a>
          {isAuthenticated ? (
            <Link href={user?.role === "admin" ? "/admin" : "/portal"}>
              <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans">
                My Portal
              </Button>
            </Link>
          ) : (
            <>
              <a href={getLoginUrl()}>
                <Button variant="ghost" size="sm" className="text-white hover:text-white hover:bg-white/20 font-sans">
                  Sign In
                </Button>
              </a>
              <a href={getLoginUrl()}>
                <Button size="sm" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans">
                  Get Started
                </Button>
              </a>
            </>
          )}
        </div>
      </nav>

      {/* Hero — Video Editorial */}
      <section className="relative h-screen min-h-[600px] flex items-center justify-center overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          poster="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1920&q=80"
        >
          <source
            src="https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38aae054b&profile_id=165"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 video-overlay" />
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <Badge className="mb-6 bg-secondary/90 text-secondary-foreground border-0 font-sans text-xs tracking-widest uppercase px-4 py-1.5">
            Partner of Next Chapter Travel
          </Badge>
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight opacity-0 animate-fade-in-up">
            Your Journey,
            <br />
            <span className="italic text-secondary">Perfectly Planned</span>
          </h1>
          <p className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-sans font-light leading-relaxed opacity-0 animate-fade-in-up animate-delay-200">
            Owner & CEO of Next Chapter Travel LLC — Jessica Seiders is your certified travel professional
            specializing in Disney, cruises, family adventures, and beyond. Everything you need, beautifully organized.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center opacity-0 animate-fade-in-up animate-delay-300">
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans px-8 py-6 text-base">
                Access Your Trip Portal
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
            <a href="#about">
              <Button variant="outline" size="lg" className="border-white/60 text-white hover:bg-white/10 font-sans px-8 py-6 text-base bg-transparent">
                Meet Jessica
              </Button>
            </a>
          </div>
        </div>
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/60">
          <div className="w-px h-12 bg-gradient-to-b from-white/60 to-transparent animate-pulse" />
        </div>
      </section>

      {/* About Jessica — with Interactive Globe */}
      <section id="about" className="py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div>
              <Badge className="mb-4 bg-secondary/20 text-secondary border-secondary/30 font-sans text-xs tracking-widest uppercase">
                Your Travel Advisor
              </Badge>
              <h2 className="text-4xl md:text-5xl font-serif font-bold mb-6 leading-tight">
                Meet Jessica Seiders
              </h2>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-6 font-sans">
                Jessica Seiders is the Owner, Manager, and CEO of{" "}
                <span className="text-secondary font-medium">Next Chapter Travel LLC</span> — a Portland,
                Oregon-based travel agency dedicated to planning every kind of vacation with precision and
                heart. A certified Disney specialist with deep expertise across Universal, Norwegian Cruise
                Line, Royal Caribbean, Carnival Cruises, Expedia, and Viator, Jessica can plan virtually
                any travel experience you can dream of.
              </p>
              <p className="text-primary-foreground/80 text-lg leading-relaxed mb-8 font-sans">
                With a background that spans healthcare (former ER Tech at Providence Health Systems) and
                entrepreneurship, Jessica brings a rare combination of calm-under-pressure and meticulous
                planning to every trip. She believes every traveler deserves a seamless, stress-free
                experience — and this portal is how she delivers it.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                {["Disney Specialist", "Universal Studios", "Norwegian Cruise Line", "Royal Caribbean", "Carnival Cruises", "Family Travel"].map((tag) => (
                  <Badge key={tag} className="bg-secondary/20 text-secondary border-secondary/30 font-sans">
                    {tag}
                  </Badge>
                ))}
              </div>
              {/* Facebook social link */}
              <a
                href="https://www.facebook.com/jessica.hoffman.520"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-secondary/10 hover:bg-secondary/20 border border-secondary/30 text-secondary rounded-xl px-5 py-3 font-sans text-sm font-medium transition-all duration-200 hover:scale-105"
              >
                <Facebook className="w-4 h-4" />
                Connect with Jessica on Facebook
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </a>
            </div>

            {/* Interactive Globe */}
            <div className="flex items-center justify-center py-8">
              <InteractiveGlobe />
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-24 bg-background">
        <div className="container">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Everything You Need
            </Badge>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              Your Complete Trip Companion
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto font-sans">
              From planning to landing back home, every feature you need is built right in.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-2xl border border-border bg-card hover:border-secondary/40 hover:shadow-lg transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center mb-5 group-hover:bg-secondary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground font-sans leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-accent/30">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg font-sans">
              Three simple steps to your perfect vacation
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-px bg-secondary/30" />
            {[
              { step: "01", title: "Book With Jessica", desc: "Connect with Jessica to plan your dream trip. She handles all the details, bookings, and logistics.", icon: MessageSquare },
              { step: "02", title: "Get Your Portal", desc: "Receive access to your personalized travel portal with your complete itinerary and documents.", icon: Shield },
              { step: "03", title: "Travel With Confidence", desc: "Everything you need is in your pocket. Enjoy your trip knowing Jessica is just a message away.", icon: MapPin },
            ].map((step) => (
              <div key={step.step} className="text-center relative">
                <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mx-auto mb-6 relative z-10">
                  <step.icon className="w-7 h-7 text-primary-foreground" />
                </div>
                <div className="text-secondary font-serif text-5xl font-bold mb-3 opacity-20">{step.step}</div>
                <h3 className="text-xl font-serif font-semibold text-foreground mb-3">{step.title}</h3>
                <p className="text-muted-foreground font-sans leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold mb-4">What Travelers Say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-primary-foreground/5 border border-primary-foreground/10 rounded-2xl p-8">
                <div className="flex gap-1 mb-4">
                  {[...Array(t.rating)].map((_, i) => <Star key={i} className="w-4 h-4 fill-secondary text-secondary" />)}
                </div>
                <p className="text-primary-foreground/80 font-sans leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <div className="font-serif font-semibold">{t.name}</div>
                  <div className="text-secondary text-sm font-sans flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {t.destination}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-background">
        <div className="container text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-foreground mb-6">
              Ready to Start Your
              <span className="text-secondary italic"> Next Chapter?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10 font-sans leading-relaxed">
              Certified in Disney, Universal, Norwegian Cruise Line, Royal Caribbean, Carnival, and more —
              Jessica Seiders at Next Chapter Travel LLC has the expertise to plan any adventure you can imagine.
            </p>
            <a href={getLoginUrl()}>
              <Button size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans px-10 py-6 text-base">
                Access Your Travel Portal
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center">
                  <BookOpen className="w-3.5 h-3.5 text-secondary-foreground" />
                </div>
                <span className="font-serif text-lg font-semibold">Next Chapter Travel</span>
              </div>
              <p className="text-primary-foreground/60 text-sm font-sans leading-relaxed mb-4">
                Jessica Seiders — Owner & CEO, bringing certified expertise and personal warmth
                to every trip she plans.
              </p>
              {/* Social links in footer */}
              <a
                href="https://www.facebook.com/jessica.hoffman.520"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-primary-foreground/50 hover:text-secondary transition-colors text-sm font-sans"
              >
                <Facebook className="w-4 h-4" />
                Follow on Facebook
              </a>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm font-sans text-primary-foreground/60">
                <li><a href="#features" className="hover:text-secondary transition-colors">Features</a></li>
                <li><a href="#about" className="hover:text-secondary transition-colors">About Jessica</a></li>
                <li><a href={getLoginUrl()} className="hover:text-secondary transition-colors">Client Portal</a></li>
                <li><a href="https://nextchaptertravel.com" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">Next Chapter Travel</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-serif font-semibold mb-4">Contact Jessica</h4>
              <ul className="space-y-2 text-sm font-sans text-primary-foreground/60">
                <li>Portland, Oregon</li>
                <li>Owner &amp; CEO — Next Chapter Travel LLC</li>
                <li>Disney · Universal · Royal Caribbean · Carnival</li>
                <li className="pt-1">
                  <a
                    href="https://www.facebook.com/jessica.hoffman.520"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 hover:text-secondary transition-colors"
                  >
                    <Facebook className="w-3.5 h-3.5" />
                    facebook.com/jessica.hoffman.520
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-primary-foreground/40 text-sm font-sans">
              © 2026 Next Chapter Travel LLC — Jessica Seiders. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-primary-foreground/40 text-sm font-sans">
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5" />
                <span>Secure & Private</span>
              </div>
              <a
                href="https://www.facebook.com/jessica.hoffman.520"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
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
