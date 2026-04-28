import PortalLayout from "@/components/PortalLayout";
import { useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { RestaurantActivityRecommendations } from "./RestaurantActivityRecommendations";

export default function RecommendationsPage() {
  const recordEvent = trpc.events.record.useMutation();

  useEffect(() => {
    // Track page visit (silently — failures don't affect the user)
    recordEvent.mutate(
      { eventType: "page_visit", payload: { route: "/portal/recommendations" } },
      { onError: () => {} }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PortalLayout title="Recommendations" subtitle="Places to Visit">
      <RestaurantActivityRecommendations />
    </PortalLayout>
  );
}
