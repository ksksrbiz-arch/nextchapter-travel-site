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
  MapPin,
  ArrowRight,
  Sparkles,
  Ship,
  Castle,
  Globe,
  TreePalm,
  Mountain,
  Star,
  Users,
  Clock,
  Shield,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DestCategory = "All" | "Disney" | "Cruises" | "Hawaii" | "All-Inclusive" | "Europe" | "Universal";

interface Destination {
  id: number;
  title: string;
  destination: string;
  category: DestCategory[];
  image: string;
  description: string;
  highlights: string[];
  icon: React.ElementType;
  badge?: string;
}

const DESTINATIONS: Destination[] = [
  {
    id: 1,
    title: "Disney World Adventure",
    destination: "Orlando, Florida",
    category: ["Disney"],
    image: "/trips/disney.jpg",
    description:
      "Experience the magic of Disney World with a personalized, day-by-day itinerary. From Genie+ strategy to the best dining reservations — every moment handled.",
    highlights: ["Magic Kingdom", "EPCOT", "Hollywood Studios", "Animal Kingdom"],
    icon: Castle,
    badge: "Most Popular",
  },
  {
    id: 2,
    title: "Royal Caribbean Cruise",
    destination: "Caribbean",
    category: ["Cruises"],
    image: "/trips/royal-caribbean.jpg",
    description:
      "Set sail on a world-class Royal Caribbean cruise. Perfect for families, couples, and groups — with curated itineraries across the Caribbean.",
    highlights: ["Caribbean Ports", "Onboard Activities", "Shore Excursions", "Dining Packages"],
    icon: Ship,
    badge: "Best Value",
  },
  {
    id: 3,
    title: "Hawaiian Islands Getaway",
    destination: "Maui, Hawaii",
    category: ["Hawaii"],
    image: "/trips/maui.jpg",
    description:
      "Relax and unwind in Maui with a custom-crafted family getaway. Stunning beaches, road-to-Hana adventures, and luxury resort stays.",
    highlights: ["Maui Beaches", "Road to Hana", "Snorkeling", "Luaus"],
    icon: TreePalm,
    badge: undefined,
  },
  {
    id: 4,
    title: "Disneyland California",
    destination: "Anaheim, California",
    category: ["Disney"],
    image: "/trips/disney.jpg",
    description:
      "The original Disney park — perfect for first-timers and multi-generational families. Jessica plans your entire Disneyland experience, from park hopping to hotel selection.",
    highlights: ["Disneyland Park", "California Adventure", "Hotel Selection", "Genie+ Planning"],
    icon: Castle,
    badge: undefined,
  },
  {
    id: 5,
    title: "Norwegian Cruise Line",
    destination: "Bahamas & Caribbean",
    category: ["Cruises"],
    image: "/trips/royal-caribbean.jpg",
    description:
      "Explore the Bahamas and Caribbean aboard Norwegian's Freestyle cruising experience. No fixed dining times, breathtaking ports, and onboard thrills.",
    highlights: ["Freestyle Dining", "Bahamas Ports", "Private Island", "Entertainment"],
    icon: Ship,
    badge: undefined,
  },
  {
    id: 6,
    title: "Universal Orlando Resort",
    destination: "Orlando, Florida",
    category: ["Universal"],
    image: "/trips/disney.jpg",
    description:
      "From Harry Potter's Wizarding World to the Jurassic World ride — Universal Orlando is a thrill-seeker's paradise. Jessica handles Express Passes, dining, and lodging.",
    highlights: ["Wizarding World", "Epic Universe", "Express Passes", "CityWalk Dining"],
    icon: Globe,
    badge: "New: Epic Universe",
  },
  {
    id: 7,
    title: "Caribbean All-Inclusive",
    destination: "Cancún & Riviera Maya",
    category: ["All-Inclusive"],
    image: "/trips/maui.jpg",
    description:
      "Escape to a luxury all-inclusive resort in Mexico. Unlimited dining, beachfront pools, and seamless service — nothing to think about except relaxing.",
    highlights: ["Beachfront Resorts", "All Meals Included", "Kids Clubs", "Spa & Activities"],
    icon: TreePalm,
    badge: undefined,
  },
  {
    id: 8,
    title: "European River Cruise",
    destination: "Rhine & Danube Rivers",
    category: ["Europe", "Cruises"],
    image: "/trips/royal-caribbean.jpg",
    description:
      "Drift through the heart of Europe on a scenic river cruise. Medieval castles, world-class vineyards, and cobblestone towns — unforgettable at every bend.",
    highlights: ["Rhine River", "Danube River", "Guided Shore Tours", "Onboard Dining"],
    icon: Mountain,
    badge: undefined,
  },
  {
    id: 9,
    title: "Big Island, Hawaii",
    destination: "Kona & Hilo, Hawaii",
    category: ["Hawaii"],
    image: "/trips/maui.jpg",
    description:
      "Explore Hawaii's most diverse island — from black-sand beaches to active volcanoes. Custom itineraries for adventurers, families, and honeymooners.",
    highlights: ["Volcanoes National Park", "Manta Ray Diving", "Coffee Farms", "Waterfall Hikes"],
    icon: TreePalm,
    badge: undefined,
  },
];

const CATEGORIES: DestCategory[] = ["All", "Disney", "Cruises", "Hawaii", "All-Inclusive", "Universal", "Europe"];

export default function Destinations() {
  const { setVideoContext } = useVideoHero();
  const [activeCategory, setActiveCategory] = useState<DestCategory>("All");
  useScrollReveal();

  useEffect(() => {
    setVideoContext("landing");
  }, [setVideoContext]);

  const filtered =
    activeCategory === "All"
      ? DESTINATIONS
      : DESTINATIONS.filter(d => d.category.includes(activeCategory));

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      <SEOHead
        title="Destinations — Disney, Cruises, Hawaii & More"
        description="Explore hand-picked destinations curated by Jessica Seiders at Next Chapter Travel. Disney, Royal Caribbean, Norwegian Cruise, Hawaii, all-inclusive resorts, and European river cruises."
        canonical="/destinations"
      />

      <SiteNav />

      {/* ── Hero ── */}
      <section className="pt-24 sm:pt-32 md:pt-44 pb-14 sm:pb-20 relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
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
            Hand-Picked by Jessica
          </Badge>
          <h1
            data-reveal
            data-reveal-delay="100"
            className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl font-serif font-bold mb-5 sm:mb-8 tracking-tight hero-text-shadow"
          >
            Dream{" "}
            <span className="text-gradient-gold italic">Destinations</span>
          </h1>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-base sm:text-xl text-muted-foreground/90 mb-8 sm:mb-10 font-sans font-light leading-relaxed max-w-2xl mx-auto"
          >
            From Disney magic to Caribbean cruises to Hawaiian sunsets — every
            destination personally vetted and planned by Jessica Seiders.
          </p>

          {/* Stats */}
          <div
            data-reveal
            data-reveal-delay="300"
            className="flex flex-wrap justify-center gap-4 sm:gap-8 text-sm font-sans text-muted-foreground/80 mb-8"
          >
            <span className="flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-secondary" />
              Free consultation
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-secondary" />
              24-hr proposal turnaround
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-secondary" />
              Certified in every brand
            </span>
          </div>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="py-6 sm:py-10 pb-20 sm:pb-28">
        <div className="container">
          {/* Category filter */}
          <div
            data-reveal
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-14"
          >
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "text-sm font-sans px-4 py-2.5 rounded-full border transition-all active:scale-95",
                  activeCategory === cat
                    ? "bg-secondary text-secondary-foreground border-secondary shadow-lg shadow-secondary/20"
                    : "bg-card/50 backdrop-blur-md border-border/50 text-muted-foreground hover:border-secondary/50 hover:text-secondary"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Destination cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filtered.map((dest, idx) => (
              <div
                key={dest.id}
                data-reveal
                data-reveal-delay={String(((idx % 3) + 1) * 100)}
                className="group gradient-border-gold bg-card/55 backdrop-blur-md rounded-2xl overflow-hidden lift-on-hover flex flex-col"
              >
                <div className="relative h-52 sm:h-64 overflow-hidden">
                  <LazyImage
                    src={dest.image}
                    alt={dest.title}
                    width="800"
                    height="500"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/10 to-transparent" />
                  {dest.badge && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-[10px] sm:text-xs shadow-lg">
                        {dest.badge}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1.5 text-white/90 font-sans text-xs tracking-wide uppercase">
                      <MapPin className="w-3 h-3 text-secondary" />
                      {dest.destination}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7 flex flex-col flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary/10 border border-secondary/20 flex items-center justify-center flex-shrink-0">
                      <dest.icon className="w-4 h-4 text-secondary" />
                    </div>
                    <h3 className="text-lg sm:text-xl font-serif font-bold leading-tight">
                      {dest.title}
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm sm:text-base font-sans mb-4 leading-relaxed flex-1">
                    {dest.description}
                  </p>

                  {/* Highlights */}
                  <div className="flex flex-wrap gap-1.5 mb-5">
                    {dest.highlights.map(h => (
                      <span
                        key={h}
                        className="text-xs font-sans px-2.5 py-1 rounded-full bg-secondary/10 text-secondary border border-secondary/20"
                      >
                        {h}
                      </span>
                    ))}
                  </div>

                  <Link href="/plan-my-trip">
                    <Button className="group/btn w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold rounded-xl">
                      Plan This Trip
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20">
              <p className="text-muted-foreground font-sans text-lg">
                No destinations in this category yet.{" "}
                <button
                  onClick={() => setActiveCategory("All")}
                  className="text-secondary underline"
                >
                  View all
                </button>
              </p>
            </div>
          )}
        </div>
      </section>

      {/* ── Why Book With Jessica ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-0">
          <span className="aurora-blob gold" style={{ width: "30rem", height: "30rem", top: "-8rem", left: "10%", opacity: 0.25 }} />
          <span className="aurora-blob navy" style={{ width: "30rem", height: "30rem", bottom: "-10rem", right: "5%", opacity: 0.4 }} />
        </div>
        <div className="container relative text-center">
          <div className="max-w-3xl mx-auto" data-reveal>
            <Badge className="mb-4 sm:mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-xs tracking-[0.2em] uppercase px-3 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              Your Dream Vacation Awaits
            </Badge>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold mb-4 sm:mb-6 leading-[1.05]">
              Don't See Your Destination?{" "}
              <span className="text-gradient-gold italic">Ask Jessica</span>
            </h2>
            <p className="text-primary-foreground/70 text-base sm:text-lg font-sans leading-relaxed mb-8 sm:mb-10">
              These are just a few of Jessica's specialties. She books virtually
              any destination — from Europe to Asia, Alaska to Africa. Get a
              free proposal and she'll craft the perfect trip for you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Link href="/plan-my-trip" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-7 sm:px-14 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] cta-glow active:scale-95 transition-all"
                >
                  <span>Get My Free Proposal</span>
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white/30 hover:bg-white/10 text-white px-6 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] active:scale-95 transition-all"
                >
                  <Users className="w-5 h-5 mr-2" />
                  Meet Jessica
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-sans text-primary-foreground/60">
              {["Disney Specialist", "Royal Caribbean Expert", "Universal Studios", "Carnival Certified", "Norwegian Cruise Line"].map(cert => (
                <span key={cert} className="flex items-center gap-1.5">
                  <Star className="w-3 h-3 text-secondary fill-secondary" />
                  {cert}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
