import React from "react";
import PortalLayout from "@/components/PortalLayout";
import ExpenseTracker from "@/components/ExpenseTracker";

export default function ExpenseTrackerPage() {
  const tripId = "trip-123"; // In production, get from context

  return (
    <PortalLayout
      title="Expense Tracker"
      subtitle="Track trip spending with receipt OCR"
    >
      <ExpenseTracker tripId={tripId} />
    </PortalLayout>
  );
}
