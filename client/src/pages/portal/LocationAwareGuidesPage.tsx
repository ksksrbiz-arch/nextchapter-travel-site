import React from "react";
import PortalLayout from "@/components/PortalLayout";
import LocationAwareGuides from "@/components/LocationAwareGuides";

export default function LocationAwareGuidesPage() {
  const tripId = "trip-123"; // In production, get from context

  return (
    <PortalLayout title="Location Guides">
      <LocationAwareGuides tripId={tripId} />
    </PortalLayout>
  );
}
