import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Bell,
  Send,
  Users,
  User,
  MessageSquare,
  Calendar,
  FileText,
  Plane,
  AlertTriangle,
  Settings,
  Radio,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const NOTIFICATION_TYPES = [
  { value: "system", label: "System", icon: Settings },
  { value: "message", label: "Message", icon: MessageSquare },
  { value: "itinerary", label: "Itinerary Update", icon: Calendar },
  { value: "document", label: "Document", icon: FileText },
  { value: "booking", label: "Booking", icon: Plane },
  { value: "alert", label: "Alert", icon: AlertTriangle },
] as const;

const CHANNELS = [
  { value: "in_app", label: "In-App Only", desc: "Shows in notification bell" },
  { value: "email", label: "Email", desc: "Sends email notification" },
  {
    value: "push",
    label: "Browser Push",
    desc: "Push to browser if subscribed",
  },
  { value: "all", label: "All Channels", desc: "In-app + email + push" },
] as const;

const QUICK_TEMPLATES = [
  {
    title: "Trip Confirmation",
    body: "Great news! Your trip has been confirmed. Check your itinerary for the full details.",
    type: "itinerary" as const,
  },
  {
    title: "Document Ready",
    body: "Your travel documents have been uploaded to your Document Vault. Please review them.",
    type: "document" as const,
  },
  {
    title: "Departure Reminder",
    body: "Your trip departs in 48 hours! Make sure your bags are packed and documents are ready.",
    type: "alert" as const,
  },
  {
    title: "New Message from Jessica",
    body: "Jessica has sent you a message. Log in to your portal to read it.",
    type: "message" as const,
  },
  {
    title: "Booking Update",
    body: "There's been an update to one of your bookings. Check your Booking Tracker for details.",
    type: "booking" as const,
  },
];

export default function AdminNotifications() {
  const [mode, setMode] = useState<"targeted" | "broadcast">("targeted");
  const [selectedClientId, setSelectedClientId] = useState<string>("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<string>("system");
  const [channel, setChannel] = useState<string>("in_app");
  const [actionUrl, setActionUrl] = useState("");
  const [sent, setSent] = useState(false);

  const { data: clients = [] } = trpc.admin.clients.useQuery();

  const sendNotification = trpc.notifications.send.useMutation({
    onSuccess: () => {
      toast.success("Notification sent successfully!");
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setTitle("");
      setBody("");
      setActionUrl("");
    },
    onError: err => toast.error(err.message),
  });

  const broadcastNotification = trpc.notifications.broadcast.useMutation({
    onSuccess: data => {
      toast.success(
        `Broadcast sent to ${data.count} client${data.count !== 1 ? "s" : ""}!`
      );
      setSent(true);
      setTimeout(() => setSent(false), 3000);
      setTitle("");
      setBody("");
      setActionUrl("");
    },
    onError: err => toast.error(err.message),
  });

  const handleSend = () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and message body are required.");
      return;
    }
    const payload = {
      title: title.trim(),
      body: body.trim(),
      type: type as any,
      channel: channel as any,
      actionUrl: actionUrl.trim() || undefined,
    };
    if (mode === "broadcast") {
      broadcastNotification.mutate(payload);
    } else {
      if (!selectedClientId) {
        toast.error("Please select a client.");
        return;
      }
      sendNotification.mutate({ ...payload, userId: Number(selectedClientId) });
    }
  };

  const applyTemplate = (t: (typeof QUICK_TEMPLATES)[number]) => {
    setTitle(t.title);
    setBody(t.body);
    setType(t.type);
  };

  const isLoading =
    sendNotification.isPending || broadcastNotification.isPending;
  const clientCount = clients.filter(c => c.role === "user").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
          <Bell className="w-5 h-5 text-secondary" />
        </div>
        <div>
          <h2 className="text-xl font-serif font-semibold text-foreground">
            Send Notification
          </h2>
          <p className="text-sm text-muted-foreground font-sans">
            Reach clients across all channels
          </p>
        </div>
      </div>

      {/* Mode toggle */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setMode("targeted")}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
            mode === "targeted"
              ? "border-secondary bg-secondary/5"
              : "border-border hover:border-secondary/40"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${mode === "targeted" ? "bg-secondary/20" : "bg-muted"}`}
          >
            <User
              className={`w-4.5 h-4.5 ${mode === "targeted" ? "text-secondary" : "text-muted-foreground"}`}
            />
          </div>
          <div>
            <div className="font-sans font-semibold text-sm text-foreground">
              Targeted
            </div>
            <div className="text-xs text-muted-foreground font-sans">
              Send to one client
            </div>
          </div>
        </button>
        <button
          onClick={() => setMode("broadcast")}
          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${
            mode === "broadcast"
              ? "border-secondary bg-secondary/5"
              : "border-border hover:border-secondary/40"
          }`}
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center ${mode === "broadcast" ? "bg-secondary/20" : "bg-muted"}`}
          >
            <Radio
              className={`w-4.5 h-4.5 ${mode === "broadcast" ? "text-secondary" : "text-muted-foreground"}`}
            />
          </div>
          <div>
            <div className="font-sans font-semibold text-sm text-foreground">
              Broadcast
            </div>
            <div className="text-xs text-muted-foreground font-sans">
              All {clientCount} clients
            </div>
          </div>
        </button>
      </div>

      {/* Compose form */}
      <div className="bg-card border border-border rounded-2xl p-6 space-y-5">
        {/* Client selector (targeted only) */}
        {mode === "targeted" && (
          <div>
            <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">
              Recipient
            </label>
            <Select
              value={selectedClientId}
              onValueChange={setSelectedClientId}
            >
              <SelectTrigger className="font-sans">
                <SelectValue placeholder="Select a client..." />
              </SelectTrigger>
              <SelectContent>
                {clients
                  .filter(c => c.role === "user")
                  .map(client => (
                    <SelectItem key={client.id} value={String(client.id)}>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-secondary/20 flex items-center justify-center text-secondary text-xs font-bold">
                          {client.name?.charAt(0) ?? "?"}
                        </div>
                        <span>{client.name ?? "Unknown"}</span>
                        {client.email && (
                          <span className="text-muted-foreground text-xs">
                            ({client.email})
                          </span>
                        )}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Broadcast banner */}
        {mode === "broadcast" && (
          <div className="flex items-center gap-3 p-3 bg-secondary/10 border border-secondary/20 rounded-xl">
            <Users className="w-4 h-4 text-secondary flex-shrink-0" />
            <p className="text-sm font-sans text-secondary">
              This notification will be sent to all{" "}
              <strong>{clientCount}</strong> registered clients.
            </p>
          </div>
        )}

        {/* Type + Channel row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">
              Type
            </label>
            <Select value={type} onValueChange={setType}>
              <SelectTrigger className="font-sans">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_TYPES.map(t => (
                  <SelectItem key={t.value} value={t.value}>
                    <div className="flex items-center gap-2">
                      <t.icon className="w-4 h-4" />
                      {t.label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">
              Channel
            </label>
            <Select value={channel} onValueChange={setChannel}>
              <SelectTrigger className="font-sans">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CHANNELS.map(c => (
                  <SelectItem key={c.value} value={c.value}>
                    <div>
                      <div className="font-medium">{c.label}</div>
                      <div className="text-xs text-muted-foreground">
                        {c.desc}
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">
            Title
          </label>
          <Input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Your trip is confirmed!"
            className="font-sans"
            maxLength={255}
          />
        </div>

        {/* Body */}
        <div>
          <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">
            Message
          </label>
          <Textarea
            value={body}
            onChange={e => setBody(e.target.value)}
            placeholder="Write your notification message here..."
            className="font-sans resize-none"
            rows={4}
          />
        </div>

        {/* Action URL (optional) */}
        <div>
          <label className="text-sm font-sans font-medium text-foreground mb-1.5 block">
            Action URL{" "}
            <span className="text-muted-foreground font-normal">
              (optional)
            </span>
          </label>
          <Input
            value={actionUrl}
            onChange={e => setActionUrl(e.target.value)}
            placeholder="/portal/itinerary"
            className="font-sans"
          />
          <p className="text-xs text-muted-foreground mt-1 font-sans">
            Clicking the notification will navigate to this URL.
          </p>
        </div>

        {/* Send button */}
        <Button
          onClick={handleSend}
          disabled={isLoading || sent}
          className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans py-5"
          size="lg"
        >
          {sent ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Sent!
            </>
          ) : isLoading ? (
            <>
              <div className="w-4 h-4 mr-2 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
              Sending...
            </>
          ) : (
            <>
              {mode === "broadcast" ? (
                <Radio className="w-4 h-4 mr-2" />
              ) : (
                <Send className="w-4 h-4 mr-2" />
              )}
              {mode === "broadcast"
                ? `Broadcast to All Clients`
                : "Send Notification"}
            </>
          )}
        </Button>
      </div>

      {/* Quick templates */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-secondary" />
          <h3 className="text-sm font-sans font-semibold text-foreground">
            Quick Templates
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {QUICK_TEMPLATES.map(t => {
            const TypeIcon =
              NOTIFICATION_TYPES.find(n => n.value === t.type)?.icon ??
              Settings;
            return (
              <button
                key={t.title}
                onClick={() => applyTemplate(t)}
                className="flex items-start gap-3 p-3.5 rounded-xl border border-border hover:border-secondary/40 hover:bg-secondary/5 transition-all text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-secondary/20 transition-colors">
                  <TypeIcon className="w-4 h-4 text-secondary" />
                </div>
                <div>
                  <div className="text-sm font-sans font-medium text-foreground">
                    {t.title}
                  </div>
                  <div className="text-xs text-muted-foreground font-sans mt-0.5 line-clamp-2">
                    {t.body}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
