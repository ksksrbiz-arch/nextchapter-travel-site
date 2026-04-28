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
  DialogFooter,
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
import { useState } from "react";
import { toast } from "sonner";
import {
  Wallet,
  Plus,
  Trash2,
  ShieldCheck,
  CreditCard,
  Plane,
  Loader2,
  Lock,
} from "lucide-react";

const DOC_TYPES = [
  { value: "passport", label: "Passport", icon: "🛂" },
  { value: "id_card", label: "Government ID", icon: "🪪" },
  { value: "drivers_license", label: "Driver's License", icon: "🚗" },
  { value: "tsa_precheck", label: "TSA PreCheck", icon: "✈️" },
  { value: "global_entry", label: "Global Entry", icon: "🌍" },
  { value: "loyalty_number", label: "Loyalty Number", icon: "⭐" },
  { value: "payment_token", label: "Payment Method", icon: "💳" },
  { value: "other", label: "Other", icon: "📄" },
] as const;

type DocType = (typeof DOC_TYPES)[number]["value"];

export default function IdentityWalletPage() {
  const utils = trpc.useUtils();
  const { data: entries, isLoading } = trpc.identityWallet.list.useQuery();
  const create = trpc.identityWallet.create.useMutation({
    onSuccess: () => {
      utils.identityWallet.list.invalidate();
      toast.success("Saved to your wallet");
      setOpen(false);
      reset();
    },
    onError: e => toast.error(e.message),
  });
  const del = trpc.identityWallet.delete.useMutation({
    onSuccess: () => {
      utils.identityWallet.list.invalidate();
      toast.success("Removed");
    },
  });
  const verify = trpc.identityWallet.markVerified.useMutation({
    onSuccess: () => utils.identityWallet.list.invalidate(),
  });

  const [open, setOpen] = useState(false);
  const [docType, setDocType] = useState<DocType>("passport");
  const [label, setLabel] = useState("");
  const [maskedHint, setMaskedHint] = useState("");
  const [tokenRef, setTokenRef] = useState("");

  const reset = () => {
    setDocType("passport");
    setLabel("");
    setMaskedHint("");
    setTokenRef("");
  };

  const submit = () => {
    if (!label.trim()) {
      toast.error("Please enter a label");
      return;
    }
    // Basic client-side guard: no full card numbers
    if (tokenRef && /\b\d{12,19}\b/.test(tokenRef)) {
      toast.error(
        "Don't paste raw card numbers. Use a tokenized reference (e.g. pm_…)."
      );
      return;
    }
    create.mutate({
      documentType: docType,
      label: label.trim(),
      maskedHint: maskedHint.trim() || undefined,
      tokenRef: tokenRef.trim() || undefined,
    });
  };

  return (
    <PortalLayout
      title="Digital Identity Wallet"
      subtitle="One-click bookings with verified credentials"
    >
      <div className="mb-6 flex items-start justify-between gap-3 flex-wrap">
        <div className="max-w-2xl">
          <p className="text-sm text-muted-foreground font-sans leading-relaxed">
            Securely save references to your verified IDs, trusted-traveler
            programs, loyalty numbers, and payment-method tokens. Jessica can
            pre-fill bookings on your behalf — and we never store raw card
            numbers, only tokenized references.
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="font-sans">
              <Plus className="w-4 h-4 mr-2" /> Add to Wallet
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add a wallet entry</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <Label>Type</Label>
                <Select
                  value={docType}
                  onValueChange={v => setDocType(v as DocType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DOC_TYPES.map(t => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.icon} {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Label</Label>
                <Input
                  value={label}
                  onChange={e => setLabel(e.target.value)}
                  placeholder="e.g. US Passport — Sarah"
                />
              </div>
              <div>
                <Label>
                  Public-safe hint <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  value={maskedHint}
                  onChange={e => setMaskedHint(e.target.value)}
                  placeholder='e.g. "•••• 4242" or "P 1234"'
                />
              </div>
              <div>
                <Label>
                  Token reference <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  value={tokenRef}
                  onChange={e => setTokenRef(e.target.value)}
                  placeholder="e.g. pm_1Abc... (never the full card number)"
                />
                <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Raw card numbers are blocked.
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={create.isPending}
              >
                Cancel
              </Button>
              <Button onClick={submit} disabled={create.isPending}>
                {create.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && (
        <div className="text-muted-foreground text-sm flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading wallet…
        </div>
      )}

      {!isLoading && (!entries || entries.length === 0) && (
        <Card>
          <CardContent className="py-12 text-center">
            <Wallet className="w-10 h-10 mx-auto text-muted-foreground mb-3" />
            <p className="font-sans text-foreground/70">
              Your wallet is empty. Add your first credential to enable
              one-click bookings.
            </p>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries?.map(e => {
          const meta =
            DOC_TYPES.find(t => t.value === e.documentType) ?? DOC_TYPES[7];
          const Icon =
            e.documentType === "payment_token"
              ? CreditCard
              : e.documentType === "tsa_precheck" ||
                  e.documentType === "global_entry"
                ? Plane
                : Wallet;
          return (
            <Card key={e.id} className="overflow-hidden">
              <CardContent className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <h4 className="font-sans font-semibold text-foreground truncate">
                        {e.label}
                      </h4>
                      {e.verifiedAt && (
                        <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">
                          <ShieldCheck className="w-3 h-3 mr-1" /> Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-sans">
                      {meta.label}
                      {e.maskedHint ? ` · ${e.maskedHint}` : ""}
                    </p>
                    {e.expiryDate && (
                      <p className="text-xs text-muted-foreground font-sans mt-1">
                        Expires {new Date(e.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-3">
                      {!e.verifiedAt && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => verify.mutate({ id: e.id })}
                          disabled={verify.isPending}
                        >
                          <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                          Mark verified
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-destructive hover:text-destructive"
                        onClick={() => del.mutate({ id: e.id })}
                        disabled={del.isPending}
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" /> Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PortalLayout>
  );
}
