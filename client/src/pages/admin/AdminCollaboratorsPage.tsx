/**
 * AdminCollaboratorsPage — invite tour operators / DMCs to co-edit a trip.
 */

import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useParams } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Plus,
  Copy,
  Trash2,
  Loader2,
  CheckCircle,
  Clock,
  Printer,
} from "lucide-react";

export default function AdminCollaboratorsPage() {
  const params = useParams<{ id: string }>();
  const tripId = Number(params.id);

  const trip = trpc.trips.getById.useQuery({ id: tripId });
  const list = trpc.collaborators.list.useQuery({ tripId });
  const utils = trpc.useUtils();

  const invite = trpc.collaborators.invite.useMutation({
    onSuccess: data => {
      utils.collaborators.list.invalidate({ tripId });
      const url = `${window.location.origin}/collaborate?token=${data.token}`;
      navigator.clipboard?.writeText(url);
      toast.success("Invite created. Link copied to clipboard.");
      setEmail("");
      setName("");
    },
    onError: e => toast.error(e.message),
  });

  const revoke = trpc.collaborators.revoke.useMutation({
    onSuccess: () => {
      utils.collaborators.list.invalidate({ tripId });
      toast.success("Revoked");
    },
  });

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState<"viewer" | "editor">("viewer");

  const submit = () => {
    if (!email.trim()) {
      toast.error("Email required");
      return;
    }
    invite.mutate({
      tripId,
      email: email.trim(),
      name: name.trim() || undefined,
      role,
    });
  };

  const copyLink = (token: string) => {
    const url = `${window.location.origin}/collaborate?token=${token}`;
    navigator.clipboard?.writeText(url);
    toast.success("Link copied");
  };

  const printWhitelabel = () => {
    // Open the trip's itinerary view with a print-friendly query flag
    window.open(`/admin/trips/${tripId}?print=whitelabel`, "_blank");
    setTimeout(() => window.print(), 400);
  };

  return (
    <AdminLayout
      title="Collaborators"
      subtitle={
        trip.data
          ? `${trip.data.title} — ${trip.data.destination}`
          : "Invite operators to co-edit"
      }
    >
      <div className="space-y-6 max-w-4xl">
        <Card>
          <CardContent className="p-5 space-y-4">
            <h3 className="font-serif font-semibold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Invite a collaborator
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="md:col-span-2">
                <Label>Email</Label>
                <Input
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="operator@example.com"
                />
              </div>
              <div>
                <Label>Name (optional)</Label>
                <Input
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="DMC contact"
                />
              </div>
              <div>
                <Label>Role</Label>
                <Select
                  value={role}
                  onValueChange={v => setRole(v as "viewer" | "editor")}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="viewer">Viewer (read-only)</SelectItem>
                    <SelectItem value="editor">Editor (co-edit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <Button onClick={submit} disabled={invite.isPending}>
                {invite.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Plus className="w-4 h-4 mr-2" />
                )}
                Create invite link
              </Button>
              <Button variant="outline" onClick={printWhitelabel}>
                <Printer className="w-4 h-4 mr-2" />
                White-label print
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <h3 className="font-serif font-semibold mb-3">
              Active collaborators
            </h3>
            {list.isLoading && (
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading…
              </p>
            )}
            {!list.isLoading && (!list.data || list.data.length === 0) && (
              <p className="text-sm text-muted-foreground font-sans">
                No collaborators yet — invite a tour operator above.
              </p>
            )}
            <div className="space-y-2">
              {list.data?.map(c => {
                const expired = new Date() > new Date(c.expiresAt);
                return (
                  <div
                    key={c.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-sans text-sm font-medium truncate">
                        {c.name || c.email}
                        <span className="text-muted-foreground ml-2 text-xs">
                          {c.email}
                        </span>
                      </p>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge
                          variant="outline"
                          className="text-xs uppercase tracking-wide"
                        >
                          {c.role}
                        </Badge>
                        {c.acceptedAt ? (
                          <Badge className="bg-emerald-100 text-emerald-800 border-0 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" /> Accepted
                          </Badge>
                        ) : expired ? (
                          <Badge className="bg-muted text-muted-foreground border-0 text-xs">
                            Expired
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-800 border-0 text-xs">
                            <Clock className="w-3 h-3 mr-1" /> Pending
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {!c.acceptedAt && !expired && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => copyLink(c.token)}
                        >
                          <Copy className="w-3.5 h-3.5 mr-1" /> Copy link
                        </Button>
                      )}
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => revoke.mutate({ id: c.id })}
                        aria-label="Revoke"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
