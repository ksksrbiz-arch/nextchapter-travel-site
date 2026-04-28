import { useEffect } from "react";
import { Link } from "wouter";
import { useVideoHero } from "@/contexts/VideoHeroContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SEOHead } from "@/components/SEOHead";
import SiteNav from "@/components/SiteNav";
import SiteFooter from "@/components/SiteFooter";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import {
  Calendar,
  FileText,
  Globe,
  MessageSquare,
  CheckSquare,
  Plane,
  Shield,
  Star,
  ArrowRight,
  Sparkles,
  CheckCircle,
  Clock,
  Users,
  Route,
  CreditCard,
  Umbrella,
  Phone,
  Zap,
  Headphones,
} from "lucide-react";

const PORTAL_FEATURES = [
  {
    icon: Calendar,
    title: "Day-by-Day Itinerary",
    desc: "Every moment of your trip organized beautifully — sunrise excursions to evening dining, with offline access.",
    example: "Day 2: Magic Kingdom — 9:00 Genie+ lane, 1:00 Skipper Canteen, 7:30 fireworks.",
    color: "bg-blue-500/15 text-blue-400 border-blue-500/20",
  },
  {
    icon: FileText,
    title: "Secure Document Vault",
    desc: "Passports, boarding passes, hotel confirmations — everything locked and accessible offline.",
    example: "Boarding passes, cruise set-sail pass, airport transfer voucher — all in one place.",
    color: "bg-green-500/15 text-green-400 border-green-500/20",
  },
  {
    icon: Globe,
    title: "Destination Guides",
    desc: "Curated local tips, currency info, emergency contacts, and insider knowledge for every stop.",
    example: "Oahu: reef-safe sunscreen spots, kid-friendly shave ice, 24/7 urgent care numbers.",
    color: "bg-teal-500/15 text-teal-400 border-teal-500/20",
  },
  {
    icon: MessageSquare,
    title: "Direct Messaging",
    desc: "Reach Jessica instantly. Changes, questions, or just sharing your excitement before departure.",
    example: `"Flight delayed" → Jessica rebooks transfers and pushes new pickup time to your portal.`,
    color: "bg-purple-500/15 text-purple-400 border-purple-500/20",
  },
  {
    icon: CheckSquare,
    title: "Smart Packing Lists",
    desc: "Customized packing checklists by category — never forget a thing again.",
    example: "Cruise carry-on: passports, swimsuits, chargers, motion bands, reef-safe sunscreen.",
    color: "bg-amber-500/15 text-amber-400 border-amber-500/20",
  },
  {
    icon: Plane,
    title: "Booking Tracker",
    desc: "Real-time status on flights, hotels, tours, and transfers — all confirmations at a glance.",
    example: "Flight UA1183 — gate C14, seats 18A/18B, hotel check-in 3pm, driver WhatsApp link.",
    color: "bg-indigo-500/15 text-indigo-400 border-indigo-500/20",
  },
  {
    icon: Route,
    title: "Live Itinerary Updates",
    desc: "Jessica can push real-time changes to your portal — gate changes, reservation updates, surprises.",
    example: "Hurricane reroute → updated port schedule and excursion options appear instantly.",
    color: "bg-sky-500/15 text-sky-400 border-sky-500/20",
  },
  {
    icon: CreditCard,
    title: "Budget Tracker",
    desc: "Track your spending against your trip budget in real time.",
    example: "Day 3: $48 dining, $25 souvenirs — on track with $320 remaining.",
    color: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  },
  {
    icon: Umbrella,
    title: "Travel Insurance Tracking",
    desc: "Insurance documents, policy details, and claim contact numbers — always on hand.",
    example: "Policy #XZ-8823, 24/7 claim line: +1-800-555-0100.",
    color: "bg-rose-500/15 text-rose-400 border-rose-500/20",
  },
];

const SERVICES = [
  {
    icon: Sparkles,
    title: "Free Trip Planning",
    desc: "No fees, ever. Jessica earns through supplier commissions so your planning service is completely free.",
    highlight: true,
  },
  {
    icon: Phone,
    title: "Personal Consultation",
    desc: "Start with a free 15-minute call or a 3-minute questionnaire. Jessica learns what you love before building your proposal.",
    highlight: false,
  },
  {
    icon: Zap,
    title: "24-Hour Proposal",
    desc: "Submit your questionnaire today, get a detailed, personalized travel proposal within 24 hours.",
    highlight: false,
  },
  {
    icon: Users,
    title: "Group & Family Travel",
    desc: "Planning for large groups, multi-generation families, and destination weddings — a specialty.",
    highlight: false,
  },
  {
    icon: Shield,
    title: "Booking Protection",
    desc: "Jessica monitors your bookings for price drops, schedule changes, and issues — so you don't have to.",
    highlight: false,
  },
  {
    icon: Headphones,
    title: "On-Trip Support",
    desc: "Something goes wrong? Jessica is reachable during your trip for real-time rebooking and problem-solving.",
    highlight: false,
  },
];

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Book Your Free Consultation",
    desc: "Complete a 3-minute questionnaire or schedule a 15-minute call. Tell Jessica your dates, travelers, wish list, and budget.",
  },
  {
    step: "02",
    title: "Receive Your Proposal",
    desc: "Within 24 hours, Jessica sends a tailored travel proposal with options, pricing, and recommendations personalized to you.",
  },
  {
    step: "03",
    title: "Approve & Get Your Portal",
    desc: "Approve the plan, and Jessica handles every booking. You get access to your personal client portal immediately.",
  },
  {
    step: "04",
    title: "Travel With Confidence",
    desc: "Your portal has everything — itinerary, documents, guides, messaging. Jessica stays on call throughout your trip.",
  },
];

export default function Services() {
  const { setVideoContext } = useVideoHero();
  useScrollReveal();

  useEffect(() => {
    setVideoContext("landing");
  }, [setVideoContext]);

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      <SEOHead
        title="Services — Free Travel Planning & Client Portal"
        description="Jessica Seiders offers completely free vacation planning — Disney, cruises, all-inclusive resorts, and more. Every client gets a personal travel portal with itinerary, documents, and 24/7 support."
        canonical="/services"
      />

      <SiteNav />

      {/* ── Hero ── */}
      <section className="pt-24 sm:pt-32 md:pt-44 pb-14 sm:pb-24 relative overflow-hidden">
        <div aria-hidden={true} className="pointer-events-none absolute inset-0 -z-10">
          <span className="aurora-blob gold" style={{ width: "44rem", height: "44rem", top: "-12rem", left: "-10rem" }} />
          <span className="aurora-blob navy" style={{ width: "40rem", height: "40rem", top: "-6rem", right: "-12rem" }} />
          <span className="aurora-blob cream" style={{ width: "32rem", height: "32rem", bottom: "-10rem", left: "30%" }} />
        </div>
        <div className="container text-center">
          <Badge
            data-reveal
            className="mb-4 sm:mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-[10px] sm:text-xs tracking-[0.18em] uppercase inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md"
          >
            <Sparkles className="w-3 h-3" />
            Everything Included
          </Badge>
          <h1
            data-reveal
            data-reveal-delay="100"
            className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl font-serif font-bold mb-5 sm:mb-8 tracking-tight heading-glow"
          >
            Travel Planning{" "}
            <span className="text-gradient-gold italic">Made Simple</span>
          </h1>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-base sm:text-xl text-muted-foreground/90 mb-8 sm:mb-12 font-sans font-light leading-relaxed max-w-2xl mx-auto"
          >
            Jessica handles every detail — from your first question to the moment
            you're back home. Completely free.
          </p>
          <div
            data-reveal
            data-reveal-delay="300"
            className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-5"
          >
            <Link href="/plan-my-trip" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-7 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] btn-shimmer cta-glow active:scale-95 transition-all"
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
                Browse Destinations
              </Button>
            </Link>
          </div>
          <p
            data-reveal
            data-reveal-delay="400"
            className="mt-5 sm:mt-7 text-xs sm:text-sm font-sans text-muted-foreground/80 inline-flex items-center justify-center gap-2 flex-wrap"
          >
            <Shield className="w-4 h-4 text-secondary" />
            <span>100% free planning</span>
            <span className="opacity-40">·</span>
            <Clock className="w-4 h-4 text-secondary" />
            <span>Personal proposal in 24 hours</span>
            <span className="opacity-40">·</span>
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span>Zero obligation</span>
          </p>
        </div>
      </section>

      {/* ── Services ── */}
      <section className="py-16 sm:py-24 bg-black/40 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              What You Get
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Full-Service Travel{" "}
              <span className="text-gradient-gold italic">Concierge</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              From the first conversation to the final boarding call — and
              everything in between.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {SERVICES.map((service, idx) => (
              <div
                key={service.title}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className={`gradient-border-gold card-accent-gold bg-card/55 backdrop-blur-md p-6 sm:p-8 rounded-2xl lift-on-hover tilt-card ${service.highlight ? "ring-2 ring-secondary/40 ring-offset-2 ring-offset-background" : ""}`}
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4 sm:mb-6">
                  <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-secondary" />
                </div>
                {service.highlight && (
                  <Badge className="mb-3 bg-secondary/15 text-secondary border-secondary/30 font-sans text-[10px] tracking-widest uppercase">
                    Always Free
                  </Badge>
                )}
                <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                  {service.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div aria-hidden={true} className="pointer-events-none absolute inset-0">
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
              Four simple steps from idea to vacation
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 relative">
            {/* Connector line for large screens */}
            <div className="hidden lg:block absolute top-10 left-[12%] right-[12%] h-[2px] overflow-hidden" aria-hidden={true}>
              <div className="h-full bg-gradient-to-r from-secondary/20 via-secondary/60 to-secondary/20 connector-line-animated" data-connector />
            </div>

            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={i}
                data-reveal
                data-reveal-delay={String((i + 1) * 150)}
                className="relative text-center group"
              >
                <div className="relative mx-auto mb-5 sm:mb-6 w-20 h-20">
                  <div className="absolute inset-0 rounded-full bg-secondary/20 scale-110 opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-500" />
                  <div className="relative w-full h-full rounded-full flex flex-col items-center justify-center bg-gradient-to-br from-secondary via-secondary/90 to-secondary/70 text-secondary-foreground shadow-[0_0_30px_-4px_oklch(0.72_0.09_65/0.6)] group-hover:scale-110 transition-transform z-10">
                    <span className="text-xl font-serif font-black">{item.step}</span>
                  </div>
                </div>
                <h3 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4">{item.title}</h3>
                <p className="text-primary-foreground/75 text-sm sm:text-base leading-relaxed font-sans max-w-[260px] mx-auto">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>

          <div className="text-center mt-14 sm:mt-20">
            <Link href="/plan-my-trip">
              <Button
                size="lg"
                className="group bg-secondary text-secondary-foreground hover:bg-secondary/90 px-10 py-6 text-lg font-sans font-bold rounded-2xl min-h-[56px] btn-shimmer cta-glow active:scale-95 transition-all"
              >
                <span>Start Step One — It's Free</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Client Portal Features ── */}
      <section className="py-16 sm:py-24 dot-grid-bg relative">
        <div className="container">
          <div className="text-center mb-10 sm:mb-16" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Your Client Portal
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Everything arrives together{" "}
              <span className="text-gradient-gold italic">once you book</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Your personal portal ties booking to delivery — itinerary, documents,
              messaging, packing lists, guides, and live updates.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
            {PORTAL_FEATURES.map((feature, idx) => (
              <div
                key={feature.title}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="gradient-border-gold card-accent-gold bg-card/55 backdrop-blur-md p-5 sm:p-6 rounded-2xl flex items-start gap-4 lift-on-hover tilt-card group"
              >
                <div
                  className={`w-11 h-11 sm:w-12 sm:h-12 rounded-xl ${feature.color} border flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 transition-transform`}
                >
                  <feature.icon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm font-sans leading-relaxed mb-3">
                    {feature.desc}
                  </p>
                  <div className="text-xs text-secondary font-sans inline-flex items-start gap-2 bg-secondary/10 px-3 py-2 rounded-xl border border-secondary/20">
                    <Sparkles className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    <span>{feature.example}</span>
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
        <div aria-hidden={true} className="pointer-events-none absolute inset-0">
          <span className="aurora-blob gold" style={{ width: "36rem", height: "36rem", top: "-8rem", left: "10%" }} />
          <span className="aurora-blob navy" style={{ width: "32rem", height: "32rem", bottom: "-10rem", right: "10%", opacity: 0.4 }} />
        </div>
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto" data-reveal>
            <Badge className="mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-xs tracking-[0.2em] uppercase px-3 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              Your Dream Vacation Awaits
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 sm:mb-8 leading-[1.05]">
              Ready to Start Your{" "}
              <span className="text-gradient-gold italic">Next Chapter?</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 font-sans leading-relaxed">
              A free consultation takes 3 minutes. A personalized proposal
              arrives within 24 hours. Your dream vacation starts now.
            </p>
            <Link href="/plan-my-trip">
              <Button
                size="lg"
                className="group bg-secondary text-secondary-foreground hover:bg-secondary/90 px-14 py-8 text-xl font-sans font-bold rounded-2xl min-h-[56px] btn-shimmer cta-glow active:scale-95 transition-all"
              >
                <span>Get My Free Proposal</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-sans text-muted-foreground/80">
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
                Reply within 24 hrs
              </span>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
