import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Info,
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { NoAlertsEmptyState } from "@/components/ui/empty-states";
import { AlertsSkeleton } from "@/components/ui/skeletons";

const SEVERITY_CONFIG = {
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    badge: "bg-blue-100 text-blue-800",
    label: "Info",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    badge: "bg-amber-100 text-amber-800",
    label: "Warning",
  },
  urgent: {
    icon: AlertOctagon,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    badge: "bg-red-100 text-red-800",
    label: "Urgent",
  },
};

export default function Alerts() {
  const { data: alerts, isLoading, refetch } = trpc.alerts.list.useQuery({});

  const markRead = trpc.alerts.markRead.useMutation({
    onSuccess: () => refetch(),
    onError: e => toast.error(e.message),
  });

  const unread = alerts?.filter(a => !a.isRead) ?? [];
  const read = alerts?.filter(a => a.isRead) ?? [];

  return (
    <PortalLayout
      title="Travel Alerts"
      subtitle="Important updates from Jessica"
    >
      {isLoading && <AlertsSkeleton />}

      {!isLoading && (!alerts || alerts.length === 0) && <NoAlertsEmptyState />}

      {unread.length > 0 && (
        <div className="mb-8">
          <h3 className="text-base font-serif font-semibold text-foreground mb-3 flex items-center gap-2">
            Unread
            <Badge className="bg-secondary text-secondary-foreground border-0 font-sans text-xs">
              {unread.length}
            </Badge>
          </h3>
          <div className="space-y-3">
            {unread.map(alert => {
              const config =
                SEVERITY_CONFIG[
                  alert.severity as keyof typeof SEVERITY_CONFIG
                ] ?? SEVERITY_CONFIG.info;
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-5 rounded-xl border ${config.bg} flex items-start gap-4`}
                >
                  <Icon
                    className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.color}`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h4 className="font-sans font-semibold text-foreground">
                        {alert.title}
                      </h4>
                      <Badge
                        className={`text-xs font-sans flex-shrink-0 ${config.badge}`}
                      >
                        {config.label}
                      </Badge>
                    </div>
                    <p className="text-foreground/80 font-sans text-sm leading-relaxed">
                      {alert.content}
                    </p>
                    <div className="flex items-center justify-between mt-3">
                      <p className="text-muted-foreground font-sans text-xs">
                        {new Date(alert.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className={`font-sans text-xs ${config.color} hover:bg-white/50`}
                        onClick={() => markRead.mutate({ id: alert.id })}
                      >
                        <CheckCircle className="w-3.5 h-3.5 mr-1" />
                        Mark as Read
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {read.length > 0 && (
        <div>
          <h3 className="text-base font-serif font-semibold text-muted-foreground mb-3">
            Read
          </h3>
          <div className="space-y-3">
            {read.map(alert => {
              const config =
                SEVERITY_CONFIG[
                  alert.severity as keyof typeof SEVERITY_CONFIG
                ] ?? SEVERITY_CONFIG.info;
              const Icon = config.icon;
              return (
                <div
                  key={alert.id}
                  className="p-5 rounded-xl border border-border bg-muted/30 flex items-start gap-4 opacity-70"
                >
                  <Icon className="w-5 h-5 flex-shrink-0 mt-0.5 text-muted-foreground" />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-sans font-medium text-foreground text-sm">
                      {alert.title}
                    </h4>
                    <p className="text-muted-foreground font-sans text-sm leading-relaxed mt-1">
                      {alert.content}
                    </p>
                    <p className="text-muted-foreground font-sans text-xs mt-2">
                      {new Date(alert.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </PortalLayout>
  );
}
