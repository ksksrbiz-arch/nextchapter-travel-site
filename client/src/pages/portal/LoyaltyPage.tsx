import { LoyaltyProgramTracker } from "@/pages/portal/LoyaltyProgramTracker";

export default function LoyaltyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Loyalty Programs</h1>
        <p className="text-muted-foreground">
          Track your points and rewards across travel loyalty programs
        </p>
      </div>
      <LoyaltyProgramTracker />
    </div>
  );
}
