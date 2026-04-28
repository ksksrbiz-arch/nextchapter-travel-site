/**
 * server/gds.ts — Mock GDS (Sabre/Travelport) integration.
 *
 * In production this would call the Sabre REST API using SABRE_API_KEY. For
 * the demo we return deterministic, realistic-looking results derived from
 * the input parameters. A simple in-memory cache keyed by query parameters
 * keeps repeated searches snappy and demonstrates the caching layer.
 */

const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes
type CacheEntry<T> = { value: T; expiresAt: number };
const cache = new Map<string, CacheEntry<unknown>>();

function getCached<T>(key: string): T | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (hit.expiresAt < Date.now()) {
    cache.delete(key);
    return null;
  }
  return hit.value as T;
}

function setCached<T>(key: string, value: T): void {
  cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

const AIRLINES = [
  { code: "DL", name: "Delta Air Lines" },
  { code: "UA", name: "United Airlines" },
  { code: "AA", name: "American Airlines" },
  { code: "B6", name: "JetBlue" },
  { code: "AS", name: "Alaska Airlines" },
];

export type FlightOffer = {
  id: string;
  airline: { code: string; name: string };
  flightNumber: string;
  origin: string;
  destination: string;
  departureIso: string;
  arrivalIso: string;
  durationMinutes: number;
  stops: number;
  priceUsd: number;
  cabin: "economy" | "premium" | "business" | "first";
  baggageIncluded: boolean;
  carbonKg: number;
};

export type HotelOffer = {
  id: string;
  name: string;
  city: string;
  starRating: number;
  pricePerNightUsd: number;
  totalPriceUsd: number;
  ecoCertified: boolean;
  thumbnailUrl?: string;
  vendor: string;
};

export type FlightSearchInput = {
  origin: string;
  destination: string;
  departureDate: string; // ISO yyyy-mm-dd
  returnDate?: string;
  passengers?: number;
  cabin?: "economy" | "premium" | "business" | "first";
};

export type HotelSearchInput = {
  city: string;
  checkIn: string;
  checkOut: string;
  guests?: number;
  ecoOnly?: boolean;
};

const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
};

export async function searchFlights(
  input: FlightSearchInput
): Promise<FlightOffer[]> {
  const key = `flights:${JSON.stringify(input)}`;
  const cached = getCached<FlightOffer[]>(key);
  if (cached) return cached;

  const seed = hash(`${input.origin}-${input.destination}-${input.departureDate}`);
  const offers: FlightOffer[] = [];
  const baseTime = new Date(input.departureDate + "T08:00:00Z").getTime();
  for (let i = 0; i < 5; i++) {
    const airline = AIRLINES[(seed + i) % AIRLINES.length];
    const stops = i % 3 === 0 ? 0 : 1;
    const duration = 240 + ((seed + i * 23) % 240) + stops * 90;
    const dep = new Date(baseTime + i * 90 * 60 * 1000);
    const arr = new Date(dep.getTime() + duration * 60 * 1000);
    const basePrice = 320 + ((seed + i * 41) % 380) - stops * 30;
    offers.push({
      id: `${airline.code}-${seed % 9999}-${i}`,
      airline,
      flightNumber: `${airline.code}${100 + ((seed + i * 7) % 1500)}`,
      origin: input.origin.toUpperCase(),
      destination: input.destination.toUpperCase(),
      departureIso: dep.toISOString(),
      arrivalIso: arr.toISOString(),
      durationMinutes: duration,
      stops,
      priceUsd: basePrice,
      cabin: input.cabin ?? "economy",
      baggageIncluded: i % 2 === 0,
      // Direct flights are greener; cabins above economy emit more
      carbonKg: Math.round(
        (duration / 60) * (stops === 0 ? 80 : 105) * (input.cabin === "business" ? 2.2 : 1)
      ),
    });
  }
  offers.sort((a, b) => a.priceUsd - b.priceUsd);
  setCached(key, offers);
  return offers;
}

export async function searchHotels(
  input: HotelSearchInput
): Promise<HotelOffer[]> {
  const key = `hotels:${JSON.stringify(input)}`;
  const cached = getCached<HotelOffer[]>(key);
  if (cached) return cached;

  const seed = hash(`${input.city}-${input.checkIn}`);
  const checkIn = new Date(input.checkIn);
  const checkOut = new Date(input.checkOut);
  const nights = Math.max(
    1,
    Math.round((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24))
  );
  const properties = [
    "Grand Plaza",
    "Riverside Inn",
    "The Palm Resort",
    "Boutique 21",
    "Heritage Lodge",
    "Skyline Towers",
  ];
  const offers: HotelOffer[] = [];
  for (let i = 0; i < properties.length; i++) {
    const stars = 3 + ((seed + i) % 3); // 3-5
    const price = 110 + ((seed + i * 53) % 380) + stars * 40;
    const eco = i % 3 === 0;
    if (input.ecoOnly && !eco) continue;
    offers.push({
      id: `${input.city.slice(0, 3).toUpperCase()}-${seed % 9999}-${i}`,
      name: `${properties[i]} ${input.city}`,
      city: input.city,
      starRating: stars,
      pricePerNightUsd: price,
      totalPriceUsd: price * nights,
      ecoCertified: eco,
      vendor: "Sabre GDS",
    });
  }
  offers.sort((a, b) => a.pricePerNightUsd - b.pricePerNightUsd);
  setCached(key, offers);
  return offers;
}

export type BookingRequest =
  | { kind: "flight"; offerId: string; passengers: number }
  | { kind: "hotel"; offerId: string; guests: number };

export type BookingResult = {
  success: true;
  confirmationNumber: string;
  vendor: string;
};

/** Mock booking — generates a confirmation number; never charges. */
export async function bookOffer(req: BookingRequest): Promise<BookingResult> {
  const id = req.offerId;
  const conf = `${id.slice(0, 4).toUpperCase()}-${(hash(id) % 999999)
    .toString()
    .padStart(6, "0")}`;
  return {
    success: true,
    confirmationNumber: conf,
    vendor: "Sabre GDS (mock)",
  };
}
