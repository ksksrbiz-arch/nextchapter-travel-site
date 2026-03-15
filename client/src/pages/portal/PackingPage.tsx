import { PackingListGenerator } from "@/pages/portal/PackingListGenerator";

export default function PackingPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Packing Lists</h1>
        <p className="text-muted-foreground">
          Create and manage packing lists for your trips
        </p>
      </div>
      <PackingListGenerator />
    </div>
  );
}
