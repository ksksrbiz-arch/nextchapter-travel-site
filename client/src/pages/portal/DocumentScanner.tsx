import { useState } from "react";
import {
  FileText,
  Plus,
  Trash2,
  Download,
  Share2,
  Lock,
  Calendar,
  Eye,
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface ScannedDocument {
  id: string;
  documentType: string;
  fileName: string;
  uploadDate: string;
  expiryDate?: string;
  size: number;
  format: string;
  tags: string[];
  isEncrypted: boolean;
  isVerified: boolean;
  notes?: string;
  imageUrl?: string;
}

const DOCUMENT_TYPES = [
  "Passport",
  "Driver License",
  "Visa",
  "Travel Insurance",
  "Hotel Booking",
  "Flight Ticket",
  "Vaccination Certificate",
  "Travel Itinerary",
  "Travel Authorization",
  "ID Card",
  "Credit Card",
  "Travel Voucher",
  "Address Proof",
  "Bank Statement",
  "Medical Records",
];

export function DocumentScanner() {
  const [documents, setDocuments] = useState<ScannedDocument[]>([
    {
      id: "1",
      documentType: "Passport",
      fileName: "Passport_USA_12345.pdf",
      uploadDate: "2026-03-01",
      expiryDate: "2031-05-15",
      size: 2.3,
      format: "PDF",
      tags: ["passport", "identification", "required"],
      isEncrypted: true,
      isVerified: true,
      notes: "Primary travel document",
      imageUrl: "passport-thumbnail",
    },
    {
      id: "2",
      documentType: "Travel Insurance",
      fileName: "TravelInsurance_WanderlustPlus_2026.pdf",
      uploadDate: "2026-02-15",
      expiryDate: "2026-12-31",
      size: 1.8,
      format: "PDF",
      tags: ["insurance", "coverage"],
      isEncrypted: true,
      isVerified: true,
      notes: "Annual policy with emergency evacuation",
    },
    {
      id: "3",
      documentType: "Visa",
      fileName: "Visa_Spain_A1234567.pdf",
      uploadDate: "2026-01-10",
      expiryDate: "2027-01-10",
      size: 3.1,
      format: "PDF",
      tags: ["visa", "schengen", "europe"],
      isEncrypted: true,
      isVerified: true,
      notes: "Schengen visa valid for multiple entries",
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    documentType: "Passport",
    fileName: "",
    expiryDate: "",
    notes: "",
    tags: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [searchTerm, setSearchTerm] = useState("");

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fileName.trim()) newErrors.fileName = "File name required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddDocument = () => {
    if (!validateForm()) return;

    const newDocument: ScannedDocument = {
      id: Date.now().toString(),
      documentType: formData.documentType,
      fileName: formData.fileName,
      uploadDate: new Date().toISOString().split("T")[0],
      expiryDate: formData.expiryDate,
      size: Math.random() * 5,
      format: formData.fileName.split(".").pop()?.toUpperCase() || "PDF",
      tags: formData.tags
        .split(",")
        .map(t => t.trim())
        .filter(t => t),
      isEncrypted: true,
      isVerified: false,
      notes: formData.notes,
    };

    setDocuments([newDocument, ...documents]);
    setFormData({
      documentType: "Passport",
      fileName: "",
      expiryDate: "",
      notes: "",
      tags: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  const handleVerifyDocument = (id: string) => {
    setDocuments(
      documents.map(doc =>
        doc.id === id ? { ...doc, isVerified: !doc.isVerified } : doc
      )
    );
  };

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false;
    const daysUntilExpiry = Math.ceil(
      (new Date(expiryDate).getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return daysUntilExpiry > 0 && daysUntilExpiry <= 90;
  };

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false;
    return new Date(expiryDate) < new Date();
  };

  const filteredDocuments = documents.filter(
    doc =>
      doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.documentType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const expiredCount = documents.filter(d => isExpired(d.expiryDate)).length;
  const expiringCount = documents.filter(
    d => isExpiringSoon(d.expiryDate) && !isExpired(d.expiryDate)
  ).length;

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="bg-gradient-to-br from-orange-950/30 to-red-950/30 border-orange-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Document Vault Summary
        </h3>

        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total Documents</p>
            <p className="text-2xl font-bold text-foreground">
              {documents.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-orange-500/30">
            <p className="text-xs text-orange-300">Verified</p>
            <p className="text-2xl font-bold text-orange-400">
              {documents.filter(d => d.isVerified).length}
            </p>
          </div>

          <div
            className={`p-3 bg-black/20 rounded-lg ${expiringCount > 0 ? "border border-amber-500/30" : ""}`}
          >
            <p className="text-xs text-amber-300">Expiring Soon</p>
            <p
              className={`text-2xl font-bold ${expiringCount > 0 ? "text-amber-400" : "text-foreground"}`}
            >
              {expiringCount}
            </p>
          </div>

          <div
            className={`p-3 bg-black/20 rounded-lg ${expiredCount > 0 ? "border border-red-500/30" : ""}`}
          >
            <p className="text-xs text-red-300">Expired</p>
            <p
              className={`text-2xl font-bold ${expiredCount > 0 ? "text-red-400" : "text-foreground"}`}
            >
              {expiredCount}
            </p>
          </div>
        </div>
      </Card>

      {/* Search and Add */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search documents..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-border/50 rounded-lg pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
        </div>

        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Document
          </Button>
        )}
      </div>

      {/* Add Document Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Add Document</h3>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <select
                value={formData.documentType}
                onChange={e =>
                  setFormData({ ...formData, documentType: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                {DOCUMENT_TYPES.map(type => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>

              <FormFieldWrapper error={errors.fileName}>
                <input
                  type="text"
                  placeholder="File Name"
                  value={formData.fileName}
                  onChange={e => {
                    setFormData({ ...formData, fileName: e.target.value });
                    setErrors({ ...errors, fileName: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <input
              type="date"
              placeholder="Expiry Date"
              value={formData.expiryDate}
              onChange={e =>
                setFormData({ ...formData, expiryDate: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            />

            <input
              type="text"
              placeholder="Tags (comma-separated)"
              value={formData.tags}
              onChange={e => setFormData({ ...formData, tags: e.target.value })}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={3}
            />

            <div className="flex gap-3">
              <Button onClick={handleAddDocument} className="flex-1">
                Add Document
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
      {filteredDocuments.length > 0 ? (
        <div className="space-y-3">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="p-4 border-border/50">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-5 h-5 text-primary" />
                    <h4 className="font-semibold text-foreground">
                      {doc.documentType}
                    </h4>
                    {doc.isVerified && (
                      <Badge className="text-xs bg-emerald-500/20 text-emerald-300">
                        Verified
                      </Badge>
                    )}
                    {isExpired(doc.expiryDate) && (
                      <Badge className="text-xs bg-red-500/20 text-red-300">
                        Expired
                      </Badge>
                    )}
                    {isExpiringSoon(doc.expiryDate) &&
                      !isExpired(doc.expiryDate) && (
                        <Badge className="text-xs bg-amber-500/20 text-amber-300">
                          Expiring Soon
                        </Badge>
                      )}
                  </div>
                  <p className="text-sm text-muted-foreground truncate">
                    {doc.fileName}
                  </p>
                </div>

                <button
                  onClick={() => handleDeleteDocument(doc.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {/* Document Details */}
              <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-black/20 rounded-lg text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Uploaded</p>
                  <p className="font-medium text-foreground">
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </p>
                </div>

                {doc.expiryDate && (
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">Expires</p>
                    <p
                      className={`font-medium ${
                        isExpired(doc.expiryDate)
                          ? "text-red-400"
                          : isExpiringSoon(doc.expiryDate)
                            ? "text-amber-400"
                            : "text-foreground"
                      }`}
                    >
                      {new Date(doc.expiryDate).toLocaleDateString()}
                    </p>
                  </div>
                )}

                <div>
                  <p className="text-xs text-muted-foreground">Format</p>
                  <p className="font-medium text-foreground">{doc.format}</p>
                </div>

                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Size</p>
                  <p className="font-medium text-foreground">
                    {doc.size.toFixed(1)} MB
                  </p>
                </div>
              </div>

              {/* Tags */}
              {doc.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {doc.tags.map(tag => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Notes */}
              {doc.notes && (
                <p className="text-xs text-muted-foreground mb-3 p-2 bg-black/20 rounded italic">
                  {doc.notes}
                </p>
              )}

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-border/50">
                <button
                  onClick={() => handleVerifyDocument(doc.id)}
                  className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                >
                  <Eye className="w-3 h-3" />
                  {doc.isVerified ? "Verified" : "Verify"}
                </button>

                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs rounded-lg bg-black/20 hover:bg-black/30 text-foreground transition-colors">
                  <Download className="w-3 h-3" />
                  Download
                </button>

                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs rounded-lg bg-black/20 hover:bg-black/30 text-foreground transition-colors">
                  <Share2 className="w-3 h-3" />
                  Share
                </button>

                <button className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-xs rounded-lg bg-black/20 hover:bg-black/30 text-foreground transition-colors">
                  <Lock className="w-3 h-3" />
                  Encrypt
                </button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={FileText}
            title={searchTerm ? "No Documents Found" : "No Documents"}
            description={
              searchTerm
                ? "Try adjusting your search"
                : "Store and manage your travel documents securely"
            }
            action={{ label: "Add Document", onClick: () => setShowForm(true) }}
          />
        )
      )}
    </div>
  );
}
