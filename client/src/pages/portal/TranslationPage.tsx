import { TranslationHelper } from "@/pages/portal/TranslationHelper";

export default function TranslationPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Translation Helper
        </h1>
        <p className="text-muted-foreground">
          Create translation sessions and save important phrases for your
          travels
        </p>
      </div>
      <TranslationHelper />
    </div>
  );
}
