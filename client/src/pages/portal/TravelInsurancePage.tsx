import { TravelInsuranceTracker } from "@/pages/portal/TravelInsuranceTracker";

export default function TravelInsurancePage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Travel Insurance</h1>
        <p className="text-muted-foreground">
          Manage and track your travel insurance policies
        </p>
      </div>
      <TravelInsuranceTracker />
    </div>
  );
}
