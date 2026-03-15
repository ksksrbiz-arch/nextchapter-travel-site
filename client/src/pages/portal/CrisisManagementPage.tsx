import React from "react";
import PortalLayout from "@/components/PortalLayout";
import CrisisManagement from "@/components/CrisisManagement";

export default function CrisisManagementPage() {
  const tripId = "trip-123"; // In production, get from context

  return (
    <PortalLayout title="Crisis Management">
      <CrisisManagement tripId={tripId} />
    </PortalLayout>
  );
}
