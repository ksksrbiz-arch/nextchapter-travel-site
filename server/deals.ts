/**
 * server/deals.ts — LLM-powered deal generation for the public Deals page.
 *
 * Follows the same pattern as server/ai.ts:
 *   • `generateDeals()` calls the LLM via invokeLLM and falls back to
 *     `mockGenerateDeals()` when no API key is configured or the LLM fails.
 *   • The output is a `DealsData` object that the refresh script writes to
 *     `client/src/data/deals.json`.
 *
 * Supplier context (as of 2026):
 *   Royal Caribbean, Disney, NCL, Sandals, ALG Vacations, Pleasant Holidays,
 *   Celebrity Cruises, Disney Cruise Line — all preferred-partner relationships
 *   where Jessica earns extra commission on bundled/promotional bookings.
 */

import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";
import type { DealsData, RawDeal } from "@shared/dealTypes";

// ─── JSON Schema for LLM output ───────────────────────────────────────────────

const DEALS_SCHEMA = {
  name: "deals_refresh",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["deals"],
    properties: {
      deals: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: [
            "id",
            "title",
            "destination",
            "category",
            "image",
            "description",
            "perks",
            "iconName",
            "priceFrom",
            "bookBy",
            "travelWindow",
            "supplierName",
          ],
          properties: {
            id: { type: "integer" },
            title: { type: "string" },
            destination: { type: "string" },
            category: {
              type: "array",
              items: {
                type: "string",
                enum: [
                  "Cruises",
                  "Disney",
                  "All-Inclusive",
                  "Hawaii",
                  "Europe",
                  "Bundles",
                ],
              },
            },
            image: { type: "string" },
            description: { type: "string" },
            perks: { type: "array", items: { type: "string" } },
            iconName: {
              type: "string",
              enum: ["Ship", "Castle", "TreePalm", "Plane", "Globe"],
            },
            priceFrom: { type: "string" },
            priceWas: { type: "string" },
            bookBy: { type: "string" },
            travelWindow: { type: "string" },
            badge: {
              type: "string",
              enum: ["Hot Deal", "Bonus Commission", "Exclusive Bundle"],
            },
            featured: { type: "boolean" },
            supplierName: { type: "string" },
          },
        },
      },
    },
  },
  strict: false,
};

// ─── Known good Unsplash photo IDs for the LLM to pick from ──────────────────

const UNSPLASH_POOL = [
  "https://images.unsplash.com/photo-1548574505-5e239809ee19?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1597466599360-3b9775841aec?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1510097467424-192d713fd8b2?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1505852679233-d9fd70aff56d?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531253216-9f9a5d08d2b3?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1527004013197-933b70f77462?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1531572753322-ad063cecc140?auto=format&fit=crop&w=1200&q=80",
];

// ─── Mock fallback — identical to the initial deals.json content ─────────────

export function mockGenerateDeals(): DealsData {
  const now = new Date().toISOString();
  const deals: RawDeal[] = [
    {
      id: 1,
      title: "Royal Caribbean Summer Explorer Sale — 7-Night Caribbean",
      destination: "Eastern Caribbean · Royal Caribbean International",
      category: ["Cruises", "Bundles"],
      image: UNSPLASH_POOL[0],
      description:
        "Sail roundtrip from Miami aboard Wonder of the Seas. Royal Caribbean's Summer Explorer Sale stacks free drinks, unlimited Wi-Fi, and $200 onboard credit on top of already-reduced fares — one of the best value sailings of the year.",
      perks: [
        "Free unlimited beverage package",
        "$200 onboard credit per stateroom",
        "Unlimited Wi-Fi (surf + stream)",
        "Kids sail free (3rd & 4th guests)",
      ],
      iconName: "Ship",
      priceFrom: "From $1,499/person",
      priceWas: "$1,999",
      bookBy: "Book by Jun 30, 2026",
      travelWindow: "Travel Jul – Dec 2026",
      badge: "Bonus Commission",
      featured: true,
      supplierName: "Royal Caribbean International",
    },
    {
      id: 2,
      title: "Walt Disney World Free Dining Fall Package",
      destination: "Orlando, FL · Walt Disney World Resort",
      category: ["Disney", "Bundles"],
      image: UNSPLASH_POOL[1],
      description:
        "Disney's most popular promotion is back: book a Disney Resort hotel + Park Hopper tickets and receive a FREE standard dining plan for the entire stay. Coveted fall dates including Mickey's Not-So-Scary Halloween Party weekends are available.",
      perks: [
        "Free standard dining plan (quick service + table service)",
        "Park Hopper tickets included",
        "Disney Early Theme Park Entry",
        "Memory Maker photo package add-on available",
      ],
      iconName: "Castle",
      priceFrom: "From $3,199/family of 4",
      priceWas: "$3,899",
      bookBy: "Book by Aug 25, 2026",
      travelWindow: "Travel Sep 1 – Nov 20, 2026",
      badge: "Exclusive Bundle",
      featured: true,
      supplierName: "Walt Disney Travel Company",
    },
    {
      id: 3,
      title: "Norwegian Cruise Line 'Free at Sea' — 10-Night Mediterranean",
      destination: "Rome · Athens · Santorini · Dubrovnik",
      category: ["Cruises", "Europe"],
      image: UNSPLASH_POOL[2],
      description:
        "Norwegian's Free at Sea promotion lets you choose up to 5 free extras across a 10-night Mediterranean sailing — stack an open bar, specialty dining, shore excursions, unlimited Wi-Fi, and a cabin upgrade all in one booking.",
      perks: [
        "Choose any 5: open bar, specialty dining, shore excursions, Wi-Fi, or cabin upgrade",
        "Open bar for 2 guests ($2,000+ value)",
        "3 specialty dining meals per person",
        "Unlimited Wi-Fi for 2 devices",
      ],
      iconName: "Ship",
      priceFrom: "From $1,999/person",
      priceWas: "$2,599",
      bookBy: "Book by Jul 15, 2026",
      travelWindow: "Travel Oct 2026 – Apr 2027",
      badge: "Bonus Commission",
      supplierName: "Norwegian Cruise Line",
    },
    {
      id: 4,
      title: "Sandals Royal Jamaica — 7-Night Caribbean Sale",
      destination: "Montego Bay, Jamaica · Sandals Resorts",
      category: ["All-Inclusive"],
      image: UNSPLASH_POOL[3],
      description:
        "Sandals' Caribbean Sale brings their world-renowned unlimited-luxury® all-inclusive to its lowest price of the season. Every meal, top-shelf drink, land and water sport, and butler-level service is included — no hidden charges, ever.",
      perks: [
        "Unlimited premium spirits & gourmet dining",
        "5th night free on select room categories",
        "$200 resort credit per booking",
        "Complimentary scuba diving (certified divers)",
      ],
      iconName: "TreePalm",
      priceFrom: "From $2,199/person",
      priceWas: "$2,799",
      bookBy: "Book by Sep 30, 2026",
      travelWindow: "Travel Nov 2026 – Apr 2027",
      badge: "Hot Deal",
      supplierName: "Sandals Resorts",
    },
    {
      id: 5,
      title: "ALG Vacations — Riviera Maya All-In (Air Included)",
      destination: "Playa del Carmen / Tulum, Mexico",
      category: ["All-Inclusive", "Bundles"],
      image: UNSPLASH_POOL[4],
      description:
        "Apple Vacations' early-booking bonus packages round-trip airfare, 7 nights at a 5-star beachfront resort, and private round-trip airport transfers into one locked rate — no juggling separate bookings or price creep.",
      perks: [
        "Round-trip airfare included from most US cities",
        "Private airport transfers",
        "Early booking bonus: $100 resort credit",
        "All-inclusive: meals, drinks, non-motorized watersports",
      ],
      iconName: "Plane",
      priceFrom: "From $1,399/person",
      priceWas: "$1,799",
      bookBy: "Book by Jun 30, 2026",
      travelWindow: "Travel Aug – Dec 2026",
      badge: "Hot Deal",
      supplierName: "ALG Vacations (Apple Vacations)",
    },
    {
      id: 6,
      title: "Pleasant Holidays Multi-Island Hawaii Hopper",
      destination: "Oahu · Maui · Kauai",
      category: ["Hawaii", "Bundles"],
      image: UNSPLASH_POOL[5],
      description:
        "Pleasant Holidays' preferred-partner packaging covers inter-island flights, 10 nights of oceanfront accommodations across three islands, and a private Luau experience — all at a rate Jessica's clients can't replicate booking individually.",
      perks: [
        "Inter-island flights between all 3 islands",
        "10 nights oceanfront (Waikiki, Wailea, Princeville)",
        "Private luau experience for 2",
        "Daily breakfast at each property",
      ],
      iconName: "TreePalm",
      priceFrom: "From $3,699/person",
      priceWas: "$4,299",
      bookBy: "Book by Jul 31, 2026",
      travelWindow: "Travel Jan – May 2027",
      badge: "Bonus Commission",
      supplierName: "Pleasant Holidays",
    },
    {
      id: 7,
      title: "Celebrity Cruises 'Always Included' — 7-Night Alaska Glaciers",
      destination: "Seattle to Juneau, Skagway & Ketchikan",
      category: ["Cruises", "Bundles"],
      image: UNSPLASH_POOL[6],
      description:
        "Celebrity's Always Included® ships every stateroom with classic beverages, unlimited Wi-Fi, and pre-paid gratuities. Add on Celebrity's Double Up promotion for a premium drink upgrade + premium Wi-Fi at no extra cost.",
      perks: [
        "Classic beverages included for 2 guests",
        "Unlimited Wi-Fi for 2 devices",
        "Gratuities pre-paid",
        "Double Up: premium drinks + premium Wi-Fi upgrade free",
      ],
      iconName: "Ship",
      priceFrom: "From $2,199/person",
      priceWas: "$2,799",
      bookBy: "Book by Aug 15, 2026",
      travelWindow: "Travel May – Sep 2027",
      badge: "Exclusive Bundle",
      supplierName: "Celebrity Cruises",
    },
    {
      id: 8,
      title: "Disney Cruise Line — 4-Night Bahamian Voyage",
      destination: "Port Canaveral, FL to Nassau & Castaway Cay",
      category: ["Cruises", "Disney"],
      image: UNSPLASH_POOL[7],
      description:
        "Disney Cruise Line's early-booking discount knocks 10% off regular fares on 4-night Bahamian sailings calling at Nassau and Disney's private island, Castaway Cay — with a $250 onboard credit to spend on excursions, spa, or specialty dining.",
      perks: [
        "10% early booking discount",
        "$250 onboard credit per stateroom",
        "Private island stop: Castaway Cay",
        "Broadway-caliber shows + character dinners",
      ],
      iconName: "Ship",
      priceFrom: "From $2,499/family of 4",
      priceWas: "$2,999",
      bookBy: "Book by Jun 30, 2026",
      travelWindow: "Travel Nov 2026 – Mar 2027",
      badge: "Hot Deal",
      supplierName: "Disney Cruise Line",
    },
  ];
  return { updatedAt: now, source: "mock" as const, deals };
}

// ─── LLM-powered generation ───────────────────────────────────────────────────

/**
 * Generate a fresh set of curated travel deals via the LLM.
 * Falls back to `mockGenerateDeals()` when no API key is configured or the
 * LLM returns invalid data.
 */
export async function generateDeals(): Promise<DealsData> {
  if (!ENV.forgeApiKey) {
    return mockGenerateDeals();
  }

  const today = new Date().toISOString().slice(0, 10);

  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content: `You are a travel deals curator for Next Chapter Travel, a boutique travel agency led by Jessica Seiders. Your job is to produce a JSON array of 8 curated travel promotions that Jessica earns extra commission on (preferred-partner and supplier-override deals).

Context for today's refresh:
- Today's date: ${today}
- Preferred supplier partners: Royal Caribbean, Disney (WDW + DCL), Norwegian Cruise Line, Sandals Resorts, Beaches Resorts, Celebrity Cruises, ALG Vacations (Apple Vacations / Funjet), Pleasant Holidays, Princess Cruises
- Commission-boosted categories: multi-component bundles (air+hotel+transfers), exclusive supplier sale windows, group-rate promos
- Audience: US families, couples, and solo travelers booking 3–18 months out

For each deal, choose a realistic high-quality Unsplash image URL from the pool below (vary them):
${UNSPLASH_POOL.join("\n")}

Write compelling, specific copy — real promotion names, authentic perk language, plausible price ranges. Mark exactly 2 deals as featured: true. Respond ONLY with JSON matching the schema.`,
        },
        {
          role: "user",
          content: `Generate the deals array for ${today}. Return exactly 8 deals covering a mix of: Cruises, Disney, All-Inclusive, Hawaii, Europe, and Bundles categories.`,
        },
      ],
      outputSchema: DEALS_SCHEMA,
    });

    const text = result.choices?.[0]?.message?.content ?? "";
    const parsed = typeof text === "string" ? JSON.parse(text) : null;

    if (parsed && Array.isArray(parsed.deals) && parsed.deals.length >= 1) {
      return {
        updatedAt: new Date().toISOString(),
        source: "llm" as const,
        deals: parsed.deals as RawDeal[],
      };
    }
  } catch (error) {
    console.warn("[deals.generateDeals] LLM failed, using mock:", error);
  }

  return mockGenerateDeals();
}
