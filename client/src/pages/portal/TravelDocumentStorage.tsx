import { useState } from "react";
import {
  FileText,
  Upload,
  Download,
  Share2,
  Lock,
  Trash2,
  Plus,
  Eye,
  AlertTriangle,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface TravelDocument {
  id: string;
  name: string;
  type: "passport" | "visa" | "insurance" | "booking" | "vaccination" | "other";
  expiryDate?: string;
  uploadDate: string;
  isExpired: boolean;
  notes?: string;
  shared: boolean;
}

const DOCUMENT_TYPES = [
  { value: "passport", label: "Passport" },
  { value: "visa", label: "Visa" },
  { value: "insurance", label: "Insurance" },
  { value: "booking", label: "Booking Confirmation" },
  { value: "vaccination", label: "Vaccination Record" },
  { value: "other", label: "Other" },
];

export function TravelDocumentStorage() {
  const [documents, setDocuments] = useState<TravelDocument[]>([
    {
      id: "1",
      name: "US Passport",
      type: "passport",
      expiryDate: "2025-06-15",
      uploadDate: "2024-01-15",
      isExpired: false,
      notes: "Blue passport - valid for international travel",
      shared: false,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    type: "other",
    expiryDate: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Document name required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDocument = () => {
    if (!validateForm()) return;

    const newDoc: TravelDocument = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type as TravelDocument["type"],
      expiryDate: formData.expiryDate,
      uploadDate: new Date().toISOString().split("T")[0],
      isExpired: formData.expiryDate
        ? new Date(formData.expiryDate) < new Date()
        : false,
      notes: formData.notes,
      shared: false,
    };

    setDocuments([newDoc, ...documents]);
    setFormData({ name: "", type: "other", expiryDate: "", notes: "" });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleToggleShare = (id: string) => {
    setDocuments(
      documents.map(d => (d.id === id ? { ...d, shared: !d.shared } : d))
    );
  };

  const expiredDocs = documents.filter(d => d.isExpired);
  const expiringDocs = documents.filter(d => {
    if (!d.expiryDate) return false;
    const daysUntilExpiry = Math.floor(
      (new Date(d.expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  });

  return (
    <div className="space-y-6">
      {/* Document Status */}
      <Card className="bg-gradient-to-br from-cyan-950/30 to-blue-950/30 border-cyan-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Document Status
        </h3>

        <div className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {documents.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-300">Valid</p>
            <p className="text-2xl font-bold text-emerald-400">
              {documents.filter(d => !d.isExpired).length}
            </p>
          </div>

          <div
            className={`p-3 bg-black/20 rounded-lg border ${expiredDocs.length > 0 ? "border-red-500/30" : "border-border"}`}
          >
            <p
              className={`text-xs ${expiredDocs.length > 0 ? "text-red-300" : "text-muted-foreground"}`}
            >
              Expired
            </p>
            <p
              className={`text-2xl font-bold ${expiredDocs.length > 0 ? "text-red-400" : "text-foreground"}`}
            >
              {expiredDocs.length}
            </p>
          </div>
        </div>
      </Card>

      {/* Expiring Soon Alert */}
      {expiringDocs.length > 0 && (
        <Card className="border-orange-500/30 bg-orange-950/20 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-orange-400 mb-2">
                Documents Expiring Soon
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {expiringDocs.map(doc => (
                  <li key={doc.id}>
                    • {doc.name} expires {doc.expiryDate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Expired Documents Alert */}
      {expiredDocs.length > 0 && (
        <Card className="border-red-500/30 bg-red-950/20 p-4">
          <div className="flex gap-3">
            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm text-red-400 mb-2">
                Expired Documents
              </h4>
              <ul className="text-xs text-muted-foreground space-y-1">
                {expiredDocs.map(doc => (
                  <li key={doc.id}>
                    • {doc.name} expired {doc.expiryDate}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Add Document Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Document
        </Button>
      )}

      {/* Add Document Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Add Travel Document</h3>

          <div className="space-y-4">
            <FormFieldWrapper error={errors.name}>
              <input
                type="text"
                placeholder="Document Name"
                value={formData.name}
                onChange={e => {
                  setFormData({ ...formData, name: e.target.value });
                  setErrors({ ...errors, name: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              {DOCUMENT_TYPES.map(t => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={formData.expiryDate}
              onChange={e =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              placeholder="Expiry Date (optional)"
            />

            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={2}
            />

            {/* Upload File Section */}
            <div className="border-2 border-dashed border-border/50 rounded-lg p-8 text-center hover:bg-black/20 transition-colors cursor-pointer">
              <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground mb-1">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-muted-foreground">
                PDF, Image, or Document files
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddDocument} className="flex-1">
                Save Document
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Documents List */}
      {documents.length > 0 ? (
        <div className="space-y-3">
          {documents.map(doc => (
            <Card
              key={doc.id}
              className={`p-4 border-border/50 ${doc.isExpired ? "border-l-4 border-l-red-500 bg-red-950/10" : ""}`}
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-5 h-5 text-primary" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4
                      className={`font-semibold ${doc.isExpired ? "text-red-400 line-through" : "text-foreground"}`}
                    >
                      {doc.name}
                    </h4>
                    <Badge variant="outline" className="text-xs">
                      {DOCUMENT_TYPES.find(t => t.value === doc.type)?.label}
                    </Badge>
                    {doc.shared && (
                      <Badge variant="secondary" className="text-xs">
                        <Share2 className="w-3 h-3 mr-1" />
                        Shared
                      </Badge>
                    )}
                    {doc.isExpired && (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground">
                    Uploaded {doc.uploadDate}
                    {doc.expiryDate && ` • Expires ${doc.expiryDate}`}
                  </p>

                  {doc.notes && (
                    <p className="text-xs text-muted-foreground mt-2 italic">
                      {doc.notes}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 py-2 px-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-xs font-medium flex items-center justify-center gap-2">
                  <Eye className="w-3 h-3" />
                  View
                </button>
                <button className="flex-1 py-2 px-3 rounded-lg bg-black/20 hover:bg-black/30 transition-colors text-xs font-medium flex items-center justify-center gap-2">
                  <Download className="w-3 h-3" />
                  Download
                </button>
                <button
                  onClick={() => handleToggleShare(doc.id)}
                  className={`flex-1 py-2 px-3 rounded-lg transition-colors text-xs font-medium flex items-center justify-center gap-2 ${
                    doc.shared
                      ? "bg-primary/20 text-primary hover:bg-primary/30"
                      : "bg-black/20 hover:bg-black/30 text-muted-foreground"
                  }`}
                >
                  <Share2 className="w-3 h-3" />
                  {doc.shared ? "Unshare" : "Share"}
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={FileText}
            title="No Documents"
            description="Store important travel documents in one secure location"
            action={{ label: "Add Document", onClick: () => setShowForm(true) }}
          />
        )
      )}

      {/* Security Notice */}
      <Card className="border-blue-500/20 bg-blue-950/20 p-4">
        <div className="flex gap-3">
          <Lock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-medium text-sm text-blue-400 mb-1">
              🔒 Your documents are secure
            </h4>
            <p className="text-xs text-muted-foreground">
              All documents are encrypted and stored securely. You control who
              can access them.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
