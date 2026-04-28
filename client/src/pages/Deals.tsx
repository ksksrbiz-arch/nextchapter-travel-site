import { useEffect, useMemo, useState } from "react";
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
  Tag,
  ArrowRight,
  Sparkles,
  Ship,
  Castle,
  TreePalm,
  Plane,
  Globe,
  Star,
  Clock,
  Shield,
  CheckCircle,
  Flame,
  Gift,
  TrendingDown,
  Calendar,
  Users,
  Percent,
  RefreshCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import dealsData from "@/data/deals.json";
import type { DealCategory, DealIconName, RawDeal } from "@shared/dealTypes";

// Map serialized iconName strings → Lucide React components
const ICON_MAP: Record<DealIconName, React.ElementType> = {
  Ship,
  Castle,
  TreePalm,
  Plane,
  Globe,
};

type FilterCategory = "All" | DealCategory;

/** Runtime deal — same as RawDeal but with a React component instead of iconName */
type Deal = Omit<RawDeal, "iconName"> & { icon: React.ElementType };

// Derive runtime Deal objects (with React component icon) from the JSON data.
// deals.json is updated by `pnpm run deals:refresh` (see scripts/refresh-deals.ts).
const DEALS: Deal[] = dealsData.deals.map(d => {
  const { iconName, ...rest } = d;
  return { ...rest, icon: ICON_MAP[iconName as DealIconName] ?? Globe };
});

/** ISO string from deals.json, e.g. "2026-04-28T22:38:20Z" */
const DEALS_UPDATED_AT = dealsData.updatedAt;
const CATEGORIES: { key: FilterCategory; icon: React.ElementType }[] = [
  { key: "All", icon: Sparkles },
  { key: "Cruises", icon: Ship },
  { key: "Disney", icon: Castle },
  { key: "All-Inclusive", icon: TreePalm },
  { key: "Hawaii", icon: TreePalm },
  { key: "Europe", icon: Plane },
  { key: "Bundles", icon: Gift },
];

const WHY_BUNDLE = [
  {
    icon: TrendingDown,
    title: "Lower Total Cost",
    desc: "Suppliers reward bundled bookings with promotional rates, free nights, and onboard credits you can't see online.",
  },
  {
    icon: Gift,
    title: "Stacked Perks",
    desc: "Free dining, drink packages, transfers, resort credits, and room upgrades — layered together on a single trip.",
  },
  {
    icon: Shield,
    title: "One Plan, One Advocate",
    desc: "Cruise + hotel + flights coordinated by Jessica — if anything changes, you have one number to call, not five.",
  },
  {
    icon: Percent,
    title: "Preferred-Partner Pricing",
    desc: "Jessica's agency relationships unlock rates and group amenities reserved for trusted advisors.",
  },
];

/** Format ISO timestamp to "Apr 28, 2026" for display */
function formatUpdatedAt(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso.slice(0, 10);
  }
}

export default function Deals() {
  const { setVideoContext } = useVideoHero();
  const [activeCategory, setActiveCategory] = useState<FilterCategory>("All");
  useScrollReveal();

  useEffect(() => {
    setVideoContext("landing");
  }, [setVideoContext]);

  const filteredDeals = useMemo(() => {
    if (activeCategory === "All") return DEALS;
    return DEALS.filter(deal =>
      (deal.category as string[]).includes(activeCategory)
    );
  }, [activeCategory]);

  return (
    <div className="min-h-screen font-serif selection:bg-secondary/30">
      <SEOHead
        title="Travel Deals & Trip Bundles — Next Chapter Travel"
        description="Curated travel deals and trip bundles handpicked by Jessica Seiders — cruises, Disney, all-inclusive resorts, Hawaii, and Europe. Stacked perks, locked-in rates, and zero booking fees."
        canonical="/deals"
      />

      <SiteNav />

      {/* ── Hero ── */}
      <section className="pt-24 sm:pt-32 md:pt-44 pb-14 sm:pb-24 relative overflow-hidden">
        <div aria-hidden={true} className="pointer-events-none absolute inset-0 -z-10">
          <span
            className="aurora-blob gold"
            style={{ width: "44rem", height: "44rem", top: "-12rem", left: "-10rem" }}
          />
          <span
            className="aurora-blob navy"
            style={{ width: "40rem", height: "40rem", top: "-6rem", right: "-12rem" }}
          />
          <span
            className="aurora-blob cream"
            style={{ width: "32rem", height: "32rem", bottom: "-10rem", left: "30%" }}
          />
        </div>
        <div className="container text-center">
          <Badge
            data-reveal
            className="mb-4 sm:mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-[10px] sm:text-xs tracking-[0.18em] uppercase inline-flex items-center gap-2 px-3 py-1.5 backdrop-blur-md"
          >
            <Flame className="w-3 h-3" />
            Limited-Time Offers
          </Badge>
          <h1
            data-reveal
            data-reveal-delay="100"
            className="text-[2.5rem] leading-[1.05] sm:text-6xl md:text-7xl font-serif font-bold mb-5 sm:mb-8 tracking-tight heading-glow"
          >
            Travel Deals &{" "}
            <span className="text-gradient-gold italic">Trip Bundles</span>
          </h1>
          <p
            data-reveal
            data-reveal-delay="200"
            className="text-base sm:text-xl text-muted-foreground/90 mb-8 sm:mb-12 font-sans font-light leading-relaxed max-w-2xl mx-auto"
          >
            Hand-picked promotions and curated multi-supplier bundles where stacked
            perks, locked-in rates, and preferred-partner pricing come together —
            booked free of charge through Jessica.
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
                <span>Lock In a Deal</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <a href="#deals-grid" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-background/40 backdrop-blur-md border-border hover:bg-background/60 px-6 sm:px-12 py-6 sm:py-8 text-base sm:text-xl font-sans font-bold rounded-2xl min-h-[56px] active:scale-95 transition-all"
              >
                Browse All Deals
              </Button>
            </a>
          </div>
          <p
            data-reveal
            data-reveal-delay="400"
            className="mt-5 sm:mt-7 text-xs sm:text-sm font-sans text-muted-foreground/80 inline-flex items-center justify-center gap-2 flex-wrap"
          >
            <Shield className="w-4 h-4 text-secondary" />
            <span>No booking fees</span>
            <span className="opacity-40">·</span>
            <Clock className="w-4 h-4 text-secondary" />
            <span>Quote within 24 hours</span>
            <span className="opacity-40">·</span>
            <Star className="w-4 h-4 text-secondary fill-secondary" />
            <span>Preferred-partner perks</span>
          </p>
        </div>
      </section>

      {/* ── Featured Deals ── */}
      <section className="py-12 sm:py-20 bg-black/30 backdrop-blur-sm">
        <div className="container">
          <div className="text-center mb-10 sm:mb-14" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              Featured This Month
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              The Hottest{" "}
              <span className="text-gradient-gold italic">Bundles</span> Right
              Now
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Limited inventory, supplier-funded promotions, and stacked perks
              that disappear once they're gone.
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 sm:gap-7">
            {DEALS.filter(d => d.featured).map((deal, idx) => (
              <article
                key={deal.id}
                data-reveal
                data-reveal-delay={String((idx + 1) * 100)}
                className="group relative gradient-border-gold card-accent-gold bg-card/60 backdrop-blur-md rounded-2xl overflow-hidden lift-on-hover ring-1 ring-secondary/20"
              >
                <div className="relative h-56 sm:h-72 overflow-hidden">
                  <LazyImage
                    src={deal.image}
                    alt={`${deal.title} — ${deal.destination}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                  {deal.badge && (
                    <Badge className="absolute top-3 left-3 bg-secondary text-secondary-foreground border-secondary/40 font-sans text-[10px] tracking-widest uppercase shadow-lg">
                      <Flame className="w-3 h-3 mr-1" />
                      {deal.badge}
                    </Badge>
                  )}
                  <div className="absolute top-3 right-3 w-11 h-11 rounded-xl bg-background/60 backdrop-blur-md border border-secondary/30 flex items-center justify-center">
                    <deal.icon className="w-5 h-5 text-secondary" />
                  </div>
                </div>
                <div className="p-5 sm:p-7">
                  <p className="text-xs font-sans tracking-widest uppercase text-secondary/90 mb-1.5">
                    {deal.destination}
                  </p>
                  <h3 className="text-xl sm:text-2xl font-serif font-bold mb-3 leading-tight">
                    {deal.title}
                  </h3>
                  <p className="text-muted-foreground text-sm sm:text-base font-sans leading-relaxed mb-4">
                    {deal.description}
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-5">
                    {deal.perks.map(perk => (
                      <li
                        key={perk}
                        className="flex items-start gap-2 text-sm font-sans text-muted-foreground/90"
                      >
                        <CheckCircle className="w-4 h-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{perk}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex items-end justify-between gap-3 flex-wrap pt-4 border-t border-border/40">
                    <div>
                      {deal.priceWas && (
                        <p className="text-xs font-sans text-muted-foreground/70 line-through">
                          {deal.priceWas}
                        </p>
                      )}
                      <p className="text-lg sm:text-xl font-serif font-bold text-secondary">
                        {deal.priceFrom}
                      </p>
                      <p className="text-[11px] font-sans text-muted-foreground/80 mt-0.5 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {deal.bookBy} · {deal.travelWindow}
                      </p>
                      <p className="text-[10px] font-sans text-muted-foreground/50 mt-0.5">
                        via {deal.supplierName}
                      </p>
                    </div>
                    <Link href={`/plan-my-trip?deal=${deal.id}`}>
                      <Button
                        size="sm"
                        className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans font-bold rounded-xl"
                      >
                        Request Quote
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Deal Filters + Grid ── */}
      <section id="deals-grid" className="py-16 sm:py-24">
        <div className="container">
          <div className="text-center mb-8 sm:mb-12" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs tracking-widest uppercase">
              <Tag className="w-3 h-3 mr-1.5 inline" />
              All Current Deals
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-foreground mb-3 sm:mb-4">
              Browse by{" "}
              <span className="text-gradient-gold italic">Category</span>
            </h2>
            <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto font-sans">
              Filter Jessica's curated promotions and trip bundles to match your
              travel style.
            </p>
            <p className="mt-3 text-xs font-sans text-muted-foreground/60 inline-flex items-center justify-center gap-1.5">
              <RefreshCw className="w-3 h-3" />
              Deals refreshed {formatUpdatedAt(DEALS_UPDATED_AT)}
            </p>
          </div>

          {/* Category filter */}
          <div
            data-reveal
            className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 sm:mb-12"
            role="tablist"
            aria-label="Filter deals by category"
          >
            {CATEGORIES.map(({ key, icon: Icon }) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(key)}
                  className={cn(
                    "inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-sans text-sm transition-all border min-h-[40px] active:scale-95",
                    isActive
                      ? "bg-secondary text-secondary-foreground border-secondary shadow-md"
                      : "bg-background/50 backdrop-blur-md border-border hover:border-secondary/40 hover:text-secondary"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {key}
                </button>
              );
            })}
          </div>

          {filteredDeals.length === 0 ? (
            <p
              data-reveal
              className="text-center text-muted-foreground font-sans py-12"
            >
              No deals in this category right now — Jessica is always sourcing
              new ones. Reach out for a custom quote.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {filteredDeals.map((deal, idx) => (
                <article
                  key={deal.id}
                  data-reveal
                  data-reveal-delay={String(((idx % 3) + 1) * 100)}
                  className="group gradient-border-gold card-accent-gold bg-card/55 backdrop-blur-md rounded-2xl overflow-hidden lift-on-hover tilt-card flex flex-col"
                >
                  <div className="relative h-44 sm:h-52 overflow-hidden">
                    <LazyImage
                      src={deal.image}
                      alt={`${deal.title} — ${deal.destination}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/30 to-transparent" />
                    {deal.badge && (
                      <Badge className="absolute top-2.5 left-2.5 bg-secondary/90 text-secondary-foreground border-secondary/40 font-sans text-[10px] tracking-widest uppercase">
                        {deal.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="p-5 sm:p-6 flex flex-col flex-1">
                    <p className="text-[11px] font-sans tracking-widest uppercase text-secondary/90 mb-1">
                      {deal.destination}
                    </p>
                    <h3 className="text-lg sm:text-xl font-serif font-bold mb-2 leading-tight">
                      {deal.title}
                    </h3>
                    <p className="text-muted-foreground text-sm font-sans leading-relaxed mb-4 flex-1">
                      {deal.description}
                    </p>
                    <ul className="space-y-1.5 mb-4">
                      {deal.perks.slice(0, 3).map(perk => (
                        <li
                          key={perk}
                          className="flex items-start gap-2 text-xs sm:text-sm font-sans text-muted-foreground/90"
                        >
                          <CheckCircle className="w-3.5 h-3.5 text-secondary mt-0.5 flex-shrink-0" />
                          <span>{perk}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="pt-3 border-t border-border/40">
                      <div className="flex items-baseline gap-2 mb-1">
                        {deal.priceWas && (
                          <span className="text-xs font-sans text-muted-foreground/70 line-through">
                            {deal.priceWas}
                          </span>
                        )}
                        <span className="text-base sm:text-lg font-serif font-bold text-secondary">
                          {deal.priceFrom}
                        </span>
                      </div>
                      <p className="text-[11px] font-sans text-muted-foreground/80 mb-1 inline-flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {deal.bookBy}
                      </p>
                      <p className="text-[10px] font-sans text-muted-foreground/50 mb-3">
                        via {deal.supplierName}
                      </p>
                      <Link href={`/plan-my-trip?deal=${deal.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="w-full bg-background/40 backdrop-blur-md border-secondary/40 hover:bg-secondary hover:text-secondary-foreground font-sans font-bold rounded-xl"
                        >
                          Request Quote
                          <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Why Bundle ── */}
      <section className="py-16 sm:py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div aria-hidden={true} className="pointer-events-none absolute inset-0">
          <span
            className="aurora-blob gold"
            style={{ width: "30rem", height: "30rem", top: "-8rem", left: "10%", opacity: 0.25 }}
          />
          <span
            className="aurora-blob navy"
            style={{ width: "30rem", height: "30rem", bottom: "-10rem", right: "5%", opacity: 0.4 }}
          />
        </div>
        <div className="container relative">
          <div className="text-center mb-10 sm:mb-14" data-reveal>
            <Badge className="mb-3 sm:mb-4 bg-secondary/15 text-secondary border-secondary/30 font-sans text-xs tracking-widest uppercase">
              Why Bundle
            </Badge>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-3 sm:mb-4">
              More Trip,{" "}
              <span className="text-gradient-gold italic">Less Cost</span>
            </h2>
            <p className="text-primary-foreground/80 text-base sm:text-lg max-w-2xl mx-auto font-sans">
              When you book multiple components together through a preferred
              advisor, suppliers reward you with perks you can't get à la carte.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {WHY_BUNDLE.map((item, idx) => (
              <div
                key={item.title}
                data-reveal
                data-reveal-delay={String(((idx % 4) + 1) * 100)}
                className="bg-background/10 backdrop-blur-md p-6 rounded-2xl border border-secondary/20"
              >
                <div className="w-12 h-12 rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-secondary" />
                </div>
                <h3 className="text-lg font-serif font-bold mb-2">
                  {item.title}
                </h3>
                <p className="text-primary-foreground/80 text-sm font-sans leading-relaxed">
                  {item.desc}
                </p>
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
          <span
            className="aurora-blob gold"
            style={{ width: "36rem", height: "36rem", top: "-8rem", left: "10%" }}
          />
          <span
            className="aurora-blob navy"
            style={{ width: "32rem", height: "32rem", bottom: "-10rem", right: "10%", opacity: 0.4 }}
          />
        </div>
        <div className="container relative z-10 text-center">
          <div className="max-w-3xl mx-auto" data-reveal>
            <Badge className="mb-6 bg-secondary/15 text-secondary border-secondary/30 font-sans text-xs tracking-[0.2em] uppercase px-3 py-1.5">
              <Sparkles className="w-3 h-3 mr-1.5 inline" />
              Don't See Your Trip?
            </Badge>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold mb-6 sm:mb-8 leading-[1.05]">
              Ask Jessica for a{" "}
              <span className="text-gradient-gold italic">Custom Bundle</span>
            </h2>
            <p className="text-lg sm:text-xl text-muted-foreground mb-10 sm:mb-12 font-sans leading-relaxed">
              Tell Jessica your dates, party size, and dream destination — she'll
              source supplier promotions, layer perks, and send back a tailored
              proposal within 24 hours. No fees, no obligation.
            </p>
            <Link href="/plan-my-trip">
              <Button
                size="lg"
                className="group bg-secondary text-secondary-foreground hover:bg-secondary/90 px-14 py-8 text-xl font-sans font-bold rounded-2xl min-h-[56px] btn-shimmer cta-glow active:scale-95 transition-all"
              >
                <span>Request a Custom Quote</span>
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-6 text-sm font-sans text-muted-foreground/80">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-secondary" />
                100% free
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-secondary" />
                Family & group friendly
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
