import { useState, useRef } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  Paperclip,
  X,
  FileText,
  FileImage,
  File,
  Download,
  ZoomIn,
  Loader2,
  Camera,
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AttachmentMeta = {
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function isImage(mimeType: string | null | undefined): boolean {
  return !!mimeType?.startsWith("image/");
}

export function isPDF(mimeType: string | null | undefined): boolean {
  return mimeType === "application/pdf";
}

export function formatBytes(bytes: number | null | undefined): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/heic",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const MAX_SIZE = 16 * 1024 * 1024; // 16 MB

// ─── AttachmentPicker ─────────────────────────────────────────────────────────

type AttachmentPickerProps = {
  onAttachment: (meta: AttachmentMeta) => void;
  disabled?: boolean;
};

export function AttachmentPicker({
  onAttachment,
  disabled,
}: AttachmentPickerProps) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = trpc.messages.uploadAttachment.useMutation({
    onSuccess: result => {
      onAttachment({
        url: result.url,
        fileName: result.fileName,
        mimeType: result.mimeType,
        fileSize: result.fileSize,
      });
      setUploading(false);
    },
    onError: err => {
      toast.error(err.message ?? "Upload failed");
      setUploading(false);
    },
  });

  const handleFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error(
        "File type not supported. Use images, PDF, Word, or text files."
      );
      return;
    }
    if (file.size > MAX_SIZE) {
      toast.error("File too large. Maximum size is 16 MB.");
      return;
    }
    setUploading(true);
    const reader = new FileReader();
    reader.onload = e => {
      const base64 = (e.target?.result as string).split(",")[1];
      if (!base64) {
        setUploading(false);
        return;
      }
      uploadMutation.mutate({
        fileName: file.name,
        mimeType: file.type,
        base64Data: base64,
        fileSize: file.size,
      });
    };
    reader.onerror = () => {
      toast.error("Failed to read file");
      setUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center gap-1">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.gif,.webp,.heic,.pdf,.doc,.docx,.txt"
        onChange={handleChange}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleChange}
        className="hidden"
      />

      {/* Camera button (mobile-first) */}
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => cameraInputRef.current?.click()}
        className={cn(
          "p-2.5 rounded-xl transition-all duration-150 touch-manipulation",
          "text-muted-foreground hover:text-primary hover:bg-primary/10",
          "active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
          "sm:hidden" // only show on mobile
        )}
        title="Take photo"
      >
        <Camera className="w-5 h-5" />
      </button>

      {/* Paperclip / file picker */}
      <button
        type="button"
        disabled={disabled || uploading}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          "p-2.5 rounded-xl transition-all duration-150 touch-manipulation",
          "text-muted-foreground hover:text-primary hover:bg-primary/10",
          "active:scale-95 disabled:opacity-40 disabled:pointer-events-none"
        )}
        title="Attach file"
      >
        {uploading ? (
          <Loader2 className="w-5 h-5 animate-spin text-primary" />
        ) : (
          <Paperclip className="w-5 h-5" />
        )}
      </button>
    </div>
  );
}

// ─── AttachmentPreview (before sending) ──────────────────────────────────────

type AttachmentPreviewProps = {
  attachment: AttachmentMeta;
  onRemove: () => void;
};

export function AttachmentPreview({
  attachment,
  onRemove,
}: AttachmentPreviewProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-muted/50 border border-border rounded-xl mx-2 mb-1">
      <div className="flex-shrink-0">
        {isImage(attachment.mimeType) ? (
          <img
            src={attachment.url}
            alt={attachment.fileName}
            className="w-10 h-10 rounded-lg object-cover border border-border"
          />
        ) : isPDF(attachment.mimeType) ? (
          <div className="w-10 h-10 rounded-lg bg-red-50 border border-red-200 flex items-center justify-center">
            <FileText className="w-5 h-5 text-red-500" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
            <File className="w-5 h-5 text-blue-500" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium text-foreground truncate font-sans">
          {attachment.fileName}
        </p>
        <p className="text-[10px] text-muted-foreground font-sans">
          {formatBytes(attachment.fileSize)}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-destructive/10 hover:text-destructive transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

// ─── AttachmentBubble (in message thread) ─────────────────────────────────────

type AttachmentBubbleProps = {
  url: string;
  fileName: string | null;
  mimeType: string | null;
  fileSize: number | null;
  isFromMe: boolean;
};

export function AttachmentBubble({
  url,
  fileName,
  mimeType,
  fileSize,
  isFromMe,
}: AttachmentBubbleProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (isImage(mimeType)) {
    return (
      <>
        <div
          className={cn(
            "relative group cursor-pointer rounded-xl overflow-hidden border",
            isFromMe ? "border-primary/30" : "border-border",
            "max-w-[220px]"
          )}
          onClick={() => setLightboxOpen(true)}
        >
          <img
            src={url}
            alt={fileName ?? "Image"}
            className="w-full max-h-48 object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <ZoomIn className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
          </div>
        </div>
        {fileName && (
          <p className="text-[10px] text-muted-foreground font-sans mt-0.5 px-0.5 truncate max-w-[220px]">
            {fileName} {fileSize ? `· ${formatBytes(fileSize)}` : ""}
          </p>
        )}

        {/* Lightbox */}
        {lightboxOpen && (
          <div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <img
              src={url}
              alt={fileName ?? "Image"}
              className="max-w-full max-h-[90dvh] rounded-xl object-contain"
              onClick={e => e.stopPropagation()}
            />
            <a
              href={url}
              download={fileName ?? "image"}
              target="_blank"
              rel="noopener noreferrer"
              className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-full text-sm font-sans transition-colors"
              onClick={e => e.stopPropagation()}
            >
              <Download className="w-4 h-4" /> Download
            </a>
          </div>
        )}
      </>
    );
  }

  // PDF or document
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      download={fileName ?? undefined}
      className={cn(
        "flex items-center gap-2.5 px-3 py-2.5 rounded-xl border transition-colors no-underline",
        isFromMe
          ? "bg-primary/20 border-primary/30 hover:bg-primary/30"
          : "bg-muted/50 border-border hover:bg-muted",
        "max-w-[220px]"
      )}
    >
      <div
        className={cn(
          "w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0",
          isPDF(mimeType)
            ? "bg-red-100 text-red-600"
            : "bg-blue-100 text-blue-600"
        )}
      >
        {isPDF(mimeType) ? (
          <FileText className="w-4 h-4" />
        ) : (
          <FileImage className="w-4 h-4" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            "text-xs font-medium truncate font-sans",
            isFromMe ? "text-primary-foreground" : "text-foreground"
          )}
        >
          {fileName ?? "Attachment"}
        </p>
        <p
          className={cn(
            "text-[10px] font-sans",
            isFromMe ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {isPDF(mimeType) ? "PDF" : "Document"}{" "}
          {fileSize ? `· ${formatBytes(fileSize)}` : ""}
        </p>
      </div>
      <Download
        className={cn(
          "w-3.5 h-3.5 flex-shrink-0",
          isFromMe ? "text-primary-foreground/70" : "text-muted-foreground"
        )}
      />
    </a>
  );
}
