import { VaccinationRecordsManager } from "@/pages/portal/VaccinationRecordsManager";

export default function VaccinationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Vaccination Records
        </h1>
        <p className="text-muted-foreground">
          Store and track vaccination records for international travel
        </p>
      </div>
      <VaccinationRecordsManager />
    </div>
  );
}
