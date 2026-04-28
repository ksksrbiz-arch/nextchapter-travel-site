/**
 * TripBuilderWizard.tsx
 *
 * 5-step wizard for creating a complete trip end-to-end:
 *   Step 1: Client + Destination
 *   Step 2: Dates + Notes
 *   Step 3: Itinerary Items
 *   Step 4: Packing List
 *   Step 5: Bookings
 */

import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useLocation, useSearch } from "wouter";
import { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  MapPin,
  Calendar,
  CheckSquare,
  Plane,
  Users,
  Plus,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Check,
  Loader2,
  Luggage,
  Hotel,
  Utensils,
  Car,
  Clock,
  Mountain,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type ItineraryDraft = {
  id: string;
  dayNumber: number;
  time: string;
  title: string;
  description: string;
  location: string;
  category:
    | "flight"
    | "hotel"
    | "activity"
    | "dining"
    | "transport"
    | "free_time"
    | "other";
};

type PackingDraft = {
  id: string;
  name: string;
  category: string;
  quantity: number;
  notes: string;
};

type BookingDraft = {
  id: string;
  type:
    | "flight"
    | "hotel"
    | "car_rental"
    | "tour"
    | "cruise"
    | "transfer"
    | "other";
  title: string;
  provider: string;
  confirmationNumber: string;
  checkIn: string;
  checkOut: string;
  amount: string;
  currency: string;
  notes: string;
};

const STEPS = [
  { id: 1, label: "Client & Destination", icon: Users },
  { id: 2, label: "Dates & Notes", icon: Calendar },
  { id: 3, label: "Itinerary", icon: MapPin },
  { id: 4, label: "Packing List", icon: CheckSquare },
  { id: 5, label: "Bookings", icon: Plane },
];

const ITINERARY_CATEGORIES = [
  { value: "flight", label: "Flight", icon: Plane },
  { value: "hotel", label: "Hotel", icon: Hotel },
  { value: "activity", label: "Activity", icon: Mountain },
  { value: "dining", label: "Dining", icon: Utensils },
  { value: "transport", label: "Transport", icon: Car },
  { value: "free_time", label: "Free Time", icon: Clock },
  { value: "other", label: "Other", icon: MapPin },
] as const;

const PACKING_CATEGORIES = [
  "Clothing",
  "Toiletries",
  "Electronics",
  "Documents",
  "Health & Safety",
  "Entertainment",
  "Snacks & Food",
  "Baby & Kids",
  "Sports & Outdoor",
  "Other",
];

const BOOKING_TYPES = [
  { value: "flight", label: "Flight" },
  { value: "hotel", label: "Hotel" },
  { value: "car_rental", label: "Car Rental" },
  { value: "tour", label: "Tour / Activity" },
  { value: "cruise", label: "Cruise" },
  { value: "transfer", label: "Transfer" },
  { value: "other", label: "Other" },
] as const;

function uid() {
  return Math.random().toString(36).slice(2, 10);
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

function StepProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        {STEPS.map((step, i) => {
          const done = currentStep > step.id;
          const active = currentStep === step.id;
          return (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-sans font-semibold transition-all",
                    done
                      ? "bg-green-500 text-white"
                      : active
                        ? "bg-primary text-primary-foreground ring-4 ring-primary/20"
                        : "bg-muted text-muted-foreground"
                  )}
                >
                  {done ? <Check className="w-4 h-4" /> : step.id}
                </div>
                <span
                  className={cn(
                    "mt-1.5 text-xs font-sans text-center leading-tight hidden sm:block",
                    active
                      ? "text-primary font-semibold"
                      : done
                        ? "text-green-600"
                        : "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-2 mt-[-18px]",
                    done ? "bg-green-400" : "bg-border"
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Step 1: Client + Destination ─────────────────────────────────────────────

function Step1({
  form,
  setForm,
  defaultClientId,
}: {
  form: { userId: string; title: string; destination: string };
  setForm: (f: typeof form) => void;
  defaultClientId?: number;
}) {
  const { data: clients } = trpc.admin.clients.useQuery();

  return (
    <div className="space-y-5">
      <div>
        <Label className="font-sans text-sm font-medium">Client *</Label>
        <Select
          value={form.userId}
          onValueChange={v => setForm({ ...form, userId: v })}
        >
          <SelectTrigger className="mt-1.5 font-sans">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            {clients?.map(c => (
              <SelectItem key={c.id} value={String(c.id)} className="font-sans">
                {c.name ?? c.email ?? `User #${c.id}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-sans text-sm font-medium">Trip Title *</Label>
        <Input
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
          placeholder="e.g. Walt Disney World Family Vacation 2025"
          className="mt-1.5 font-sans"
        />
      </div>

      <div>
        <Label className="font-sans text-sm font-medium">Destination *</Label>
        <div className="relative mt-1.5">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={form.destination}
            onChange={e => setForm({ ...form, destination: e.target.value })}
            placeholder="e.g. Orlando, Florida"
            className="pl-9 font-sans"
          />
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Dates + Notes ────────────────────────────────────────────────────

function Step2({
  form,
  setForm,
}: {
  form: {
    startDate: string;
    endDate: string;
    status: string;
    notes: string;
    confirmationCode: string;
    coverImageUrl: string;
  };
  setForm: (f: typeof form) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label className="font-sans text-sm font-medium">Start Date</Label>
          <Input
            type="date"
            value={form.startDate}
            onChange={e => setForm({ ...form, startDate: e.target.value })}
            className="mt-1.5 font-sans"
          />
        </div>
        <div>
          <Label className="font-sans text-sm font-medium">End Date</Label>
          <Input
            type="date"
            value={form.endDate}
            onChange={e => setForm({ ...form, endDate: e.target.value })}
            className="mt-1.5 font-sans"
          />
        </div>
      </div>

      <div>
        <Label className="font-sans text-sm font-medium">Status</Label>
        <Select
          value={form.status}
          onValueChange={v => setForm({ ...form, status: v })}
        >
          <SelectTrigger className="mt-1.5 font-sans">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {["planning", "confirmed", "active", "completed", "cancelled"].map(
              s => (
                <SelectItem key={s} value={s} className="font-sans capitalize">
                  {s}
                </SelectItem>
              )
            )}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="font-sans text-sm font-medium">
          Confirmation Code
        </Label>
        <Input
          value={form.confirmationCode}
          onChange={e => setForm({ ...form, confirmationCode: e.target.value })}
          placeholder="e.g. NCT-2025-001"
          className="mt-1.5 font-sans"
        />
      </div>

      <div>
        <Label className="font-sans text-sm font-medium">
          Cover Image URL (optional)
        </Label>
        <Input
          value={form.coverImageUrl}
          onChange={e => setForm({ ...form, coverImageUrl: e.target.value })}
          placeholder="https://..."
          className="mt-1.5 font-sans"
        />
      </div>

      <div>
        <Label className="font-sans text-sm font-medium">
          Notes for Client
        </Label>
        <Textarea
          value={form.notes}
          onChange={e => setForm({ ...form, notes: e.target.value })}
          placeholder="Any special notes, reminders, or welcome message for the client..."
          rows={4}
          className="mt-1.5 font-sans resize-none"
        />
      </div>
    </div>
  );
}

// ─── Step 3: Itinerary ────────────────────────────────────────────────────────

function Step3({
  items,
  setItems,
  destination,
  startDate,
  endDate,
}: {
  items: ItineraryDraft[];
  setItems: (items: ItineraryDraft[]) => void;
  destination?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [newItem, setNewItem] = useState<Omit<ItineraryDraft, "id">>({
    dayNumber: 1,
    time: "",
    title: "",
    description: "",
    location: "",
    category: "activity",
  });
  // ─── AI Trip Genius ───────────────────────────────────────────────────────
  const [travelStyle, setTravelStyle] = useState("balanced");
  const [budgetTier, setBudgetTier] = useState<"budget" | "mid" | "luxury">(
    "mid"
  );
  const [groupSize, setGroupSize] = useState<number>(2);
  const [aiSource, setAiSource] = useState<"llm" | "mock" | null>(null);

  const generate = trpc.ai.generateItinerary.useMutation({
    onSuccess: data => {
      const drafts: ItineraryDraft[] = data.items.map(it => ({
        id: uid(),
        dayNumber: it.dayNumber,
        time: it.time ?? "",
        title: it.title,
        description: it.description ?? "",
        location: it.location ?? "",
        category: it.category,
      }));
      setItems([...items, ...drafts]);
      setAiSource(data.source);
      toast.success(
        `AI added ${drafts.length} items${data.source === "mock" ? " (mock)" : ""}`
      );
    },
    onError: e => toast.error(e.message),
  });

  const runGenius = () => {
    if (!destination?.trim()) {
      toast.error("Set a destination in Step 1 first");
      return;
    }
    generate.mutate({
      destination,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
      travelStyle,
      budgetTier,
      groupSize,
    });
  };

  const addItem = () => {
    if (!newItem.title) {
      toast.error("Title is required");
      return;
    }
    setItems([...items, { ...newItem, id: uid() }]);
    setNewItem({
      dayNumber: newItem.dayNumber,
      time: "",
      title: "",
      description: "",
      location: "",
      category: "activity",
    });
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const byDay = items.reduce<Record<number, ItineraryDraft[]>>((acc, item) => {
    if (!acc[item.dayNumber]) acc[item.dayNumber] = [];
    acc[item.dayNumber].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      {/* AI Trip Genius panel */}
      <Card className="border border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-sans font-semibold text-foreground flex items-center gap-2">
              <Mountain className="w-4 h-4 text-primary" />
              AI Trip Genius
              {aiSource && (
                <Badge
                  variant="outline"
                  className={
                    aiSource === "llm"
                      ? "border-primary text-primary"
                      : "border-amber-500 text-amber-700"
                  }
                >
                  {aiSource === "llm" ? "AI generated" : "Mock fallback"}
                </Badge>
              )}
            </p>
            <span className="text-xs text-muted-foreground font-sans">
              Generates day-by-day items from client preferences.
            </span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <Label className="font-sans text-xs">Travel style</Label>
              <Select value={travelStyle} onValueChange={setTravelStyle}>
                <SelectTrigger className="mt-1 h-8 text-sm font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[
                    "balanced",
                    "adventurous",
                    "relaxing",
                    "cultural",
                    "foodie",
                    "luxury",
                    "family",
                  ].map(s => (
                    <SelectItem key={s} value={s} className="capitalize">
                      {s}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-sans text-xs">Budget tier</Label>
              <Select
                value={budgetTier}
                onValueChange={v =>
                  setBudgetTier(v as "budget" | "mid" | "luxury")
                }
              >
                <SelectTrigger className="mt-1 h-8 text-sm font-sans">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="budget">Budget</SelectItem>
                  <SelectItem value="mid">Mid</SelectItem>
                  <SelectItem value="luxury">Luxury</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-sans text-xs">Group size</Label>
              <Input
                type="number"
                min={1}
                value={groupSize}
                onChange={e =>
                  setGroupSize(Math.max(1, Number(e.target.value) || 1))
                }
                className="mt-1 h-8 text-sm font-sans"
              />
            </div>
            <div className="flex items-end">
              <Button
                type="button"
                onClick={runGenius}
                disabled={generate.isPending}
                className="w-full h-8 font-sans"
                size="sm"
              >
                {generate.isPending ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" />
                ) : (
                  <Mountain className="w-3.5 h-3.5 mr-1" />
                )}
                Generate
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add form */}
      <Card className="border-dashed border-2 border-primary/30">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-sans font-semibold text-foreground">
            Add Itinerary Item
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-sans text-xs">Day #</Label>
              <Input
                type="number"
                min={1}
                value={newItem.dayNumber}
                onChange={e =>
                  setNewItem(n => ({ ...n, dayNumber: Number(e.target.value) }))
                }
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
            <div>
              <Label className="font-sans text-xs">Time (optional)</Label>
              <Input
                type="time"
                value={newItem.time}
                onChange={e =>
                  setNewItem(n => ({ ...n, time: e.target.value }))
                }
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="font-sans text-xs">Category</Label>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {ITINERARY_CATEGORIES.map(cat => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() =>
                    setNewItem(n => ({
                      ...n,
                      category: cat.value as ItineraryDraft["category"],
                    }))
                  }
                  className={cn(
                    "px-2.5 py-1 rounded-full text-xs font-sans border transition-all",
                    newItem.category === cat.value
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-background text-muted-foreground border-border hover:border-primary/50"
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <Label className="font-sans text-xs">Title *</Label>
            <Input
              value={newItem.title}
              onChange={e => setNewItem(n => ({ ...n, title: e.target.value }))}
              placeholder="e.g. Check-in at Disney's Polynesian Resort"
              className="mt-1 font-sans h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-sans text-xs">Location</Label>
              <Input
                value={newItem.location}
                onChange={e =>
                  setNewItem(n => ({ ...n, location: e.target.value }))
                }
                placeholder="e.g. Magic Kingdom"
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
            <div>
              <Label className="font-sans text-xs">Description</Label>
              <Input
                value={newItem.description}
                onChange={e =>
                  setNewItem(n => ({ ...n, description: e.target.value }))
                }
                placeholder="Optional details"
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={addItem}
            size="sm"
            className="w-full font-sans bg-primary text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Item
          </Button>
        </CardContent>
      </Card>

      {/* Items by day */}
      {Object.keys(byDay).length === 0 && (
        <p className="text-center text-muted-foreground font-sans text-sm py-6">
          No itinerary items yet. Add your first item above — or skip this step
          and add items later.
        </p>
      )}
      {Object.entries(byDay)
        .sort(([a], [b]) => Number(a) - Number(b))
        .map(([day, dayItems]) => (
          <div key={day}>
            <h4 className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Day {day}
            </h4>
            <div className="space-y-2">
              {dayItems.map(item => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="outline"
                        className="text-xs font-sans capitalize"
                      >
                        {item.category}
                      </Badge>
                      {item.time && (
                        <span className="text-xs text-muted-foreground font-sans">
                          {item.time}
                        </span>
                      )}
                    </div>
                    <p className="font-sans text-sm font-medium text-foreground mt-0.5 truncate">
                      {item.title}
                    </p>
                    {item.location && (
                      <p className="text-xs text-muted-foreground font-sans truncate">
                        {item.location}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="text-muted-foreground hover:text-destructive transition-colors flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
    </div>
  );
}

// ─── Step 4: Packing List ─────────────────────────────────────────────────────

function Step4({
  items,
  setItems,
}: {
  items: PackingDraft[];
  setItems: (items: PackingDraft[]) => void;
}) {
  const [newItem, setNewItem] = useState<Omit<PackingDraft, "id">>({
    name: "",
    category: "Clothing",
    quantity: 1,
    notes: "",
  });

  const addItem = () => {
    if (!newItem.name) {
      toast.error("Item name is required");
      return;
    }
    setItems([...items, { ...newItem, id: uid() }]);
    setNewItem({
      name: "",
      category: newItem.category,
      quantity: 1,
      notes: "",
    });
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  const byCategory = items.reduce<Record<string, PackingDraft[]>>(
    (acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    },
    {}
  );

  return (
    <div className="space-y-5">
      <Card className="border-dashed border-2 border-primary/30">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-sans font-semibold text-foreground">
            Add Packing Item
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-sans text-xs">Item Name *</Label>
              <Input
                value={newItem.name}
                onChange={e =>
                  setNewItem(n => ({ ...n, name: e.target.value }))
                }
                placeholder="e.g. Sunscreen SPF 50"
                className="mt-1 font-sans h-8 text-sm"
                onKeyDown={e => e.key === "Enter" && addItem()}
              />
            </div>
            <div>
              <Label className="font-sans text-xs">Quantity</Label>
              <Input
                type="number"
                min={1}
                value={newItem.quantity}
                onChange={e =>
                  setNewItem(n => ({ ...n, quantity: Number(e.target.value) }))
                }
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="font-sans text-xs">Category</Label>
            <Select
              value={newItem.category}
              onValueChange={v => setNewItem(n => ({ ...n, category: v }))}
            >
              <SelectTrigger className="mt-1 font-sans h-8 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PACKING_CATEGORIES.map(c => (
                  <SelectItem key={c} value={c} className="font-sans text-sm">
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            type="button"
            onClick={addItem}
            size="sm"
            className="w-full font-sans bg-primary text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Item
          </Button>
        </CardContent>
      </Card>

      {Object.keys(byCategory).length === 0 && (
        <p className="text-center text-muted-foreground font-sans text-sm py-6">
          No packing items yet. Add items above — or skip and add later.
        </p>
      )}
      {Object.entries(byCategory).map(([cat, catItems]) => (
        <div key={cat}>
          <h4 className="font-sans text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {cat}
          </h4>
          <div className="space-y-1.5">
            {catItems.map(item => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-2.5 bg-muted/40 rounded-lg"
              >
                <div className="flex-1 min-w-0">
                  <span className="font-sans text-sm text-foreground">
                    {item.name}
                  </span>
                  {item.quantity > 1 && (
                    <span className="ml-2 text-xs text-muted-foreground font-sans">
                      ×{item.quantity}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step 5: Bookings ─────────────────────────────────────────────────────────

function Step5({
  items,
  setItems,
  destination,
  startDate,
  endDate,
}: {
  items: BookingDraft[];
  setItems: (items: BookingDraft[]) => void;
  destination?: string;
  startDate?: string;
  endDate?: string;
}) {
  const [newItem, setNewItem] = useState<Omit<BookingDraft, "id">>({
    type: "flight",
    title: "",
    provider: "",
    confirmationNumber: "",
    checkIn: "",
    checkOut: "",
    amount: "",
    currency: "USD",
    notes: "",
  });

  // GDS Live Search state
  const [gdsTab, setGdsTab] = useState<"flights" | "hotels">("flights");
  const [origin, setOrigin] = useState("");
  const flightSearch = trpc.gds.searchFlights.useQuery(
    {
      origin: origin || "JFK",
      destination: (destination || "MCO").slice(0, 3).toUpperCase(),
      departureDate: startDate || new Date().toISOString().slice(0, 10),
      returnDate: endDate,
    },
    { enabled: false }
  );
  const hotelSearch = trpc.gds.searchHotels.useQuery(
    {
      city: destination || "",
      checkIn: startDate || new Date().toISOString().slice(0, 10),
      checkOut:
        endDate ||
        new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
    },
    { enabled: false }
  );
  const [searched, setSearched] = useState(false);

  const runSearch = () => {
    setSearched(true);
    if (gdsTab === "flights") flightSearch.refetch();
    else hotelSearch.refetch();
  };

  const addItem = () => {
    if (!newItem.title) {
      toast.error("Booking title is required");
      return;
    }
    setItems([...items, { ...newItem, id: uid() }]);
    setNewItem({
      type: newItem.type,
      title: "",
      provider: "",
      confirmationNumber: "",
      checkIn: "",
      checkOut: "",
      amount: "",
      currency: "USD",
      notes: "",
    });
  };

  const removeItem = (id: string) => setItems(items.filter(i => i.id !== id));

  return (
    <div className="space-y-5">
      {/* GDS Live Search */}
      <Card className="border border-primary/40 bg-gradient-to-br from-primary/5 to-secondary/5">
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <p className="text-sm font-sans font-semibold flex items-center gap-2">
              <Plane className="w-4 h-4 text-primary" /> GDS Live Search
            </p>
            <Badge variant="outline" className="text-xs">
              Sabre · cached 5 min
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              type="button"
              size="sm"
              variant={gdsTab === "flights" ? "default" : "outline"}
              onClick={() => setGdsTab("flights")}
            >
              Flights
            </Button>
            <Button
              type="button"
              size="sm"
              variant={gdsTab === "hotels" ? "default" : "outline"}
              onClick={() => setGdsTab("hotels")}
            >
              Hotels
            </Button>
          </div>
          {gdsTab === "flights" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div>
                <Label className="font-sans text-xs">Origin (IATA)</Label>
                <Input
                  value={origin}
                  onChange={e => setOrigin(e.target.value.toUpperCase())}
                  placeholder="JFK"
                  className="mt-1 h-8 text-sm font-sans uppercase"
                />
              </div>
              <div>
                <Label className="font-sans text-xs">Destination</Label>
                <Input
                  value={destination ?? ""}
                  readOnly
                  className="mt-1 h-8 text-sm font-sans bg-muted"
                />
              </div>
              <div>
                <Label className="font-sans text-xs">Depart</Label>
                <Input
                  value={startDate ?? ""}
                  readOnly
                  className="mt-1 h-8 text-sm font-sans bg-muted"
                />
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  type="button"
                  className="w-full h-8 font-sans"
                  onClick={runSearch}
                  disabled={flightSearch.isFetching}
                >
                  {flightSearch.isFetching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          )}
          {gdsTab === "hotels" && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div className="md:col-span-2">
                <Label className="font-sans text-xs">City</Label>
                <Input
                  value={destination ?? ""}
                  readOnly
                  className="mt-1 h-8 text-sm font-sans bg-muted"
                />
              </div>
              <div>
                <Label className="font-sans text-xs">Check-in</Label>
                <Input
                  value={startDate ?? ""}
                  readOnly
                  className="mt-1 h-8 text-sm font-sans bg-muted"
                />
              </div>
              <div className="flex items-end">
                <Button
                  size="sm"
                  type="button"
                  className="w-full h-8 font-sans"
                  onClick={runSearch}
                  disabled={hotelSearch.isFetching}
                >
                  {hotelSearch.isFetching ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    "Search"
                  )}
                </Button>
              </div>
            </div>
          )}
          {searched &&
            gdsTab === "flights" &&
            !flightSearch.isFetching &&
            (flightSearch.data?.length ?? 0) > 0 && (
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {flightSearch.data!.map(o => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg border border-border bg-card"
                  >
                    <div className="min-w-0 text-sm font-sans">
                      <span className="font-semibold">
                        {o.airline.name} {o.flightNumber}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {o.origin} → {o.destination} ·{" "}
                        {o.stops === 0 ? "Direct" : `${o.stops} stop`}
                      </span>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(o.durationMinutes / 60)}h{" "}
                        {o.durationMinutes % 60}m · {o.cabin} ·{" "}
                        {o.carbonKg} kg CO₂
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="font-serif font-semibold">
                        ${o.priceUsd}
                      </span>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setItems([
                            ...items,
                            {
                              id: uid(),
                              type: "flight",
                              title: `${o.airline.name} ${o.flightNumber}`,
                              provider: o.airline.name,
                              confirmationNumber: "",
                              checkIn: o.departureIso.slice(0, 10),
                              checkOut: o.arrivalIso.slice(0, 10),
                              amount: String(o.priceUsd),
                              currency: "USD",
                              notes: `${o.origin}→${o.destination} · ${o.cabin}`,
                            },
                          ]);
                          toast.success("Added to bookings");
                        }}
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          {searched &&
            gdsTab === "hotels" &&
            !hotelSearch.isFetching &&
            (hotelSearch.data?.length ?? 0) > 0 && (
              <div className="space-y-1.5 max-h-72 overflow-y-auto">
                {hotelSearch.data!.map(o => (
                  <div
                    key={o.id}
                    className="flex items-center justify-between gap-3 p-2 rounded-lg border border-border bg-card"
                  >
                    <div className="min-w-0 text-sm font-sans">
                      <span className="font-semibold">{o.name}</span>
                      <span className="text-muted-foreground ml-2">
                        {"★".repeat(o.starRating)}
                      </span>
                      {o.ecoCertified && (
                        <Badge className="ml-2 bg-emerald-100 text-emerald-800 border-0 text-[10px]">
                          Eco
                        </Badge>
                      )}
                      <div className="text-xs text-muted-foreground">
                        ${o.pricePerNightUsd}/night · ${o.totalPriceUsd} total
                      </div>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setItems([
                          ...items,
                          {
                            id: uid(),
                            type: "hotel",
                            title: o.name,
                            provider: o.vendor,
                            confirmationNumber: "",
                            checkIn: startDate ?? "",
                            checkOut: endDate ?? "",
                            amount: String(o.totalPriceUsd),
                            currency: "USD",
                            notes: o.ecoCertified
                              ? "Eco-certified property"
                              : "",
                          },
                        ]);
                        toast.success("Added to bookings");
                      }}
                    >
                      Add
                    </Button>
                  </div>
                ))}
              </div>
            )}
          {searched &&
            ((gdsTab === "flights" && flightSearch.data?.length === 0) ||
              (gdsTab === "hotels" && hotelSearch.data?.length === 0)) && (
              <p className="text-xs text-muted-foreground">No results.</p>
            )}
        </CardContent>
      </Card>

      <Card className="border-dashed border-2 border-primary/30">
        <CardContent className="p-4 space-y-3">
          <p className="text-sm font-sans font-semibold text-foreground">
            Add Booking
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-sans text-xs">Type</Label>
              <Select
                value={newItem.type}
                onValueChange={v =>
                  setNewItem(n => ({ ...n, type: v as BookingDraft["type"] }))
                }
              >
                <SelectTrigger className="mt-1 font-sans h-8 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {BOOKING_TYPES.map(t => (
                    <SelectItem
                      key={t.value}
                      value={t.value}
                      className="font-sans text-sm"
                    >
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-sans text-xs">Confirmation #</Label>
              <Input
                value={newItem.confirmationNumber}
                onChange={e =>
                  setNewItem(n => ({
                    ...n,
                    confirmationNumber: e.target.value,
                  }))
                }
                placeholder="e.g. ABC123"
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
          </div>
          <div>
            <Label className="font-sans text-xs">Title *</Label>
            <Input
              value={newItem.title}
              onChange={e => setNewItem(n => ({ ...n, title: e.target.value }))}
              placeholder="e.g. Delta Airlines DL 1234 — MCO to JFK"
              className="mt-1 font-sans h-8 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-sans text-xs">Provider</Label>
              <Input
                value={newItem.provider}
                onChange={e =>
                  setNewItem(n => ({ ...n, provider: e.target.value }))
                }
                placeholder="e.g. Delta Airlines"
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
            <div>
              <Label className="font-sans text-xs">Amount</Label>
              <div className="flex gap-1 mt-1">
                <Select
                  value={newItem.currency}
                  onValueChange={v => setNewItem(n => ({ ...n, currency: v }))}
                >
                  <SelectTrigger className="w-20 font-sans h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["USD", "EUR", "GBP", "CAD", "AUD"].map(c => (
                      <SelectItem
                        key={c}
                        value={c}
                        className="font-sans text-sm"
                      >
                        {c}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  min={0}
                  step="0.01"
                  value={newItem.amount}
                  onChange={e =>
                    setNewItem(n => ({ ...n, amount: e.target.value }))
                  }
                  placeholder="0.00"
                  className="flex-1 font-sans h-8 text-sm"
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="font-sans text-xs">Check-in / Departure</Label>
              <Input
                type="date"
                value={newItem.checkIn}
                onChange={e =>
                  setNewItem(n => ({ ...n, checkIn: e.target.value }))
                }
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
            <div>
              <Label className="font-sans text-xs">Check-out / Return</Label>
              <Input
                type="date"
                value={newItem.checkOut}
                onChange={e =>
                  setNewItem(n => ({ ...n, checkOut: e.target.value }))
                }
                className="mt-1 font-sans h-8 text-sm"
              />
            </div>
          </div>
          <Button
            type="button"
            onClick={addItem}
            size="sm"
            className="w-full font-sans bg-primary text-primary-foreground"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Booking
          </Button>
        </CardContent>
      </Card>

      {items.length === 0 && (
        <p className="text-center text-muted-foreground font-sans text-sm py-6">
          No bookings yet. Add them above — or skip and add later.
        </p>
      )}
      <div className="space-y-2">
        {items.map(item => (
          <div
            key={item.id}
            className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="text-xs font-sans capitalize"
                >
                  {item.type.replace("_", " ")}
                </Badge>
                {item.confirmationNumber && (
                  <span className="text-xs text-muted-foreground font-mono">
                    {item.confirmationNumber}
                  </span>
                )}
              </div>
              <p className="font-sans text-sm font-medium text-foreground mt-0.5 truncate">
                {item.title}
              </p>
              {item.provider && (
                <p className="text-xs text-muted-foreground font-sans">
                  {item.provider}
                </p>
              )}
            </div>
            {item.amount && (
              <span className="text-sm font-sans font-semibold text-foreground flex-shrink-0">
                {item.currency}{" "}
                {Number(item.amount).toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </span>
            )}
            <button
              type="button"
              onClick={() => removeItem(item.id)}
              className="text-muted-foreground hover:text-destructive flex-shrink-0"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Wizard ──────────────────────────────────────────────────────────────

export default function TripBuilderWizard() {
  const [, navigate] = useLocation();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const defaultClientId = params.get("client")
    ? Number(params.get("client"))
    : undefined;

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Step 1 state
  const [step1, setStep1] = useState({
    userId: defaultClientId?.toString() ?? "",
    title: "",
    destination: "",
  });
  // Step 2 state
  const [step2, setStep2] = useState({
    startDate: "",
    endDate: "",
    status: "planning",
    notes: "",
    confirmationCode: "",
    coverImageUrl: "",
  });
  // Step 3 state
  const [itinerary, setItinerary] = useState<ItineraryDraft[]>([]);
  // Step 4 state
  const [packing, setPacking] = useState<PackingDraft[]>([]);
  // Step 5 state
  const [bookings, setBookings] = useState<BookingDraft[]>([]);

  const utils = trpc.useUtils();
  const createTrip = trpc.trips.create.useMutation();
  const createItineraryItem = trpc.itinerary.create.useMutation();
  const createPackingItem = trpc.packing.create.useMutation();
  const createBooking = trpc.bookings.create.useMutation();

  const canAdvance = useMemo(() => {
    if (step === 1)
      return !!step1.userId && !!step1.title && !!step1.destination;
    return true;
  }, [step, step1]);

  const handleNext = () => {
    if (!canAdvance) {
      toast.error("Please fill in all required fields");
      return;
    }
    setStep(s => Math.min(s + 1, 5));
  };

  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = async () => {
    if (!step1.userId || !step1.title || !step1.destination) {
      toast.error("Client, title, and destination are required");
      setStep(1);
      return;
    }

    setSaving(true);
    try {
      // 1. Create the trip
      const trip = await createTrip.mutateAsync({
        userId: Number(step1.userId),
        title: step1.title,
        destination: step1.destination,
        startDate: step2.startDate ? new Date(step2.startDate) : undefined,
        endDate: step2.endDate ? new Date(step2.endDate) : undefined,
        status: step2.status as
          | "planning"
          | "confirmed"
          | "active"
          | "completed"
          | "cancelled",
        notes: step2.notes || undefined,
        confirmationCode: step2.confirmationCode || undefined,
        coverImageUrl: step2.coverImageUrl || undefined,
      });

      const tripId = trip.id;

      // 2. Create itinerary items
      for (const item of itinerary) {
        await createItineraryItem.mutateAsync({
          tripId,
          dayNumber: item.dayNumber,
          time: item.time || undefined,
          title: item.title,
          description: item.description || undefined,
          location: item.location || undefined,
          category: item.category,
        });
      }

      // 3. Create packing items
      for (const item of packing) {
        await createPackingItem.mutateAsync({
          tripId,
          item: item.name,
          category: item.category,
          quantity: item.quantity,
          notes: item.notes || undefined,
        });
      }

      // 4. Create bookings
      for (const item of bookings) {
        await createBooking.mutateAsync({
          tripId,
          userId: Number(step1.userId),
          type: item.type,
          vendor: item.provider || undefined,
          confirmationNumber: item.confirmationNumber || undefined,
          checkIn: item.checkIn ? new Date(item.checkIn) : undefined,
          checkOut: item.checkOut ? new Date(item.checkOut) : undefined,
          amount: item.amount ? Number(item.amount) : undefined,
          notes: item.notes || undefined,
        });
      }

      await utils.trips.list.invalidate();
      toast.success(`Trip "${step1.title}" created successfully! 🎉`);
      navigate(`/admin/trips/${tripId}`);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e);
      toast.error("Failed to save trip: " + msg);
    } finally {
      setSaving(false);
    }
  };

  const stepTitles = [
    "Client & Destination",
    "Dates & Notes",
    "Itinerary",
    "Packing List",
    "Bookings",
  ];
  const stepSubtitles = [
    "Choose a client and set the trip destination",
    "Set travel dates, status, and client notes",
    "Build the day-by-day itinerary (optional)",
    "Create a packing checklist (optional)",
    "Add booking confirmations (optional)",
  ];

  return (
    <AdminLayout
      title="Trip Builder"
      subtitle={`Step ${step} of 5 — ${stepSubtitles[step - 1]}`}
    >
      <div className="max-w-2xl mx-auto">
        <StepProgress currentStep={step} />

        <Card>
          <CardContent className="p-6">
            <h2 className="font-serif text-xl font-semibold text-foreground mb-5">
              {stepTitles[step - 1]}
            </h2>

            {step === 1 && (
              <Step1
                form={step1}
                setForm={setStep1}
                defaultClientId={defaultClientId}
              />
            )}
            {step === 2 && <Step2 form={step2} setForm={setStep2} />}
            {step === 3 && (
              <Step3
                items={itinerary}
                setItems={setItinerary}
                destination={step1.destination}
                startDate={step2.startDate}
                endDate={step2.endDate}
              />
            )}
            {step === 4 && <Step4 items={packing} setItems={setPacking} />}
            {step === 5 && (
              <Step5
                items={bookings}
                setItems={setBookings}
                destination={step1.destination}
                startDate={step2.startDate}
                endDate={step2.endDate}
              />
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-8 pt-5 border-t border-border">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  className="font-sans"
                  disabled={saving}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Back
                </Button>
              )}
              <div className="flex-1" />
              {step < 5 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canAdvance}
                  className="font-sans bg-primary text-primary-foreground"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleFinish}
                  disabled={saving}
                  className="font-sans bg-green-600 hover:bg-green-700 text-white"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />{" "}
                      Saving...
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4 mr-2" /> Create Trip
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Summary card when on later steps */}
        {step > 1 && (
          <Card className="mt-4 bg-muted/30">
            <CardContent className="p-4">
              <p className="text-xs font-sans text-muted-foreground uppercase tracking-wider mb-2">
                Trip Summary
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-sans">
                <span className="font-semibold text-foreground">
                  {step1.title}
                </span>
                <span className="text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" /> {step1.destination}
                </span>
                {step2.startDate && (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(step2.startDate).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                    {step2.endDate &&
                      ` – ${new Date(step2.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                  </span>
                )}
                {itinerary.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {itinerary.length} itinerary items
                  </Badge>
                )}
                {packing.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {packing.length} packing items
                  </Badge>
                )}
                {bookings.length > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {bookings.length} bookings
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
