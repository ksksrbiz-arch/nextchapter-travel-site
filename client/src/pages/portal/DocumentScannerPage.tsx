import { DocumentScanner } from "@/pages/portal/DocumentScanner";

export default function DocumentScannerPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Document Vault</h1>
        <p className="text-muted-foreground">
          Store and organize your travel documents securely
        </p>
      </div>
      <DocumentScanner />
    </div>
  );
}
