import React, { lazy, Suspense } from "react";
import PortalLayout from "@/components/PortalLayout";
import { GenericSkeleton } from "@/components/ui/skeletons";

const CrisisManagement = lazy(() => import("@/components/CrisisManagement"));

export default function CrisisManagementPage() {
  const tripId = "trip-123"; // In production, get from context

  return (
    <PortalLayout title="Crisis Management">
      <Suspense fallback={<GenericSkeleton lines={10} className="pt-4" />}>
        <CrisisManagement tripId={tripId} />
      </Suspense>
    </PortalLayout>
  );
}
