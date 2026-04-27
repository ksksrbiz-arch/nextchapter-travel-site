import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  CheckSquare,
  MoreHorizontal,
  FileText,
  Globe,
  Plane,
  Bell,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useVideoHero } from "@/contexts/VideoHeroContext";

// Primary 4 tabs always visible + "More" overflow
const PRIMARY_TABS = [
  {
    href: "/portal",
    label: "Home",
    icon: LayoutDashboard,
    exact: true,
    videoKey: "dashboard",
  },
  {
    href: "/portal/itinerary",
    label: "Itinerary",
    icon: Calendar,
    videoKey: "itinerary",
  },
  {
    href: "/portal/messages",
    label: "Messages",
    icon: MessageSquare,
    videoKey: "messages",
  },
  {
    href: "/portal/packing",
    label: "Packing",
    icon: CheckSquare,
    videoKey: "packing",
  },
];

const MORE_ITEMS = [
  {
    href: "/portal/documents",
    label: "Documents",
    icon: FileText,
    videoKey: "documents",
  },
  { href: "/portal/guides", label: "Guides", icon: Globe, videoKey: "guides" },
  {
    href: "/portal/bookings",
    label: "Bookings",
    icon: Plane,
    videoKey: "bookings",
  },
  { href: "/portal/alerts", label: "Alerts", icon: Bell, videoKey: "alerts" },
];

export default function MobileBottomNav() {
  const [location] = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);
  const { setVideoContext } = useVideoHero();

  const { data: unreadCount = 0 } = trpc.notifications.unreadCount.useQuery(
    undefined,
    {
      refetchInterval: 30000,
    }
  );

  const isActive = (href: string, exact = false) => {
    if (exact) return location === href;
    return location === href || location.startsWith(href + "/");
  };

  const isMoreActive = MORE_ITEMS.some(item => isActive(item.href));

  return (
    <>
      {/* Bottom nav bar — only visible on mobile */}
      <nav
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-card/95 backdrop-blur-xl border-t border-border"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <div className="flex items-stretch h-16">
          {PRIMARY_TABS.map(tab => {
            const active = isActive(tab.href, tab.exact);
            const isMessages = tab.href === "/portal/messages";
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className="flex-1"
                onClick={() => setVideoContext(tab.videoKey)}
              >
                <div
                  className={cn(
                    "flex flex-col items-center justify-center h-full gap-0.5 relative transition-all duration-200 active:scale-95",
                    active ? "text-secondary" : "text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "relative flex items-center justify-center w-11 h-8 rounded-xl transition-all duration-200",
                      active ? "bg-secondary/15" : ""
                    )}
                  >
                    <tab.icon
                      className={cn(
                        "w-5 h-5 transition-all",
                        active ? "stroke-[2.5px]" : "stroke-[1.5px]"
                      )}
                    />
                    {isMessages && unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center px-1 shadow-md ring-2 ring-card">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[10px] font-sans transition-all",
                      active ? "font-semibold" : "font-normal"
                    )}
                  >
                    {tab.label}
                  </span>
                  {active && (
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-secondary rounded-full" />
                  )}
                </div>
              </Link>
            );
          })}

          {/* More button */}
          <button
            onClick={() => setMoreOpen(true)}
            aria-label="More portal options"
            className="flex-1 flex flex-col items-center justify-center h-full gap-0.5 relative transition-all duration-200 active:scale-95"
          >
            <div
              className={cn(
                "flex items-center justify-center w-11 h-8 rounded-xl transition-all duration-200",
                isMoreActive ? "bg-secondary/15" : ""
              )}
            >
              <MoreHorizontal
                className={cn(
                  "w-5 h-5 transition-all",
                  isMoreActive
                    ? "text-secondary stroke-[2.5px]"
                    : "text-muted-foreground stroke-[1.5px]"
                )}
              />
            </div>
            <span
              className={cn(
                "text-[10px] font-sans",
                isMoreActive
                  ? "text-secondary font-semibold"
                  : "text-muted-foreground font-normal"
              )}
            >
              More
            </span>
            {isMoreActive && (
              <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-secondary rounded-full" />
            )}
          </button>
        </div>
      </nav>

      {/* "More" bottom sheet */}
      <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
        <SheetContent
          side="bottom"
          className="rounded-t-3xl pb-safe max-h-[85dvh] overflow-y-auto"
        >
          <SheetHeader className="pb-4">
            <SheetTitle className="font-serif text-foreground text-left">
              More Options
            </SheetTitle>
          </SheetHeader>
          <div className="grid grid-cols-4 gap-3 pb-6 stagger-children">
            {MORE_ITEMS.map(item => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setVideoContext(item.videoKey)}
                >
                  <div
                    onClick={() => setMoreOpen(false)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-3 rounded-2xl transition-all active:scale-95",
                      active ? "bg-secondary/15" : "bg-muted/50 hover:bg-muted"
                    )}
                  >
                    <div
                      className={cn(
                        "w-11 h-11 rounded-xl flex items-center justify-center",
                        active ? "bg-secondary/20" : "bg-card"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "w-5 h-5",
                          active ? "text-secondary" : "text-muted-foreground"
                        )}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-[11px] font-sans text-center leading-tight",
                        active
                          ? "text-secondary font-semibold"
                          : "text-foreground font-medium"
                      )}
                    >
                      {item.label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
