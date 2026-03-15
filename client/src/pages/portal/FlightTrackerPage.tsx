import { FlightTracker } from "@/pages/portal/FlightTracker";

export default function FlightTrackerPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Flight Tracker</h1>
        <p className="text-muted-foreground">
          Manage and track your flight bookings
        </p>
      </div>
      <FlightTracker />
    </div>
  );
}
