import React, { lazy, Suspense } from "react";
import PortalLayout from "@/components/PortalLayout";
import { GenericSkeleton } from "@/components/ui/skeletons";

const FlightAlternatives = lazy(() => import("@/components/FlightAlternatives"));

export default function FlightAlternativesPage() {
  const tripId = "trip-123"; // In production, get from context

  return (
    <PortalLayout title="Flight Alternatives">
      <Suspense fallback={<GenericSkeleton lines={10} className="pt-4" />}>
        <FlightAlternatives
          tripId={tripId}
          reason="Your flight has been cancelled due to weather. Here are available alternatives."
          originalFlight={{
            flightNumber: "AA123",
            departure: {
              airport: "STL",
              time: Date.now() + 3 * 60 * 60 * 1000,
            },
            arrival: {
              airport: "MCO",
              time: Date.now() + 6 * 60 * 60 * 1000,
            },
          }}
        />
      </Suspense>
    </PortalLayout>
  );
}
