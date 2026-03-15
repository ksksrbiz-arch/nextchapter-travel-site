/**
 * TripSwitcher.tsx
 *
 * A compact trip selector that lives in the portal header.
 * Only renders when the user has 2+ trips.
 * Reads/writes from TripContext so all portal pages stay in sync.
 */

import { useTrip } from "@/contexts/TripContext";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  active: "bg-amber-100 text-amber-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

export default function TripSwitcher() {
  const { trips, selectedTripId, setSelectedTripId } = useTrip();

  // Only show when there are 2+ trips
  if (!trips || trips.length < 2) return null;

  return (
    <div className="flex items-center gap-2">
      <MapPin className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0 hidden sm:block" />
      <Select
        value={selectedTripId?.toString() ?? ""}
        onValueChange={v => setSelectedTripId(Number(v))}
      >
        <SelectTrigger className="h-8 text-xs font-sans border-border bg-background/60 backdrop-blur-sm w-auto max-w-[200px] sm:max-w-[260px]">
          <SelectValue placeholder="Select trip" />
        </SelectTrigger>
        <SelectContent align="end">
          {trips.map(t => (
            <SelectItem
              key={t.id}
              value={t.id.toString()}
              className="font-sans text-sm"
            >
              <div className="flex items-center gap-2">
                <span className="truncate max-w-[160px]">{t.title}</span>
                <Badge
                  className={`text-xs ${STATUS_COLORS[t.status] ?? "bg-gray-100 text-gray-700"} flex-shrink-0`}
                >
                  {t.status}
                </Badge>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
