import React, { lazy, Suspense } from "react";
import PortalLayout from "@/components/PortalLayout";
import { GenericSkeleton } from "@/components/ui/skeletons";

const ExpenseTracker = lazy(() => import("@/components/ExpenseTracker"));

export default function ExpenseTrackerPage() {
  const tripId = "trip-123"; // In production, get from context

  return (
    <PortalLayout
      title="Expense Tracker"
      subtitle="Track trip spending with receipt OCR"
    >
      <Suspense fallback={<GenericSkeleton lines={10} className="pt-4" />}>
        <ExpenseTracker tripId={tripId} />
      </Suspense>
    </PortalLayout>
  );
}
