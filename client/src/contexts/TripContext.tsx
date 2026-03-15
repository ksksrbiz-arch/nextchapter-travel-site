/**
 * TripContext.tsx
 *
 * Persists the currently selected trip across all portal pages.
 * When a user switches trips on the Itinerary page, Packing, Bookings, etc.
 * all reflect the same selection automatically.
 *
 * Usage:
 *   const { selectedTripId, setSelectedTripId, trips, selectedTrip } = useTrip();
 */

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { trpc } from "@/lib/trpc";

type Trip = {
  id: number;
  title: string;
  destination: string;
  status: string;
  startDate?: Date | null;
  endDate?: Date | null;
  confirmationCode?: string | null;
  coverImageUrl?: string | null;
  notes?: string | null;
};

interface TripContextValue {
  trips: Trip[] | undefined;
  tripsLoading: boolean;
  selectedTripId: number | null;
  setSelectedTripId: (id: number) => void;
  selectedTrip: Trip | undefined;
}

const TripContext = createContext<TripContextValue | null>(null);

export function TripProvider({ children }: { children: ReactNode }) {
  const { data: trips, isLoading: tripsLoading } = trpc.trips.list.useQuery();
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);

  // Auto-select the first active/confirmed trip, then first trip overall
  useEffect(() => {
    if (!trips || trips.length === 0) return;
    if (selectedTripId !== null) return; // already selected
    const active = trips.find(
      t => t.status === "active" || t.status === "confirmed"
    );
    setSelectedTripId((active ?? trips[0]).id);
  }, [trips, selectedTripId]);

  const resolvedId = selectedTripId ?? trips?.[0]?.id ?? null;
  const selectedTrip = trips?.find(t => t.id === resolvedId);

  return (
    <TripContext.Provider
      value={{
        trips,
        tripsLoading,
        selectedTripId: resolvedId,
        setSelectedTripId,
        selectedTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const ctx = useContext(TripContext);
  if (!ctx) throw new Error("useTrip must be used inside TripProvider");
  return ctx;
}
