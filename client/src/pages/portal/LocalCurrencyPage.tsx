import { LocalCurrencySimulator } from "@/pages/portal/LocalCurrencySimulator";

export default function LocalCurrencyPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Currency Converter
        </h1>
        <p className="text-muted-foreground">
          Convert and track currencies for your travels
        </p>
      </div>
      <LocalCurrencySimulator />
    </div>
  );
}
