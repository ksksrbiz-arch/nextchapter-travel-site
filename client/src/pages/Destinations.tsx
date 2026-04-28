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
  Home,
  Car,
  Music,
  Ticket,
  Tag,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DestCategory =
  | "All"
  | "Disney"
  | "Cruises"
  | "Hawaii"
  | "All-Inclusive"
  | "Europe"
  | "Universal"
  | "Airbnb & Stays"
  | "Road Trips"
  | "Events"
  | "Amusement Parks";

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

// High-quality stock photos sourced from Unsplash's CDN (same pattern used in
// VideoHeroContext, MemoryGallery, and RebookingRecommendations).
const UNSPLASH = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1200&q=70&auto=format&fit=crop`;

const DESTINATIONS: Destination[] = [
  {
    id: 1,
    title: "Disney World Adventure",
    destination: "Orlando, Florida",
    category: ["Disney"],
    image: UNSPLASH("1499678329028-101435549a4e"),
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
    image: UNSPLASH("1548574505-5e239809ee19"),
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
    image: UNSPLASH("1500534314209-a25ddb2bd429"),
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
    image: UNSPLASH("1556388158-158ea5ccacbd"),
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
    image: UNSPLASH("1507525428034-b723cf961d3e"),
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
    image: UNSPLASH("1555396273-367ea4eb4db5"),
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
    image: UNSPLASH("1506905925346-21bda4d32df4"),
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
    image: UNSPLASH("1540541338287-41700207dee6"),
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
    image: UNSPLASH("1469854523086-cc02fe5d8800"),
    description:
      "Explore Hawaii's most diverse island — from black-sand beaches to active volcanoes. Custom itineraries for adventurers, families, and honeymooners.",
    highlights: ["Volcanoes National Park", "Manta Ray Diving", "Coffee Farms", "Waterfall Hikes"],
    icon: TreePalm,
    badge: undefined,
  },
  {
    id: 10,
    title: "Unique Airbnb Getaway",
    destination: "Anywhere You Dream",
    category: ["Airbnb & Stays"],
    image: UNSPLASH("1548036328-c9fa89d128fa"),
    description:
      "Treehouses, beachfront cottages, mountain cabins, vineyard estates — Jessica searches every platform to find the most unique, best-priced stays that hotels simply can't match.",
    highlights: ["Treehouses & Cabins", "Beachfront Cottages", "Price Comparison", "Unique Properties"],
    icon: Home,
    badge: "Hidden Gems",
  },
  {
    id: 11,
    title: "Road Trip Adventure",
    destination: "Across the USA",
    category: ["Road Trips"],
    image: UNSPLASH("1487621167305-5d248087c724"),
    description:
      "Hit the open road with a fully planned route — curated stops, lodging along the way, and insider tips for every mile. Whether it's Route 66 or the Pacific Coast Highway, Jessica maps it all.",
    highlights: ["Route Planning", "Lodging Along the Way", "Local Food Spots", "National Parks"],
    icon: Car,
    badge: undefined,
  },
  {
    id: 12,
    title: "Van Life Experience",
    destination: "Custom Route",
    category: ["Road Trips"],
    image: UNSPLASH("1464822759023-fed622ff2c3b"),
    description:
      "Ready to live the van life dream? Jessica plans your freedom-on-wheels adventure — van-friendly campgrounds, scenic routes, budget management, and must-see stops coast to coast.",
    highlights: ["Van-Friendly Camps", "Scenic Routes", "Budget Planning", "Off-Grid Spots"],
    icon: Car,
    badge: "Adventure",
  },
  {
    id: 13,
    title: "Live Concerts & Music Festivals",
    destination: "Nationwide & International",
    category: ["Events"],
    image: UNSPLASH("1521791136064-7986c2920216"),
    description:
      "Turn your favorite concert or festival into a full vacation experience. Jessica handles tickets, travel, hotel, and every detail — you just show up and enjoy the show.",
    highlights: ["Concert Tickets", "Festival Passes", "Hotel Packages", "VIP Upgrades"],
    icon: Music,
    badge: "Full Package",
  },
  {
    id: 14,
    title: "Sporting Events & Championships",
    destination: "Nationwide & International",
    category: ["Events"],
    image: UNSPLASH("1509440159596-0249088772ff"),
    description:
      "Super Bowl, World Series, NBA Finals, World Cup — experience the biggest games live. Jessica secures tickets and builds the perfect gameday trip around your favorite team.",
    highlights: ["Game Tickets", "Tailgate Experiences", "City Hotel Deals", "Group Packages"],
    icon: Ticket,
    badge: undefined,
  },
  {
    id: 15,
    title: "Amusement Park Vacation",
    destination: "SeaWorld, Six Flags & More",
    category: ["Amusement Parks"],
    image: UNSPLASH("1605833556294-ea5c7a74f57d"),
    description:
      "Beyond Disney and Universal — SeaWorld, Busch Gardens, Six Flags, Dollywood, and more. Jessica finds the best ticket bundles, nearby stays, and tips to beat the lines.",
    highlights: ["Ticket Bundles", "Beat-the-Crowd Tips", "Dining Plans", "Hotel Packages"],
    icon: Zap,
    badge: "Best Bundles",
  },
  {
    id: 16,
    title: "Carnival & Norwegian Cruises",
    destination: "Caribbean & Alaska",
    category: ["Cruises"],
    image: UNSPLASH("1544620347-c4fd4a3d5957"),
    description:
      "Carnival's fun ships or Norwegian's Freestyle dining — Jessica knows every ship, every deck, and every deal. She'll find the best cabin at the best price, guaranteed.",
    highlights: ["Carnival Fun Ships", "Norwegian Freestyle", "Alaska Cruises", "Best Cabin Deals"],
    icon: Ship,
    badge: undefined,
  },
  {
    id: 17,
    title: "Sandals & Beaches Resorts",
    destination: "Jamaica, Barbados & St. Lucia",
    category: ["All-Inclusive"],
    image: UNSPLASH("1507003211169-0a1dd7228f2d"),
    description:
      "Sandals and Beaches are synonymous with romance and luxury — and Jessica is certified to book them. Couples retreats, honeymoons, and family escapes at unbeatable prices.",
    highlights: ["Couples & Honeymoons", "Luxury Suites", "Unlimited Premium Dining", "Water Sports"],
    icon: TreePalm,
    badge: "Certified Specialist",
  },
  {
    id: 18,
    title: "Universal Studios Hollywood",
    destination: "Los Angeles, California",
    category: ["Universal"],
    image: UNSPLASH("1530521954074-e64f6810b32d"),
    description:
      "Movie magic on the West Coast — ride the world-famous Studio Tour, explore the Wizarding World of Harry Potter, and pair it with a full LA getaway. Jessica builds the perfect park-and-city combo.",
    highlights: ["Studio Tour", "Wizarding World", "Front-of-Line Passes", "LA Hotel Add-Ons"],
    icon: Globe,
    badge: undefined,
  },
  {
    id: 19,
    title: "Italy & Mediterranean Tour",
    destination: "Rome, Florence & Amalfi Coast",
    category: ["Europe"],
    image: UNSPLASH("1501554728187-ce583db33af7"),
    description:
      "From the Colosseum to cliffside villages on the Amalfi Coast — Jessica crafts a multi-city Italian dream trip with private guides, scenic train transfers, and unforgettable meals.",
    highlights: ["Rome & Vatican", "Tuscan Vineyards", "Amalfi Coast", "Private Guides"],
    icon: Mountain,
    badge: "Bucket List",
  },
  {
    id: 20,
    title: "Vineyard Estate Retreat",
    destination: "Napa, Tuscany & Beyond",
    category: ["Airbnb & Stays"],
    image: UNSPLASH("1477959858617-67f85cf4f1df"),
    description:
      "Wake up to rolling vineyards and private terraces. Jessica curates standout vineyard estates and farmhouse stays — complete with tastings, chef experiences, and seamless transfers.",
    highlights: ["Private Estates", "Wine Tastings", "Chef Experiences", "Farm-to-Table"],
    icon: Home,
    badge: undefined,
  },
  {
    id: 21,
    title: "Coaster Capital Adventure",
    destination: "Cedar Point, Dollywood & Hersheypark",
    category: ["Amusement Parks"],
    image: UNSPLASH("1488085061387-422e29b40080"),
    description:
      "For thrill-seekers chasing the biggest, fastest coasters in the country — Jessica plans multi-park road trips with the right ticket bundles, on-property stays, and skip-the-line perks.",
    highlights: ["Record-Breaking Coasters", "Multi-Park Passes", "On-Property Stays", "Skip-the-Line"],
    icon: Zap,
    badge: "Thrill Seekers",
  },
];

const CATEGORIES: DestCategory[] = [
  "All",
  "Disney",
  "Cruises",
  "Hawaii",
  "All-Inclusive",
  "Universal",
  "Europe",
  "Airbnb & Stays",
  "Road Trips",
  "Events",
  "Amusement Parks",
];

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
        title="Destinations — Anything, Anywhere | Next Chapter Travel"
        description="Jessica Seiders plans any trip — Disney, cruises, Airbnb getaways, road trips, live events, amusement parks, Hawaii, all-inclusive resorts, and more. Best prices guaranteed."
        canonical="/destinations"
      />

      <SiteNav />

      {/* ── Hero ── */}
      <section className="pt-24 sm:pt-32 md:pt-44 pb-14 sm:pb-20 relative overflow-hidden">
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
            Anything. Anywhere. Any Budget.
          </Badge>
          <h1
            data-reveal
            data-reveal-delay="100"
            className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl font-serif font-bold mb-5 sm:mb-8 tracking-tight heading-glow"
          >
            Your Trip,{" "}
            <span className="text-gradient-gold italic">Your Way</span>
          </h1>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-base sm:text-xl text-muted-foreground/90 mb-8 sm:mb-10 font-sans font-light leading-relaxed max-w-2xl mx-auto"
          >
            Airbnb or cruise ship. Theme park or van life. Concert weekend or tropical all-inclusive.
            Whatever you're dreaming of — and whatever your budget — Jessica finds you the
            absolute best deals and plans every last detail.
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
              <Tag className="w-4 h-4 text-secondary" />
              Best prices — that's her job
            </span>
            <span className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-secondary" />
              Certified in every brand
            </span>
          </div>
        </div>
      </section>

      {/* ── Best Price Promise Banner ── */}
      <section className="py-5 sm:py-6 bg-secondary/10 border-y border-secondary/20">
        <div className="container">
          <div
            data-reveal
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-10 text-center sm:text-left"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                <Tag className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-serif font-bold text-base sm:text-lg leading-tight">Best Price Promise</p>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground">Finding the best deals is literally Jessica's job</p>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border/50" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                <Globe className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-serif font-bold text-base sm:text-lg leading-tight">Any Destination</p>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground">Airbnb, cruise, road trip, resort, event — she books it all</p>
              </div>
            </div>
            <div className="hidden sm:block h-8 w-px bg-border/50" />
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-5 h-5 text-secondary" />
              </div>
              <div>
                <p className="font-serif font-bold text-base sm:text-lg leading-tight">Any Budget</p>
                <p className="font-sans text-xs sm:text-sm text-muted-foreground">From budget adventures to luxury escapes</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter + Grid ── */}
      <section className="py-6 sm:py-10 pb-20 sm:pb-28 dot-grid-bg relative">
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
                className="group gradient-border-gold card-accent-gold bg-card/55 backdrop-blur-md rounded-2xl overflow-hidden lift-on-hover tilt-card flex flex-col"
              >
                <div className="relative h-52 sm:h-64 img-parallax-wrap">
                  <LazyImage
                    src={dest.image}
                    alt={dest.title}
                    width="800"
                    height="500"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
                  {dest.badge && (
                    <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                      <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-[10px] sm:text-xs shadow-lg">
                        {dest.badge}
                      </Badge>
                    </div>
                  )}
                  {/* Category icon badge in top-left */}
                  <div className="absolute top-3 left-3">
                    <div className="w-8 h-8 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center">
                      <dest.icon className="w-4 h-4 text-secondary" />
                    </div>
                  </div>
                  <div className="absolute bottom-3 left-3">
                    <div className="flex items-center gap-1.5 text-white/90 font-sans text-xs tracking-wide uppercase">
                      <MapPin className="w-3 h-3 text-secondary" />
                      {dest.destination}
                    </div>
                  </div>
                </div>

                <div className="p-5 sm:p-7 flex flex-col flex-1">
                  <h3 className="text-lg sm:text-xl font-serif font-bold leading-tight mb-2">
                    {dest.title}
                  </h3>
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
        <div aria-hidden={true} className="pointer-events-none absolute inset-0">
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
              Don't See Your Trip?{" "}
              <span className="text-gradient-gold italic">Just Ask Jessica</span>
            </h2>
            <p className="text-primary-foreground/70 text-base sm:text-lg font-sans leading-relaxed mb-8 sm:mb-10">
              If you can dream it, Jessica can plan it — and you never have to
              worry about getting the best price, because hunting down the
              absolute best deals is truly her job. From Airbnb escapes and road
              trips to cruises, concerts, and everything in between, she handles
              every detail so you can just enjoy the ride.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6">
              <Link href="/plan-my-trip" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-secondary text-secondary-foreground hover:bg-secondary/90 px-7 sm:px-14 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] btn-shimmer cta-glow active:scale-95 transition-all"
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
              {[
                "Disney Specialist",
                "Royal Caribbean Expert",
                "Universal Studios",
                "Carnival Certified",
                "Norwegian Cruise Line",
                "Sandals & Beaches",
                "Airbnb & VRBO",
              ].map(cert => (
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
