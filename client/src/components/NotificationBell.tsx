import { useState, useRef, useEffect } from "react";
import {
  Bell,
  BellRing,
  Check,
  CheckCheck,
  X,
  Plane,
  MessageSquare,
  FileText,
  Calendar,
  AlertTriangle,
  Settings,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { useSSEMessages } from "@/hooks/useSSEMessages";

const TYPE_ICONS: Record<string, React.ElementType> = {
  message: MessageSquare,
  itinerary: Calendar,
  document: FileText,
  alert: AlertTriangle,
  booking: Plane,
  system: Settings,
};

const TYPE_COLORS: Record<string, string> = {
  message: "bg-blue-500/10 text-blue-600",
  itinerary: "bg-secondary/10 text-secondary",
  document: "bg-purple-500/10 text-purple-600",
  alert: "bg-red-500/10 text-red-600",
  booking: "bg-green-500/10 text-green-600",
  system: "bg-muted text-muted-foreground",
};

function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const seconds = Math.floor((Date.now() - d.getTime()) / 1000);
  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const { data: unreadCount = 0, refetch: refetchCount } =
    trpc.notifications.unreadCount.useQuery(undefined, {
      refetchInterval: 30000, // poll every 30s
    });

  // Instantly bump unread count when a new message arrives via SSE
  useSSEMessages({
    onMessage: () => {
      refetchCount();
    },
    enabled: true,
  });

  const { data: notifications = [], refetch: refetchList } =
    trpc.notifications.list.useQuery({ limit: 30 }, { enabled: open });

  const markRead = trpc.notifications.markRead.useMutation({
    onSuccess: () => {
      refetchCount();
      refetchList();
    },
  });

  const markAllRead = trpc.notifications.markAllRead.useMutation({
    onSuccess: () => {
      refetchCount();
      refetchList();
    },
  });

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const hasUnread = unreadCount > 0;

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          "relative p-2 rounded-xl transition-all duration-200",
          open
            ? "bg-secondary/20 text-secondary"
            : "hover:bg-accent text-muted-foreground hover:text-foreground"
        )}
        aria-label="Notifications"
      >
        {hasUnread ? (
          <BellRing className="w-5 h-5 animate-[wiggle_0.5s_ease-in-out]" />
        ) : (
          <Bell className="w-5 h-5" />
        )}
        {hasUnread && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 leading-none">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-[360px] bg-card border border-border rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in-0 slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-secondary" />
              <span className="font-serif font-semibold text-foreground">
                Notifications
              </span>
              {hasUnread && (
                <Badge className="bg-red-500/10 text-red-600 border-0 text-xs px-1.5 py-0">
                  {unreadCount} new
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1">
              {hasUnread && (
                <button
                  onClick={() => markAllRead.mutate()}
                  className="text-xs text-muted-foreground hover:text-secondary transition-colors flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-accent"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  All read
                </button>
              )}
              <button
                onClick={() => setOpen(false)}
                className="p-1 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Notification list */}
          <ScrollArea className="max-h-[420px]">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center px-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="w-6 h-6 text-muted-foreground" />
                </div>
                <p className="text-sm font-sans text-muted-foreground">
                  You're all caught up!
                </p>
                <p className="text-xs text-muted-foreground/60 mt-1">
                  No notifications yet.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {notifications.map(notif => {
                  const Icon = TYPE_ICONS[notif.type] ?? Settings;
                  const colorClass =
                    TYPE_COLORS[notif.type] ?? TYPE_COLORS.system;
                  return (
                    <div
                      key={notif.id}
                      className={cn(
                        "flex gap-3 px-4 py-3 cursor-pointer hover:bg-accent/50 transition-colors",
                        !notif.isRead && "bg-secondary/5"
                      )}
                      onClick={() => {
                        if (!notif.isRead) markRead.mutate({ id: notif.id });
                        if (notif.actionUrl)
                          window.location.href = notif.actionUrl;
                      }}
                    >
                      <div
                        className={cn(
                          "w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5",
                          colorClass
                        )}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p
                            className={cn(
                              "text-sm font-sans leading-snug",
                              !notif.isRead
                                ? "font-semibold text-foreground"
                                : "text-foreground/80"
                            )}
                          >
                            {notif.title}
                          </p>
                          {!notif.isRead && (
                            <span className="w-2 h-2 rounded-full bg-secondary flex-shrink-0 mt-1.5" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 font-sans">
                          {notif.body}
                        </p>
                        <p className="text-[11px] text-muted-foreground/60 mt-1 font-sans">
                          {timeAgo(notif.createdAt)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </ScrollArea>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-4 py-2.5 border-t border-border bg-muted/30">
              <p className="text-xs text-center text-muted-foreground font-sans">
                Showing last {notifications.length} notifications
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
