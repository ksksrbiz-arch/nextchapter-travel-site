import { AdminLayout } from "./AdminDashboard";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "sonner";
import {
  Bell,
  Send,
  Info,
  AlertTriangle,
  AlertOctagon,
  Loader2,
} from "lucide-react";

export default function AdminAlerts() {
  const { data: clients } = trpc.admin.clients.useQuery();
  const [form, setForm] = useState({
    title: "",
    content: "",
    severity: "info" as "info" | "warning" | "urgent",
    userId: "all",
  });

  const createAlert = trpc.alerts.create.useMutation({
    onSuccess: () => {
      toast.success("Alert sent successfully!");
      setForm({ title: "", content: "", severity: "info", userId: "all" });
    },
    onError: e => toast.error(e.message),
  });

  const handleSend = () => {
    if (!form.title || !form.content) {
      toast.error("Title and content are required");
      return;
    }

    const targets =
      form.userId === "all"
        ? (clients ?? [])
        : (clients ?? []).filter(c => c.id.toString() === form.userId);

    if (targets.length === 0) {
      toast.error("No clients to send to");
      return;
    }

    // Send to each target
    Promise.all(
      targets.map(client =>
        createAlert.mutateAsync({
          title: form.title,
          content: form.content,
          severity: form.severity,
          userId: client.id,
        })
      )
    )
      .then(() => {
        toast.success(
          `Alert sent to ${targets.length} client${targets.length > 1 ? "s" : ""}!`
        );
      })
      .catch(e => toast.error(e.message));
  };

  const severityConfig = {
    info: {
      icon: Info,
      color: "text-blue-600",
      bg: "bg-blue-50 border-blue-200",
    },
    warning: {
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50 border-amber-200",
    },
    urgent: {
      icon: AlertOctagon,
      color: "text-red-600",
      bg: "bg-red-50 border-red-200",
    },
  };

  const preview = severityConfig[form.severity];
  const PreviewIcon = preview.icon;

  return (
    <AdminLayout
      title="Send Alerts"
      subtitle="Notify your clients with important travel updates"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Form */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-serif font-semibold text-foreground mb-5">
              Compose Alert
            </h3>
            <div className="space-y-4">
              <div>
                <Label className="font-sans text-sm font-medium">Send To</Label>
                <Select
                  value={form.userId}
                  onValueChange={v => setForm(f => ({ ...f, userId: v }))}
                >
                  <SelectTrigger className="mt-1.5 font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all" className="font-sans">
                      All Clients
                    </SelectItem>
                    {clients?.map(c => (
                      <SelectItem
                        key={c.id}
                        value={c.id.toString()}
                        className="font-sans"
                      >
                        {c.name ?? c.email ?? `Client #${c.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-sans text-sm font-medium">
                  Severity
                </Label>
                <Select
                  value={form.severity}
                  onValueChange={v =>
                    setForm(f => ({ ...f, severity: v as any }))
                  }
                >
                  <SelectTrigger className="mt-1.5 font-sans">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="info" className="font-sans">
                      ℹ️ Info
                    </SelectItem>
                    <SelectItem value="warning" className="font-sans">
                      ⚠️ Warning
                    </SelectItem>
                    <SelectItem value="urgent" className="font-sans">
                      🚨 Urgent
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="font-sans text-sm font-medium">Title</Label>
                <Input
                  value={form.title}
                  onChange={e =>
                    setForm(f => ({ ...f, title: e.target.value }))
                  }
                  placeholder="e.g., Flight Delay Notice"
                  className="mt-1.5 font-sans"
                />
              </div>
              <div>
                <Label className="font-sans text-sm font-medium">Message</Label>
                <Textarea
                  value={form.content}
                  onChange={e =>
                    setForm(f => ({ ...f, content: e.target.value }))
                  }
                  placeholder="Write your alert message here..."
                  className="mt-1.5 font-sans"
                  rows={4}
                />
              </div>
              <Button
                className="w-full bg-primary text-primary-foreground font-sans"
                onClick={handleSend}
                disabled={createAlert.isPending || !form.title || !form.content}
              >
                {createAlert.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Send className="w-4 h-4 mr-2" />
                )}
                Send Alert
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        <div>
          <h3 className="font-serif font-semibold text-foreground mb-4">
            Preview
          </h3>
          {form.title || form.content ? (
            <div
              className={`p-5 rounded-xl border ${preview.bg} flex items-start gap-4`}
            >
              <PreviewIcon
                className={`w-5 h-5 flex-shrink-0 mt-0.5 ${preview.color}`}
              />
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-sans font-semibold text-foreground">
                    {form.title || "Alert Title"}
                  </h4>
                  <Badge
                    className={`text-xs font-sans ${
                      form.severity === "info"
                        ? "bg-blue-100 text-blue-800"
                        : form.severity === "warning"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {form.severity.charAt(0).toUpperCase() +
                      form.severity.slice(1)}
                  </Badge>
                </div>
                <p className="text-foreground/80 font-sans text-sm leading-relaxed">
                  {form.content || "Your alert message will appear here..."}
                </p>
                <p className="text-muted-foreground font-sans text-xs mt-2">
                  {new Date().toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-xl p-8 text-center">
              <Bell className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground font-sans text-sm">
                Fill in the form to see a preview of your alert.
              </p>
            </div>
          )}

          {/* Tips */}
          <div className="mt-6 p-5 rounded-xl bg-muted/50 border border-border">
            <h4 className="font-serif font-semibold text-foreground mb-3 text-sm">
              Alert Tips
            </h4>
            <ul className="space-y-2 text-sm font-sans text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-secondary mt-0.5">•</span>
                Use <strong>Info</strong> for general updates (flight times,
                check-in reminders)
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-500 mt-0.5">•</span>
                Use <strong>Warning</strong> for weather advisories or minor
                changes
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                Use <strong>Urgent</strong> for cancellations, emergencies, or
                critical changes
              </li>
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
