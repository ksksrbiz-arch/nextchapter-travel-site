import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import LazyImage from "@/components/LazyImage";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Heart,
  Star,
  Award,
  Globe,
  Ship,
  Castle,
  ArrowRight,
  Facebook,
  Instagram,
  Quote,
  CheckCircle,
  Sparkles,
  MapPin,
  Phone,
  Mail,
  Users,
  Plane,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const CERTIFICATIONS = [
  { icon: Castle, label: "Disney Specialist", desc: "Certified in planning Disney World, Disneyland, and Disney Cruise Line vacations." },
  { icon: Ship, label: "Royal Caribbean Expert", desc: "Expert knowledge of Royal Caribbean's fleet, itineraries, and exclusive perks." },
  { icon: Globe, label: "Universal Specialist", desc: "Insider expertise for Universal Orlando and Universal Hollywood vacations." },
  { icon: Award, label: "Certified Travel Advisor", desc: "Professionally accredited travel advisor with a decade of hands-on experience." },
  { icon: Ship, label: "Norwegian Cruise Line", desc: "Certified in Norwegian Cruise Line bookings, cabin selection, and packages." },
  { icon: Ship, label: "Carnival Certified", desc: "Certified Carnival Cruise Line specialist for family and group sailings." },
];

const JESSICA_PHOTOS = [
  { src: "/jesshero3.jpeg", alt: "Jessica Seiders — Your Travel Expert" },
  { src: "/jesshero.jpeg", alt: "Jessica planning a trip" },
  { src: "/jesshero2.jpeg", alt: "Jessica with happy clients" },
  { src: "/jesshero_01.jpeg", alt: "Jessica at a destination" },
];

const WHY_CHOOSE = [
  {
    icon: Heart,
    title: "Personalized Planning",
    desc: "Every trip is hand-crafted to match your family, budget, and wish list — no cookie-cutter packages.",
  },
  {
    icon: Shield,
    title: "Completely Free",
    desc: "Jessica's planning services cost you nothing. She earns through supplier commissions, so you pay the same price as booking direct — or less.",
  },
  {
    icon: Phone,
    title: "Always On Call",
    desc: "Flight delayed? Jessica is in your corner. Real-time help during your trip, not just before it.",
  },
  {
    icon: Plane,
    title: "Expert Connections",
    desc: "Certified relationships with Disney, Royal Caribbean, Norwegian, Universal, and dozens of resort brands.",
  },
  {
    icon: Users,
    title: "Family-First Approach",
    desc: "Families are her specialty. She understands kid schedules, picky eaters, nap times, and mobility needs.",
  },
  {
    icon: Star,
    title: "5-Star Results",
    desc: "Hundreds of trips, dozens of five-star reviews. Your dream vacation is more than a job — it's her passion.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "I am late leaving this review, but life is busy. I would recommend Jessica 1000%. She helped me with anything and everything I needed, no matter my budget, answered my questions, and was so super helpful during my trip! I will forever be grateful.",
    name: "Jamie Hardesty",
    trip: "January 2024",
  },
  {
    quote:
      "Jessica was fantastic to work with. She was so helpful. We'll definitely work together again in the future.",
    name: "Brandy Cheville Bouldin",
    trip: "September 2022",
  },
  {
    quote:
      "Five, definitely. You did an amazing job explaining everything. We got a great deal. We had an amazing time.",
    name: "Poppy Wilson",
    trip: "Portland, Oregon",
  },
];

export default function About() {
  const { setVideoContext } = useVideoHero();
  const [activePhotoIndex, setActivePhotoIndex] = useState(0);
  useScrollReveal();

  useEffect(() => {
    setVideoContext("landing");
  }, [setVideoContext]);

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      <SEOHead
        title="About Jessica Seiders — Your Personal Travel Advisor"
        description="Meet Jessica Seiders, founder of Next Chapter Travel LLC. Certified Disney, Royal Caribbean, Universal, and cruise specialist. Free personalized trip planning."
        canonical="/about"
        includeLocalBusiness
      />

      <SiteNav />

      {/* ── Hero ── */}
      <section className="pt-24 sm:pt-32 md:pt-44 pb-14 sm:pb-24 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
          <span className="aurora-blob gold" style={{ width: "44rem", height: "44rem", top: "-12rem", left: "-10rem" }} />
          <span className="aurora-blob navy" style={{ width: "40rem", height: "40rem", top: "-6rem", right: "-12rem" }} />
        </div>
        <div className="container">
          <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-start">
            {/* Text */}
            <div className="order-last md:order-first" data-reveal>
              <Badge className="mb-4 sm:mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-[10px] sm:text-xs tracking-[0.18em] uppercase inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md">
                <Sparkles className="w-3 h-3" />
                Meet Your Travel Expert
              </Badge>
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-3 sm:mb-4 leading-[1.05] tracking-tight hero-text-shadow">
                Jessica{" "}
                <span className="text-gradient-gold italic">Seiders</span>
              </h1>
              <p className="text-secondary font-sans font-semibold text-lg sm:text-xl mb-6">
                Founder & Certified Travel Advisor
              </p>

              <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                {CERTIFICATIONS.slice(0, 4).map(cert => (
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
                  <Button className="w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg font-sans font-bold rounded-xl min-h-[56px] active:scale-[0.98] transition-transform cta-glow">
                    Start Planning With Me
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/destinations">
                  <Button
                    variant="outline"
                    className="w-full sm:w-auto border-secondary/30 hover:bg-secondary/10 px-8 py-6 text-lg font-sans font-bold rounded-xl min-h-[56px] active:scale-[0.98] transition-transform"
                  >
                    Browse Destinations
                  </Button>
                </Link>
              </div>

              <div className="mt-8 sm:mt-10 pt-6 sm:pt-8 border-t border-border">
                <p className="text-sm font-sans text-muted-foreground mb-4">
                  Connect with Jessica:
                </p>
                <div className="flex flex-wrap gap-4">
                  <a
                    href="https://www.facebook.com/nextchaptertravel"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors bg-secondary/10 px-4 py-3 rounded-xl min-h-[48px] active:scale-[0.98]"
                  >
                    <Facebook className="w-5 h-5" />
                    <span className="font-sans font-semibold">Facebook</span>
                  </a>
                  <a
                    href="https://www.instagram.com/nextchaptertravelllc"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors bg-secondary/10 px-4 py-3 rounded-xl min-h-[48px] active:scale-[0.98]"
                  >
                    <Instagram className="w-5 h-5" />
                    <span className="font-sans font-semibold">Instagram</span>
                  </a>
                  <a
                    href="/plan-my-trip"
                    className="inline-flex items-center gap-2 text-secondary hover:text-secondary/80 transition-colors bg-secondary/10 px-4 py-3 rounded-xl min-h-[48px] active:scale-[0.98]"
                  >
                    <Mail className="w-5 h-5" />
                    <span className="font-sans font-semibold">Plan My Trip</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Photo gallery */}
            <div className="flex flex-col items-center py-4 sm:py-8 order-first md:order-last" data-reveal data-reveal-delay="100">
              <div className="relative w-full max-w-[420px] md:max-w-[500px] mx-auto">
                <div className="ring-glow relative rounded-2xl overflow-hidden border-2 border-secondary/40 shadow-2xl mb-4">
                  <LazyImage
                    src={JESSICA_PHOTOS[activePhotoIndex].src}
                    alt={JESSICA_PHOTOS[activePhotoIndex].alt}
                    className="w-full h-auto object-contain transition-opacity duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/55 via-primary/10 to-transparent" />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground px-5 py-2 rounded-xl shadow-xl font-serif font-bold text-sm sm:text-base whitespace-nowrap">
                    Jessica Seiders
                  </div>
                </div>
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 snap-x snap-mandatory scrollbar-hide">
                  {JESSICA_PHOTOS.map((photo, idx) => (
                    <button
                      key={photo.src}
                      onClick={() => setActivePhotoIndex(idx)}
                      className={cn(
                        "relative flex-shrink-0 w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden border-2 transition-all duration-200 snap-center active:scale-95",
                        activePhotoIndex === idx
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

      {/* ── Stats strip ── */}
      <section className="py-10 sm:py-14 border-y border-border/40 bg-black/30 backdrop-blur-sm">
        <div className="container">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-3xl mx-auto">
            {[
              { value: "50+", label: "Families Served", icon: Users },
              { value: "100+", label: "Trips Planned", icon: Plane },
              { value: "5★", label: "Average Rating", icon: Star },
              { value: "Free", label: "Consultation", icon: Shield },
            ].map(stat => (
              <div
                key={stat.label}
                data-reveal
                className="gradient-border-gold bg-card/45 backdrop-blur-md rounded-2xl px-3 py-5 sm:px-4 sm:py-6 flex flex-col items-center gap-1.5 text-center hover:bg-card/65 transition-all group lift-on-hover"
              >
                <stat.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary mb-0.5 sm:mb-1 group-hover:scale-110 transition-transform" />
                <p className="text-2xl sm:text-3xl font-serif font-bold text-gradient-gold leading-none">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs text-muted-foreground font-sans leading-tight tracking-wide">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Jessica ── */}
      <section className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Why Choose Jessica
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              More Than Just a{" "}
              <span className="text-gradient-gold italic">Travel Agent</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              A true concierge — from the first email through the moment you're
              home.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {WHY_CHOOSE.map((item, idx) => (
              <div
                key={item.title}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="gradient-border-gold bg-card/55 backdrop-blur-md p-6 sm:p-8 rounded-2xl lift-on-hover"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4 sm:mb-6 shadow-lg">
                  <item.icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Certifications ── */}
      <section className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Credentials
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Certified in the{" "}
              <span className="text-gradient-gold italic">Brands You Love</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Jessica holds formal certifications from the world's top travel brands,
              giving you access to insider knowledge, exclusive rates, and VIP
              perks.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {CERTIFICATIONS.map((cert, idx) => (
              <div
                key={cert.label}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="gradient-border-gold bg-card/55 backdrop-blur-md p-5 sm:p-6 rounded-2xl flex items-start gap-4 lift-on-hover"
              >
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center shrink-0 shadow-lg">
                  <cert.icon className="w-5 h-5 sm:w-6 sm:h-6 text-secondary" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1">
                    {cert.label}
                  </h3>
                  <p className="text-muted-foreground text-sm font-sans leading-relaxed">
                    {cert.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="py-16 sm:py-24 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <span className="aurora-blob gold" style={{ width: "30rem", height: "30rem", top: "-6rem", right: "-6rem", opacity: 0.35 }} />
        </div>
        <div className="container relative">
          <div className="text-center mb-10 sm:mb-14" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Client Voices
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              What Clients Say About{" "}
              <span className="text-gradient-gold italic">Jessica</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={t.name}
                data-reveal
                data-reveal-delay={String((idx + 1) * 100)}
                className="gradient-border-gold relative bg-card/65 backdrop-blur-md rounded-2xl p-6 sm:p-7 shadow-xl shadow-black/20 flex flex-col gap-4 lift-on-hover"
              >
                <Quote
                  className="absolute -top-3 -left-1 w-12 h-12 text-secondary/25 fill-secondary/15 rotate-180"
                  aria-hidden
                />
                <div className="flex gap-1 relative">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-secondary fill-secondary" />
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
                    <p className="font-semibold font-sans text-foreground text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground font-sans">{t.trip}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
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
              Let's Start Planning
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 sm:mb-8 leading-[1.05]">
              Ready to Start Your{" "}
              <span className="text-gradient-gold italic">Next Chapter?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 font-sans leading-relaxed">
              A free consultation is just one click away. Tell Jessica about your
              dream vacation and receive a personalized proposal within 24 hours.
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
              <Link href="/destinations" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-6 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] active:scale-95 transition-all"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Browse Destinations
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex items-center justify-center gap-6 text-sm font-sans text-muted-foreground/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-secondary" />
                100% free
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-secondary" />
                No obligation
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-secondary" />
                Reply in 24 hrs
              </span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
