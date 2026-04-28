import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import {
  mockGenerateItinerary,
  mockParseItineraryFromText,
  mockChatbotReply,
  mockSuggestions,
} from "./ai";
import { searchFlights, searchHotels, bookOffer } from "./gds";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function adminCtx(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin",
    email: "j@example.com",
    name: "Admin",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

function clientCtx(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "client",
    email: "c@example.com",
    name: "Client",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  return {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
}

describe("ai mock helpers", () => {
  it("mockGenerateItinerary produces the expected number of days", () => {
    const start = new Date("2025-06-01T00:00:00Z");
    const end = new Date("2025-06-05T00:00:00Z");
    const result = mockGenerateItinerary({
      destination: "Tokyo",
      startDate: start,
      endDate: end,
      travelStyle: "cultural",
      budgetTier: "mid",
    });
    expect(result.source).toBe("mock");
    // 5 days inclusive, with 1 first-day arrival, 1 last-day departure, 3 days × 3 items in middle
    expect(result.items.length).toBeGreaterThan(0);
    const days = new Set(result.items.map(i => i.dayNumber));
    expect(days.size).toBe(5);
    expect(result.summary).toContain("Tokyo");
  });

  it("mockGenerateItinerary defaults to a sensible duration without dates", () => {
    const result = mockGenerateItinerary({ destination: "Paris" });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.summary).toContain("Paris");
  });

  it("mockParseItineraryFromText extracts day-numbered items", () => {
    const text = "Day 1: Arrive in Rome\nDay 2: Vatican tour\nDay 3: Florence";
    const out = mockParseItineraryFromText(text);
    expect(out.source).toBe("mock");
    expect(out.items.length).toBe(3);
    expect(out.items[0].dayNumber).toBe(1);
    expect(out.items[2].dayNumber).toBe(3);
  });

  it("mockChatbotReply suggests escalation for cancellation queries", () => {
    const reply = mockChatbotReply("How do I cancel my booking?");
    expect(reply.suggestEscalation).toBe(true);
    expect(reply.reply.toLowerCase()).toContain("cancel");
  });

  it("mockChatbotReply handles benign FAQs without escalation", () => {
    const reply = mockChatbotReply("What's the baggage allowance?");
    expect(reply.suggestEscalation).toBe(false);
    expect(reply.reply.toLowerCase()).toMatch(/carry|bag/);
  });

  it("mockSuggestions returns final-week reminder when trip is days away", () => {
    const out = mockSuggestions({ daysUntilTrip: 3, destination: "Lisbon" });
    expect(out.length).toBeGreaterThan(0);
    expect(out.some(s => /final.?week|packing/i.test(s.title))).toBe(true);
  });
});

describe("gds (mock)", () => {
  it("searchFlights returns deterministic offers sorted by price", async () => {
    const offers = await searchFlights({
      origin: "JFK",
      destination: "MCO",
      departureDate: "2025-08-01",
    });
    expect(offers.length).toBe(5);
    for (let i = 1; i < offers.length; i++) {
      expect(offers[i].priceUsd).toBeGreaterThanOrEqual(offers[i - 1].priceUsd);
    }
    // Same query → same first offer (cache + determinism)
    const again = await searchFlights({
      origin: "JFK",
      destination: "MCO",
      departureDate: "2025-08-01",
    });
    expect(again[0].id).toBe(offers[0].id);
  });

  it("searchHotels filters eco-only", async () => {
    const ecoOnly = await searchHotels({
      city: "Paris",
      checkIn: "2025-09-10",
      checkOut: "2025-09-15",
      ecoOnly: true,
    });
    expect(ecoOnly.every(h => h.ecoCertified)).toBe(true);
  });

  it("bookOffer returns a confirmation number", async () => {
    const result = await bookOffer({
      kind: "flight",
      offerId: "DL-1234-0",
      passengers: 2,
    });
    expect(result.success).toBe(true);
    expect(result.confirmationNumber).toMatch(/^[A-Z0-9-]+$/);
  });
});

describe("identityWallet validation", () => {
  it("rejects raw card numbers in tokenRef", async () => {
    const caller = appRouter.createCaller(clientCtx());
    await expect(
      caller.identityWallet.create({
        documentType: "payment_token",
        label: "Visa card",
        tokenRef: "4242424242424242",
      })
    ).rejects.toThrow(/Raw card numbers/i);
  });
});

describe("collaborators auth", () => {
  it("non-admins cannot invite collaborators", async () => {
    const caller = appRouter.createCaller(clientCtx());
    await expect(
      caller.collaborators.invite({
        tripId: 1,
        email: "x@example.com",
      })
    ).rejects.toThrow(/Admin access required/i);
  });

  it("validate returns invalid for an unknown token", async () => {
    const caller = appRouter.createCaller(adminCtx());
    const result = await caller.collaborators.validate({
      token: "not-a-real-token",
    });
    expect(result.valid).toBe(false);
  });
});

describe("ai router auth", () => {
  it("non-admins cannot generate itineraries", async () => {
    const caller = appRouter.createCaller(clientCtx());
    await expect(
      caller.ai.generateItinerary({ destination: "Bali" })
    ).rejects.toThrow(/Admin access required/i);
  });

  it("clients can use the chatbot", async () => {
    const caller = appRouter.createCaller(clientCtx());
    const result = await caller.ai.chatbot({
      question: "What's the baggage policy?",
    });
    expect(typeof result.reply).toBe("string");
    expect(result.reply.length).toBeGreaterThan(0);
  });
});

describe("flightAlerts auth", () => {
  it("non-admins cannot send flight updates", async () => {
    const caller = appRouter.createCaller(clientCtx());
    await expect(
      caller.flightAlerts.sendUpdate({
        userId: 1,
        flightNumber: "DL123",
        status: "delayed",
        message: "Delayed 30m",
      })
    ).rejects.toThrow(/Admin access required/i);
  });
});
