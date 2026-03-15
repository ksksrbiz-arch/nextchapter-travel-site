import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Link, useParams } from "wouter";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Search,
  Plane,
  MessageSquare,
  ChevronRight,
  Mail,
  Calendar,
  ArrowLeft,
  Loader2,
  MapPin,
  UserPlus,
  Copy,
  CheckCircle,
} from "lucide-react";

export function AdminClientsList() {
  const { data: clients, isLoading } = trpc.admin.clients.useQuery();
  const [search, setSearch] = useState("");
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [generatedLink, setGeneratedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const createInvite = trpc.invites.create.useMutation({
    onSuccess: data => {
      setGeneratedLink(data.inviteUrl);
      if (data.emailSent) {
        toast.success(`Invite email sent to ${inviteEmail} ✉️`);
      } else {
        toast.warning(
          `Link created but email failed: ${data.emailError ?? "unknown error"}. Copy the link below.`
        );
      }
    },
    onError: err => {
      toast.error("Failed to create invite: " + err.message);
    },
  });

  const handleCreateInvite = () => {
    if (!inviteEmail) return;
    createInvite.mutate({
      email: inviteEmail,
      name: inviteName || undefined,
      origin: window.location.origin,
    });
  };

  const handleCopyLink = () => {
    if (!generatedLink) return;
    navigator.clipboard.writeText(generatedLink);
    setCopied(true);
    toast.success("Invite link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCloseInvite = () => {
    setShowInviteDialog(false);
    setInviteEmail("");
    setInviteName("");
    setGeneratedLink(null);
    setCopied(false);
  };

  const filtered =
    clients?.filter(
      c =>
        (c.name ?? "").toLowerCase().includes(search.toLowerCase()) ||
        (c.email ?? "").toLowerCase().includes(search.toLowerCase())
    ) ?? [];
  return (
    <AdminLayout title="Clients" subtitle="Manage your travel clients">
      {/* Search + Invite */}
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search clients by name or email..."
            className="pl-9 font-sans"
          />
        </div>
        <Button
          onClick={() => setShowInviteDialog(true)}
          className="bg-secondary text-secondary-foreground font-sans text-sm flex-shrink-0"
        >
          <UserPlus className="w-4 h-4 mr-2" />
          Send Portal Invite
        </Button>
      </div>

      {/* Invite Dialog */}
      <Dialog
        open={showInviteDialog}
        onOpenChange={open => {
          if (!open) handleCloseInvite();
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="font-serif">Send Portal Invite</DialogTitle>
            <DialogDescription className="font-sans text-sm">
              Generate a magic link to invite a client to their travel portal.
            </DialogDescription>
          </DialogHeader>
          {!generatedLink ? (
            <div className="space-y-4 mt-2">
              <div>
                <Label className="font-sans text-sm font-medium">
                  Client Name (optional)
                </Label>
                <Input
                  value={inviteName}
                  onChange={e => setInviteName(e.target.value)}
                  placeholder="Sarah Mitchell"
                  className="mt-1.5 font-sans"
                />
              </div>
              <div>
                <Label className="font-sans text-sm font-medium">
                  Client Email *
                </Label>
                <Input
                  type="email"
                  value={inviteEmail}
                  onChange={e => setInviteEmail(e.target.value)}
                  placeholder="sarah@example.com"
                  className="mt-1.5 font-sans"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  onClick={handleCloseInvite}
                  className="flex-1 font-sans"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleCreateInvite}
                  disabled={!inviteEmail || createInvite.isPending}
                  className="flex-1 bg-primary text-primary-foreground font-sans"
                >
                  {createInvite.isPending ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <Mail className="w-4 h-4 mr-2" />
                  )}
                  Send Invite Email
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4 mt-2">
              <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-sans font-medium text-green-800 text-sm">
                    {createInvite.data?.emailSent
                      ? `Email sent to ${inviteEmail}!`
                      : "Invite link generated!"}
                  </span>
                </div>
                <p className="text-green-700 font-sans text-xs">
                  {createInvite.data?.emailSent
                    ? `${inviteName || inviteEmail} will receive a branded email with their portal link. It expires in 7 days.`
                    : `This link expires in 7 days. Share it with ${inviteName || inviteEmail} to give them access to their portal.`}
                </p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="font-mono text-xs text-muted-foreground break-all">
                  {generatedLink}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCopyLink}
                  className="flex-1 bg-primary text-primary-foreground font-sans"
                >
                  {copied ? (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  ) : (
                    <Copy className="w-4 h-4 mr-2" />
                  )}
                  {copied ? "Copied!" : "Copy Link"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCloseInvite}
                  className="font-sans"
                >
                  Done
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {isLoading && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {!isLoading && filtered.length === 0 && (
        <div className="text-center py-16">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            {search ? "No clients found" : "No Clients Yet"}
          </h3>
          <p className="text-muted-foreground font-sans text-sm">
            {search
              ? "Try a different search term."
              : "Clients will appear here once they sign in."}
          </p>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(client => (
          <Card key={client.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-lg flex-shrink-0">
                  {client.name?.charAt(0) ?? "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-serif font-semibold text-foreground truncate">
                    {client.name ?? "Unknown"}
                  </h3>
                  <p className="text-muted-foreground font-sans text-xs truncate flex items-center gap-1 mt-0.5">
                    <Mail className="w-3 h-3" />
                    {client.email ?? "No email"}
                  </p>
                  <p className="text-muted-foreground font-sans text-xs mt-0.5 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Joined{" "}
                    {new Date(client.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/clients/${client.id}`} className="flex-1">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full font-sans text-xs"
                  >
                    View Profile <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </Link>
                <Link href={`/admin/trips/new?client=${client.id}`}>
                  <Button
                    size="sm"
                    className="bg-primary text-primary-foreground font-sans text-xs"
                  >
                    <Plane className="w-3.5 h-3.5" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </AdminLayout>
  );
}

export function AdminClientDetail() {
  const params = useParams<{ id: string }>();
  const clientId = Number(params.id);

  const { data: client, isLoading: clientLoading } =
    trpc.admin.getClient.useQuery({ id: clientId });
  const { data: trips, isLoading: tripsLoading } =
    trpc.admin.getClientTrips.useQuery({ userId: clientId });

  if (clientLoading) {
    return (
      <AdminLayout title="Client Profile">
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      </AdminLayout>
    );
  }

  if (!client) {
    return (
      <AdminLayout title="Client Not Found">
        <div className="text-center py-16">
          <p className="text-muted-foreground font-sans">Client not found.</p>
          <Link href="/admin/clients">
            <Button className="mt-4 font-sans">Back to Clients</Button>
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout
      title={client.name ?? "Client Profile"}
      subtitle={client.email ?? ""}
    >
      <Link href="/admin/clients">
        <Button
          variant="ghost"
          size="sm"
          className="mb-6 font-sans text-muted-foreground"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Clients
        </Button>
      </Link>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Client info */}
        <Card>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-3xl mx-auto mb-3">
                {client.name?.charAt(0) ?? "?"}
              </div>
              <h2 className="text-xl font-serif font-bold text-foreground">
                {client.name ?? "Unknown"}
              </h2>
              <p className="text-muted-foreground font-sans text-sm">
                {client.email ?? ""}
              </p>
            </div>
            <div className="space-y-3 text-sm font-sans">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Member Since</span>
                <span className="text-foreground font-medium">
                  {new Date(client.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Active</span>
                <span className="text-foreground font-medium">
                  {new Date(client.lastSignedIn).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total Trips</span>
                <span className="text-foreground font-medium">
                  {trips?.length ?? 0}
                </span>
              </div>
            </div>
            <div className="flex gap-2 mt-6">
              <Link
                href={`/admin/trips/new?client=${client.id}`}
                className="flex-1"
              >
                <Button
                  size="sm"
                  className="w-full bg-primary text-primary-foreground font-sans text-xs"
                >
                  <Plane className="w-3.5 h-3.5 mr-1.5" /> New Trip
                </Button>
              </Link>
              <Link
                href={`/admin/messages?client=${client.id}`}
                className="flex-1"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full font-sans text-xs"
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5" /> Message
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Trips */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-serif font-semibold text-foreground">
              Trips
            </h3>
            <Link href={`/admin/trips/new?client=${client.id}`}>
              <Button
                size="sm"
                className="bg-primary text-primary-foreground font-sans text-xs"
              >
                + New Trip
              </Button>
            </Link>
          </div>

          {tripsLoading && (
            <div className="flex justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-secondary" />
            </div>
          )}

          {!tripsLoading && (!trips || trips.length === 0) && (
            <div className="text-center py-12 border-2 border-dashed border-border rounded-2xl">
              <Plane className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-sans text-sm">
                No trips yet for this client.
              </p>
            </div>
          )}

          <div className="space-y-3">
            {trips?.map(trip => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-serif font-semibold text-foreground">
                        {trip.title}
                      </h4>
                      <p className="text-muted-foreground font-sans text-sm flex items-center gap-1 mt-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {trip.destination}
                      </p>
                      {trip.startDate && (
                        <p className="text-muted-foreground font-sans text-xs mt-1">
                          {new Date(trip.startDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                          {trip.endDate &&
                            ` – ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`text-xs font-sans ${
                          trip.status === "confirmed"
                            ? "bg-green-100 text-green-800"
                            : trip.status === "active"
                              ? "bg-amber-100 text-amber-800"
                              : trip.status === "completed"
                                ? "bg-gray-100 text-gray-700"
                                : "bg-blue-100 text-blue-800"
                        }`}
                      >
                        {trip.status}
                      </Badge>
                      <Link href={`/admin/trips/${trip.id}`}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-secondary font-sans text-xs"
                        >
                          Edit <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
