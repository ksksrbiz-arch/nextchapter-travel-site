import { usePushNotifications } from "@/hooks/usePushNotifications";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Bell,
  BellOff,
  BellRing,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function PushNotificationSettings() {
  const {
    status,
    isSubscribed,
    isSupported,
    requestPermissionAndSubscribe,
    unsubscribe,
  } = usePushNotifications();

  if (!isSupported) {
    return (
      <div className="flex items-start gap-3 p-4 bg-muted/50 rounded-xl border border-border">
        <BellOff className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-sans font-medium text-foreground">
            Push Notifications Unavailable
          </p>
          <p className="text-xs text-muted-foreground font-sans mt-0.5">
            Your browser does not support push notifications. Try Chrome or
            Firefox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card border border-border rounded-xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              isSubscribed ? "bg-green-500/10" : "bg-secondary/10"
            }`}
          >
            {isSubscribed ? (
              <BellRing className="w-5 h-5 text-green-600" />
            ) : (
              <Bell className="w-5 h-5 text-secondary" />
            )}
          </div>
          <div>
            <p className="text-sm font-sans font-semibold text-foreground">
              Browser Push Notifications
            </p>
            <p className="text-xs text-muted-foreground font-sans">
              Get notified even when the app is closed
            </p>
          </div>
        </div>
        <Badge
          className={`font-sans text-xs ${
            isSubscribed
              ? "bg-green-500/10 text-green-600 border-green-500/20"
              : status === "denied"
                ? "bg-red-500/10 text-red-600 border-red-500/20"
                : "bg-muted text-muted-foreground border-border"
          }`}
        >
          {isSubscribed ? "Enabled" : status === "denied" ? "Blocked" : "Off"}
        </Badge>
      </div>

      {status === "denied" ? (
        <div className="flex items-start gap-2 p-3 bg-red-500/5 border border-red-500/20 rounded-lg">
          <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-xs font-sans text-red-600">
            Notifications are blocked. To enable them, click the lock icon in
            your browser's address bar and allow notifications for this site.
          </p>
        </div>
      ) : isSubscribed ? (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs text-green-600 font-sans">
            <CheckCircle2 className="w-3.5 h-3.5" />
            You'll receive push notifications from Jessica
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={unsubscribe}
            className="font-sans text-muted-foreground hover:text-foreground"
          >
            <BellOff className="w-3.5 h-3.5 mr-1.5" />
            Disable Push Notifications
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground font-sans">
            Enable push notifications to receive real-time updates about your
            trip, messages from Jessica, and important travel alerts — even when
            you're not on the site.
          </p>
          <Button
            size="sm"
            onClick={requestPermissionAndSubscribe}
            disabled={status === "loading"}
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans"
          >
            {status === "loading" ? (
              <>
                <div className="w-3.5 h-3.5 mr-1.5 border-2 border-secondary-foreground/30 border-t-secondary-foreground rounded-full animate-spin" />
                Enabling...
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 mr-1.5" />
                Enable Push Notifications
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
