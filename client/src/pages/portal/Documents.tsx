import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useRef } from "react";
import { toast } from "sonner";
import {
  FileText,
  Upload,
  Plane,
  Hotel,
  Shield,
  File,
  Download,
  Trash2,
  Plus,
  Loader2,
  Lock,
} from "lucide-react";
import { validateForm, ValidationRules } from "@/lib/validation";
import {
  FormFieldWrapper,
  FormErrorSummary,
} from "@/components/ui/form-errors";
import { NoDocumentsEmptyState } from "@/components/ui/empty-states";
import { DocumentsSkeleton } from "@/components/ui/skeletons";

const DOC_TYPES = [
  { value: "passport", label: "Passport", icon: "🛂" },
  { value: "boarding_pass", label: "Boarding Pass", icon: "✈️" },
  { value: "hotel_confirmation", label: "Hotel Confirmation", icon: "🏨" },
  { value: "tour_confirmation", label: "Tour Confirmation", icon: "🗺️" },
  { value: "travel_insurance", label: "Travel Insurance", icon: "🛡️" },
  { value: "visa", label: "Visa", icon: "📋" },
  { value: "other", label: "Other", icon: "📄" },
];

const TYPE_ICONS: Record<string, string> = {
  passport: "🛂",
  boarding_pass: "✈️",
  hotel_confirmation: "🏨",
  tour_confirmation: "🗺️",
  travel_insurance: "🛡️",
  visa: "📋",
  other: "📄",
};

export default function Documents() {
  const {
    data: documents,
    isLoading,
    refetch,
  } = trpc.documents.list.useQuery({});
  const [uploading, setUploading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    type: "other" as const,
    notes: "",
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});
  const fileRef = useRef<HTMLInputElement>(null);

  const validationRules: ValidationRules = {
    name: {
      required: "Document name is required",
      minLength: { value: 2, message: "Name must be at least 2 characters" },
      maxLength: { value: 100, message: "Name must not exceed 100 characters" },
    },
    type: {
      required: "Document type is required",
    },
    file: {
      required: "Please select a file",
      validate: value => {
        if (!selectedFile) return "Please select a file";
        const maxSize = 20 * 1024 * 1024; // 20MB
        if (selectedFile.size > maxSize) {
          return "File size must not exceed 20MB";
        }
        const validTypes = [
          "application/pdf",
          "image/jpeg",
          "image/png",
          "image/webp",
        ];
        if (!validTypes.includes(selectedFile.type)) {
          return "Only PDF, JPG, PNG, and WebP files are allowed";
        }
        return true;
      },
    },
  };

  const createDoc = trpc.documents.create.useMutation({
    onSuccess: () => {
      toast.success("Document uploaded successfully");
      setOpen(false);
      setForm({ name: "", type: "other", notes: "" });
      setSelectedFile(null);
      setErrors({});
      refetch();
    },
    onError: e => toast.error(e.message),
  });

  const deleteDoc = trpc.documents.delete.useMutation({
    onSuccess: () => {
      toast.success("Document removed");
      refetch();
    },
    onError: e => toast.error(e.message),
  });

  const handleUpload = async () => {
    // Validate form
    const formErrors = validateForm(
      { name: form.name, type: form.type, file: selectedFile },
      validationRules
    );
    setErrors(formErrors);

    if (Object.values(formErrors).some(e => e)) {
      return;
    }

    setUploading(true);
    try {
      // Upload file via fetch to a simple upload endpoint
      const formData = new FormData();
      formData.append("file", selectedFile!);
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url, key } = await res.json();

      await createDoc.mutateAsync({
        name: form.name,
        type: form.type as any,
        fileUrl: url,
        fileKey: key,
        mimeType: selectedFile!.type,
        fileSize: selectedFile!.size,
        notes: form.notes || undefined,
      });
    } catch (e: any) {
      toast.error(e.message ?? "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const groupedDocs = DOC_TYPES.reduce(
    (acc, type) => {
      const docs = documents?.filter(d => d.type === type.value) ?? [];
      if (docs.length > 0) acc[type.value] = docs;
      return acc;
    },
    {} as Record<string, typeof documents>
  );

  return (
    <PortalLayout
      title="Document Vault"
      subtitle="Your travel documents, securely stored"
    >
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-muted-foreground font-sans text-sm">
          <Lock className="w-4 h-4 text-green-600" />
          <span>All documents are encrypted and secure</span>
        </div>
        <Dialog
          open={open}
          onOpenChange={newOpen => {
            setOpen(newOpen);
            if (!newOpen) {
              setErrors({});
            }
          }}
        >
          <DialogTrigger asChild>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-sans">
              <Plus className="w-4 h-4 mr-2" />
              Upload Document
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-serif">Upload Document</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              {Object.values(errors).some(e => e) && (
                <FormErrorSummary errors={errors} className="mb-4" />
              )}
              <FormFieldWrapper
                label="Document Name"
                required
                error={errors.name}
              >
                <Input
                  value={form.name}
                  onChange={e => {
                    setForm(f => ({ ...f, name: e.target.value }));
                    if (errors.name) {
                      setErrors(e => ({ ...e, name: undefined }));
                    }
                  }}
                  placeholder="e.g., John's Passport"
                  className="font-sans"
                />
              </FormFieldWrapper>
              <FormFieldWrapper
                label="Document Type"
                required
                error={errors.type}
              >
                <Select
                  value={form.type}
                  onValueChange={v => {
                    setForm(f => ({ ...f, type: v as any }));
                    if (errors.type) {
                      setErrors(e => ({ ...e, type: undefined }));
                    }
                  }}
                >
                  <SelectTrigger className="font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map(t => (
                      <SelectItem
                        key={t.value}
                        value={t.value}
                        className="font-sans"
                      >
                        {t.icon} {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormFieldWrapper>
              <FormFieldWrapper
                label="File"
                required
                error={errors.file}
                helpText="Supported: PDF, JPG, PNG, WebP (max 20MB)"
              >
                <div
                  className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:border-secondary/50 hover:bg-secondary/5 transition-colors"
                  onClick={() => fileRef.current?.click()}
                >
                  <Upload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm font-sans text-muted-foreground">
                    {selectedFile
                      ? selectedFile.name
                      : "Click to select file (PDF, JPG, PNG)"}
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.webp"
                    className="hidden"
                    onChange={e => {
                      setSelectedFile(e.target.files?.[0] ?? null);
                      if (errors.file) {
                        setErrors(err => ({ ...err, file: undefined }));
                      }
                    }}
                  />
                </div>
              </FormFieldWrapper>
              <FormFieldWrapper label="Notes (optional)">
                <Input
                  value={form.notes}
                  onChange={e =>
                    setForm(f => ({ ...f, notes: e.target.value }))
                  }
                  placeholder="e.g., Expires Dec 2028"
                  className="font-sans"
                />
              </FormFieldWrapper>
              <Button
                className="w-full bg-primary text-primary-foreground font-sans"
                onClick={handleUpload}
                disabled={uploading || createDoc.isPending}
              >
                {(uploading || createDoc.isPending) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Upload Document
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Loading */}
      {isLoading && <DocumentsSkeleton />}

      {/* Empty state */}
      {!isLoading && (!documents || documents.length === 0) && (
        <div>
          <NoDocumentsEmptyState />
          <div className="text-center mt-6">
            <Button
              className="bg-primary text-primary-foreground font-sans"
              onClick={() => setOpen(true)}
            >
              <Plus className="w-4 h-4 mr-2" />
              Upload Your First Document
            </Button>
          </div>
        </div>
      )}

      {/* Documents by category */}
      {Object.entries(groupedDocs).map(([type, docs]) => {
        const typeConfig = DOC_TYPES.find(t => t.value === type);
        return (
          <div key={type} className="mb-8">
            <h3 className="text-base font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
              <span>{typeConfig?.icon}</span>
              {typeConfig?.label}
              <Badge className="bg-muted text-muted-foreground border-0 font-sans text-xs">
                {docs?.length}
              </Badge>
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {docs?.map(doc => (
                <Card
                  key={doc.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center text-lg flex-shrink-0">
                        {TYPE_ICONS[doc.type] ?? "📄"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-sans font-medium text-foreground text-sm truncate">
                          {doc.name}
                        </h4>
                        {doc.notes && (
                          <p className="text-muted-foreground font-sans text-xs mt-0.5 truncate">
                            {doc.notes}
                          </p>
                        )}
                        <p className="text-muted-foreground font-sans text-xs mt-1">
                          {new Date(doc.createdAt).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <a
                        href={doc.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1"
                      >
                        <Button
                          variant="outline"
                          size="sm"
                          className="w-full font-sans text-xs"
                        >
                          <Download className="w-3.5 h-3.5 mr-1.5" />
                          View
                        </Button>
                      </a>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-destructive hover:bg-destructive/10 font-sans"
                        onClick={() => deleteDoc.mutate({ id: doc.id })}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
      })}
    </PortalLayout>
  );
}
