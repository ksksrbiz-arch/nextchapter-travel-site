/**
 * AI helpers — wraps invokeLLM with graceful fallbacks.
 *
 * All public helpers return well-typed structured data and never throw when
 * the LLM is unavailable. They use deterministic mock generators in tests /
 * environments where OPENAI_API_KEY is not configured, so the rest of the
 * application (and the test suite) keeps working without secrets.
 */

import { invokeLLM } from "./_core/llm";
import { ENV } from "./_core/env";

export type ItineraryGenerationInput = {
  destination: string;
  startDate?: Date | null;
  endDate?: Date | null;
  travelStyle?: string;
  budgetTier?: "budget" | "mid" | "luxury";
  groupSize?: number;
  groupType?: string;
  interests?: string[];
  notes?: string;
};

export type GeneratedItineraryItem = {
  dayNumber: number;
  time?: string;
  title: string;
  description: string;
  location?: string;
  category:
    | "flight"
    | "hotel"
    | "activity"
    | "dining"
    | "transport"
    | "free_time"
    | "other";
};

export type GeneratedItinerary = {
  items: GeneratedItineraryItem[];
  summary: string;
  source: "llm" | "mock";
};

const ITINERARY_SCHEMA = {
  name: "itinerary",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["summary", "items"],
    properties: {
      summary: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["dayNumber", "title", "description", "category"],
          properties: {
            dayNumber: { type: "integer", minimum: 1 },
            time: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            category: {
              type: "string",
              enum: [
                "flight",
                "hotel",
                "activity",
                "dining",
                "transport",
                "free_time",
                "other",
              ],
            },
          },
        },
      },
    },
  },
  strict: true,
};

const dayCount = (start?: Date | null, end?: Date | null): number => {
  if (!start || !end) return 4;
  const ms = end.getTime() - start.getTime();
  const days = Math.max(1, Math.round(ms / (1000 * 60 * 60 * 24)) + 1);
  return Math.min(days, 14);
};

/** Deterministic, dependency-free fallback used when no LLM key is configured. */
export function mockGenerateItinerary(
  input: ItineraryGenerationInput
): GeneratedItinerary {
  const days = dayCount(input.startDate, input.endDate);
  const dest = input.destination || "your destination";
  const items: GeneratedItineraryItem[] = [];
  for (let d = 1; d <= days; d++) {
    if (d === 1) {
      items.push({
        dayNumber: d,
        time: "09:00",
        title: `Arrival in ${dest}`,
        description: `Welcome flight, transfer, and hotel check-in. Light afternoon stroll to settle in.`,
        location: dest,
        category: "flight",
      });
      items.push({
        dayNumber: d,
        time: "18:00",
        title: "Welcome dinner",
        description: "Local cuisine at a chef-curated restaurant.",
        location: dest,
        category: "dining",
      });
    } else if (d === days) {
      items.push({
        dayNumber: d,
        time: "10:00",
        title: "Final morning + departure",
        description: "Check out, last-minute shopping, transfer to airport.",
        location: dest,
        category: "transport",
      });
    } else {
      items.push({
        dayNumber: d,
        time: "09:30",
        title: `${dest} highlights — Day ${d}`,
        description: `A curated activity reflecting your "${input.travelStyle ?? "balanced"}" travel style.`,
        location: dest,
        category: "activity",
      });
      items.push({
        dayNumber: d,
        time: "13:00",
        title: "Local lunch experience",
        description: "Hand-picked spot loved by Jessica's clients.",
        location: dest,
        category: "dining",
      });
      items.push({
        dayNumber: d,
        time: "19:30",
        title: "Evening at leisure",
        description: "Free time to relax or explore at your own pace.",
        location: dest,
        category: "free_time",
      });
    }
  }
  return {
    summary: `${days}-day ${input.budgetTier ?? "mid"}-tier itinerary in ${dest}, designed for ${input.groupType ?? "your group"}.`,
    items,
    source: "mock",
  };
}

export async function generateItinerary(
  input: ItineraryGenerationInput
): Promise<GeneratedItinerary> {
  if (!ENV.forgeApiKey) {
    return mockGenerateItinerary(input);
  }
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a senior travel advisor for Next Chapter Travel. Produce concise, beautifully-written, day-by-day itineraries tailored to client preferences. Always respond as JSON matching the schema.",
        },
        {
          role: "user",
          content: JSON.stringify({
            destination: input.destination,
            startDate: input.startDate?.toISOString() ?? null,
            endDate: input.endDate?.toISOString() ?? null,
            travelStyle: input.travelStyle,
            budgetTier: input.budgetTier,
            groupSize: input.groupSize,
            groupType: input.groupType,
            interests: input.interests,
            notes: input.notes,
          }),
        },
      ],
      outputSchema: ITINERARY_SCHEMA,
    });
    const text = result.choices?.[0]?.message?.content ?? "";
    const parsed = typeof text === "string" ? JSON.parse(text) : null;
    if (
      parsed &&
      Array.isArray(parsed.items) &&
      typeof parsed.summary === "string"
    ) {
      return { ...parsed, source: "llm" } as GeneratedItinerary;
    }
  } catch (error) {
    console.warn("[ai.generateItinerary] LLM failed, using mock:", error);
  }
  return mockGenerateItinerary(input);
}

const PARSE_SCHEMA = {
  name: "parsed_itinerary",
  schema: {
    type: "object",
    additionalProperties: false,
    required: ["destination", "items"],
    properties: {
      destination: { type: "string" },
      tripTitle: { type: "string" },
      startDateIso: { type: "string" },
      endDateIso: { type: "string" },
      items: {
        type: "array",
        items: {
          type: "object",
          additionalProperties: false,
          required: ["dayNumber", "title", "description", "category"],
          properties: {
            dayNumber: { type: "integer", minimum: 1 },
            time: { type: "string" },
            title: { type: "string" },
            description: { type: "string" },
            location: { type: "string" },
            category: {
              type: "string",
              enum: [
                "flight",
                "hotel",
                "activity",
                "dining",
                "transport",
                "free_time",
                "other",
              ],
            },
            confirmationNumber: { type: "string" },
          },
        },
      },
    },
  },
  strict: true,
};

export type ParsedItinerary = {
  destination: string;
  tripTitle?: string;
  startDateIso?: string;
  endDateIso?: string;
  items: Array<
    GeneratedItineraryItem & { confirmationNumber?: string }
  >;
  source: "llm" | "mock";
};

export function mockParseItineraryFromText(text: string): ParsedItinerary {
  // Heuristic fallback: scan for line-by-line "Day N:" patterns
  const lines = text.split(/\r?\n/);
  const items: ParsedItinerary["items"] = [];
  let currentDay = 1;
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    const dayMatch = line.match(/^Day\s+(\d+)\s*:?\s*(.*)$/i);
    if (dayMatch) {
      currentDay = parseInt(dayMatch[1], 10) || currentDay;
      const rest = dayMatch[2]?.trim();
      if (rest && rest.length >= 3) {
        items.push({
          dayNumber: currentDay,
          title: rest.slice(0, 80),
          description: rest,
          category: /flight|airport|airline/i.test(rest)
            ? "flight"
            : /hotel|resort|check.?in/i.test(rest)
              ? "hotel"
              : /dinner|lunch|breakfast|restaurant/i.test(rest)
                ? "dining"
                : /transfer|car|train|bus|taxi/i.test(rest)
                  ? "transport"
                  : "activity",
        });
      }
      continue;
    }
    if (line.length < 6) continue;
    items.push({
      dayNumber: currentDay,
      title: line.slice(0, 80),
      description: line,
      category: /flight|airport|airline/i.test(line)
        ? "flight"
        : /hotel|resort|check.?in/i.test(line)
          ? "hotel"
          : /dinner|lunch|breakfast|restaurant/i.test(line)
            ? "dining"
            : /transfer|car|train|bus|taxi/i.test(line)
              ? "transport"
              : "activity",
    });
  }
  if (items.length === 0) {
    items.push({
      dayNumber: 1,
      title: "Imported note",
      description: text.slice(0, 240),
      category: "other",
    });
  }
  // Try to detect a destination from the first line that looks like a place name
  const destMatch = text.match(
    /(?:to|in|destination[:\s]+)\s*([A-Z][A-Za-z\s,]{2,40})/
  );
  return {
    destination: destMatch?.[1]?.trim() ?? "Imported Trip",
    tripTitle: undefined,
    items,
    source: "mock",
  };
}

export async function parseItineraryFromText(
  text: string
): Promise<ParsedItinerary> {
  const truncated = text.slice(0, 12000);
  if (!ENV.forgeApiKey) {
    return mockParseItineraryFromText(truncated);
  }
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are an itinerary parser. The user will paste raw text from a travel email or PDF. Extract the destination, optional trip title, optional start/end ISO dates, and a structured list of itinerary items grouped by day. Always respond as JSON matching the schema.",
        },
        { role: "user", content: truncated },
      ],
      outputSchema: PARSE_SCHEMA,
    });
    const out = result.choices?.[0]?.message?.content ?? "";
    const parsed = typeof out === "string" ? JSON.parse(out) : null;
    if (parsed && Array.isArray(parsed.items)) {
      return { ...parsed, source: "llm" } as ParsedItinerary;
    }
  } catch (error) {
    console.warn("[ai.parseItineraryFromText] LLM failed, using mock:", error);
  }
  return mockParseItineraryFromText(truncated);
}

export type Suggestion = {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function mockSuggestions(
  context: { destination?: string; daysUntilTrip?: number | null } = {}
): Suggestion[] {
  const suggestions: Suggestion[] = [];
  const days = context.daysUntilTrip;
  if (typeof days === "number") {
    if (days <= 7 && days >= 0) {
      suggestions.push({
        title: "Final-week checklist",
        description:
          "You're days away from your trip — let's confirm your packing list and travel documents are in order.",
        ctaLabel: "Review packing list",
        ctaHref: "/portal/packing",
      });
    } else if (days <= 30 && days > 7) {
      suggestions.push({
        title: "Three weeks out",
        description:
          "Now is the perfect time to confirm visa requirements and lock in any remaining activity bookings.",
        ctaLabel: "Visa checklist",
        ctaHref: "/portal/visa",
      });
    }
  }
  if (context.destination) {
    suggestions.push({
      title: `Top experiences in ${context.destination}`,
      description: `Curated dining, activities, and hidden gems hand-picked for ${context.destination}.`,
      ctaLabel: "View destination guide",
      ctaHref: "/portal/guides",
    });
  }
  if (suggestions.length === 0) {
    suggestions.push({
      title: "Plan your next chapter",
      description:
        "Tell us where you'd love to go next — Jessica will craft a custom proposal.",
      ctaLabel: "Plan my trip",
      ctaHref: "/plan-my-trip",
    });
  }
  return suggestions;
}

export async function getPersonalizedSuggestions(
  events: Array<{ eventType: string; payload: unknown }>,
  context: { destination?: string; daysUntilTrip?: number | null }
): Promise<Suggestion[]> {
  // Fast path: no events or no LLM key — deterministic
  if (!ENV.forgeApiKey || events.length === 0) {
    return mockSuggestions(context);
  }
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are a behavior-driven travel concierge. Given a user's recent in-app events and trip context, produce 1-3 short proactive suggestion cards. Respond as JSON: {\"suggestions\":[{\"title\":\"\",\"description\":\"\",\"ctaLabel\":\"\",\"ctaHref\":\"\"}]}",
        },
        {
          role: "user",
          content: JSON.stringify({ events: events.slice(0, 25), context }),
        },
      ],
      responseFormat: { type: "json_object" },
    });
    const raw = result.choices?.[0]?.message?.content ?? "";
    const parsed = typeof raw === "string" ? JSON.parse(raw) : null;
    if (parsed && Array.isArray(parsed.suggestions)) {
      return parsed.suggestions as Suggestion[];
    }
  } catch (error) {
    console.warn(
      "[ai.getPersonalizedSuggestions] LLM failed, using mock:",
      error
    );
  }
  return mockSuggestions(context);
}

export type ChatbotReply = {
  reply: string;
  suggestEscalation: boolean;
  source: "llm" | "mock";
};

const ESCALATION_PATTERNS =
  /(speak|talk).*(jessica|agent|human)|cancel|refund|emergency|urgent|complain/i;

export function mockChatbotReply(question: string): ChatbotReply {
  const q = question.toLowerCase();
  const escalate = ESCALATION_PATTERNS.test(question);
  if (q.includes("visa")) {
    return {
      reply:
        "Visa requirements vary by destination and passport. Most US travelers can use the eVisa or visa-on-arrival systems for popular destinations — check your portal's Visa Checklist page or message Jessica for specifics.",
      suggestEscalation: escalate,
      source: "mock",
    };
  }
  if (q.includes("baggage") || q.includes("luggage")) {
    return {
      reply:
        "Most US carriers allow 1 carry-on (22\"×14\"×9\") and 1 personal item free; checked bag fees vary ($30–$50 first, $40–$75 second). Always confirm with your specific airline and fare class.",
      suggestEscalation: escalate,
      source: "mock",
    };
  }
  if (q.includes("cancel")) {
    return {
      reply:
        "Cancellation rules depend on your booking type and travel insurance. The fastest way to start a cancellation is to message Jessica directly — she can review your options and process refunds where possible.",
      suggestEscalation: true,
      source: "mock",
    };
  }
  if (q.includes("pack")) {
    return {
      reply:
        "Use your portal's Packing List to track essentials. Pro tip: pack a change of clothes and any prescriptions in your carry-on in case checked bags are delayed.",
      suggestEscalation: escalate,
      source: "mock",
    };
  }
  return {
    reply:
      "I'm Next Chapter Travel's 24/7 assistant. I can help with FAQs about visas, baggage, packing, and routine travel questions. For booking changes or anything urgent, tap \"Talk to Jessica\".",
    suggestEscalation: escalate,
    source: "mock",
  };
}

export async function chatbotQuery(
  question: string,
  conversationHistory: Array<{ role: "user" | "assistant"; content: string }> = []
): Promise<ChatbotReply> {
  const escalate = ESCALATION_PATTERNS.test(question);
  if (!ENV.forgeApiKey) {
    return mockChatbotReply(question);
  }
  try {
    const result = await invokeLLM({
      messages: [
        {
          role: "system",
          content:
            "You are Next Chapter Travel's 24/7 client-portal assistant for Jessica Seiders' clients. Answer travel FAQs concisely (visa, baggage, cancellation, packing, weather, currency). Never quote prices or confirmations. For booking changes or urgent issues, recommend the user tap \"Talk to Jessica\". Keep replies under 90 words.",
        },
        ...conversationHistory.slice(-6).map(m => ({
          role: m.role,
          content: m.content,
        })),
        { role: "user", content: question },
      ],
    });
    const reply = result.choices?.[0]?.message?.content ?? "";
    if (typeof reply === "string" && reply.trim().length > 0) {
      return { reply, suggestEscalation: escalate, source: "llm" };
    }
  } catch (error) {
    console.warn("[ai.chatbotQuery] LLM failed, using mock:", error);
  }
  return mockChatbotReply(question);
}
