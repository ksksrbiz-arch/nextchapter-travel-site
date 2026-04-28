/**
 * AdminImportWizard.tsx
 *
 * Admin page that lets Jessica paste in (or upload) raw email / PDF text and
 * have the LLM extract a structured itinerary. The agent can then review, edit,
 * pick a target trip, and save the items in one click.
 */

import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  UploadCloud,
  Wand2,
  Loader2,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";

type Item = {
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
  confirmationNumber?: string;
};

const CATEGORIES: Item["category"][] = [
  "flight",
  "hotel",
  "activity",
  "dining",
  "transport",
  "free_time",
  "other",
];

export default function AdminImportWizard() {
  const [text, setText] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [destination, setDestination] = useState("");
  const [tripId, setTripId] = useState<string>("");
  const [parseSource, setParseSource] = useState<"llm" | "mock" | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const trips = trpc.trips.list.useQuery();
  const parse = trpc.ai.parseItineraryFromText.useMutation({
    onSuccess: data => {
      setItems(data.items as Item[]);
      setDestination(prev => prev || data.destination || "");
      setParseSource(data.source);
      toast.success(
        `Parsed ${data.items.length} items${
          data.source === "mock" ? " (heuristic fallback)" : ""
        }`
      );
    },
    onError: e => toast.error(e.message),
  });

  const createItem = trpc.itinerary.create.useMutation();

  const handleFile = async (file: File) => {
    if (file.type === "application/pdf") {
      toast.info(
        "PDF detected — please open it and paste the text, or upload the text version."
      );
      return;
    }
    const content = await file.text();
    setText(content);
    toast.success(`Loaded ${file.name}`);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const updateItem = (idx: number, patch: Partial<Item>) => {
    setItems(prev =>
      prev.map((it, i) => (i === idx ? { ...it, ...patch } : it))
    );
  };

  const removeItem = (idx: number) => {
    setItems(prev => prev.filter((_, i) => i !== idx));
  };

  const addItem = () => {
    setItems(prev => [
      ...prev,
      {
        dayNumber: prev.length > 0 ? prev[prev.length - 1].dayNumber : 1,
        title: "",
        description: "",
        category: "other",
      },
    ]);
  };

  const saveAll = async () => {
    const id = Number(tripId);
    if (!id) {
      toast.error("Pick a trip to save into");
      return;
    }
    if (items.length === 0) {
      toast.error("No items to save");
      return;
    }
    let saved = 0;
    for (const it of items) {
      if (!it.title.trim()) continue;
      try {
        await createItem.mutateAsync({
          tripId: id,
          dayNumber: it.dayNumber,
          time: it.time,
          title: it.title,
          description: it.description,
          location: it.location,
          category: it.category,
          confirmationNumber: it.confirmationNumber,
          sortOrder: saved,
        });
        saved += 1;
      } catch (err) {
        console.error("Failed to save item", err);
      }
    }
    toast.success(`Saved ${saved} itinerary items`);
    setItems([]);
    setText("");
  };

  return (
    <AdminLayout
      title="AI Import Wizard"
      subtitle="Drop an email or paste itinerary text — we'll structure it."
    >
      <div className="space-y-6 max-w-5xl">
        {/* Step 1: Drop zone / paste */}
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-serif font-semibold flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-primary" /> 1 · Source
            </h3>

            <div
              ref={dropRef}
              onDragEnter={() => setDragActive(true)}
              onDragLeave={() => setDragActive(false)}
              onDragOver={e => e.preventDefault()}
              onDrop={onDrop}
              onClick={() => fileRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                dragActive
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              }`}
            >
              <UploadCloud className="w-8 h-8 mx-auto text-muted-foreground mb-2" />
              <p className="font-sans text-sm text-foreground">
                Drag &amp; drop a `.txt` / `.eml` email export, or click to
                browse
              </p>
              <p className="font-sans text-xs text-muted-foreground mt-1">
                For PDFs: open and paste the text below.
              </p>
              <input
                ref={fileRef}
                type="file"
                accept=".txt,.eml,.html,.md"
                className="hidden"
                onChange={e => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            <div>
              <Label>Or paste the raw text:</Label>
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                rows={8}
                placeholder="Paste an itinerary email, booking confirmation, or PDF text here…"
              />
            </div>

            <Button
              onClick={() => parse.mutate({ text })}
              disabled={!text.trim() || parse.isPending}
              className="font-sans"
            >
              {parse.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Wand2 className="w-4 h-4 mr-2" />
              )}
              Parse with AI
            </Button>
            {parseSource && (
              <p className="text-xs text-muted-foreground font-sans">
                Source:{" "}
                <Badge
                  variant="outline"
                  className={
                    parseSource === "llm"
                      ? "border-primary text-primary"
                      : "border-amber-500 text-amber-700"
                  }
                >
                  {parseSource === "llm" ? "AI parsed" : "Heuristic fallback"}
                </Badge>
              </p>
            )}
          </CardContent>
        </Card>

        {/* Step 2: Review & edit */}
        {items.length > 0 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-serif font-semibold">2 · Review &amp; edit</h3>
              {destination && (
                <p className="text-sm text-muted-foreground font-sans">
                  Detected destination: <strong>{destination}</strong>
                </p>
              )}
              <div className="space-y-3">
                {items.map((it, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-12 gap-2 items-start p-3 rounded-lg border border-border bg-card"
                  >
                    <Input
                      type="number"
                      min={1}
                      value={it.dayNumber}
                      onChange={e =>
                        updateItem(idx, {
                          dayNumber: Math.max(1, Number(e.target.value) || 1),
                        })
                      }
                      className="md:col-span-1"
                      aria-label="Day"
                    />
                    <Input
                      value={it.time ?? ""}
                      onChange={e => updateItem(idx, { time: e.target.value })}
                      placeholder="09:00"
                      className="md:col-span-1"
                      aria-label="Time"
                    />
                    <Input
                      value={it.title}
                      onChange={e =>
                        updateItem(idx, { title: e.target.value })
                      }
                      placeholder="Title"
                      className="md:col-span-3"
                    />
                    <Input
                      value={it.location ?? ""}
                      onChange={e =>
                        updateItem(idx, { location: e.target.value })
                      }
                      placeholder="Location"
                      className="md:col-span-2"
                    />
                    <Select
                      value={it.category}
                      onValueChange={v =>
                        updateItem(idx, { category: v as Item["category"] })
                      }
                    >
                      <SelectTrigger className="md:col-span-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map(c => (
                          <SelectItem key={c} value={c}>
                            {c.replace("_", " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={it.description}
                      onChange={e =>
                        updateItem(idx, { description: e.target.value })
                      }
                      placeholder="Description"
                      className="md:col-span-2"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="text-destructive md:col-span-1"
                      onClick={() => removeItem(idx)}
                      aria-label="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={addItem}
                className="font-sans"
              >
                <Plus className="w-4 h-4 mr-1" /> Add row
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Save into a trip */}
        {items.length > 0 && (
          <Card>
            <CardContent className="p-5 space-y-4">
              <h3 className="font-serif font-semibold">3 · Save into a trip</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Target trip</Label>
                  <Select value={tripId} onValueChange={setTripId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a trip…" />
                    </SelectTrigger>
                    <SelectContent>
                      {trips.data?.map(t => (
                        <SelectItem key={t.id} value={String(t.id)}>
                          {t.title} — {t.destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                onClick={saveAll}
                disabled={createItem.isPending || !tripId}
                className="font-sans"
              >
                {createItem.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <CheckCircle className="w-4 h-4 mr-2" />
                )}
                Save {items.length} items
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
