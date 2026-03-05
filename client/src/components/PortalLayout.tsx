import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Calendar, FileText, Globe, MessageSquare,
  CheckSquare, Plane, Bell, LogOut, BookOpen, X, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import NotificationBell from "@/components/NotificationBell";
import MobileBottomNav from "@/components/MobileBottomNav";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/portal/itinerary", label: "Itinerary", icon: Calendar },
  { href: "/portal/documents", label: "Documents", icon: FileText },
  { href: "/portal/guides", label: "Destination Guides", icon: Globe },
  { href: "/portal/messages", label: "Messages", icon: MessageSquare },
  { href: "/portal/packing", label: "Packing List", icon: CheckSquare },
  { href: "/portal/bookings", label: "Bookings", icon: Plane },
  { href: "/portal/alerts", label: "Alerts", icon: Bell },
];

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PortalLayout({ children, title, subtitle }: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      toast.success("Signed out successfully");
    },
  });

  const isActive = (href: string, exact = false) => {
    if (exact) return location === href;
    return location === href || location.startsWith(href + "/");
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border" style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}>
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <div className="text-sidebar-foreground font-serif font-semibold text-sm leading-tight">
                Next Chapter Travel
              </div>
              <div className="text-sidebar-foreground/50 text-xs font-sans">Jessica Seiders</div>
            </div>
          </div>
        </Link>
      </div>

      {/* User info */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
          <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-serif font-bold text-sm flex-shrink-0">
            {user?.name?.charAt(0) ?? "?"}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sidebar-foreground font-sans text-sm font-medium truncate">
              {user?.name ?? "Traveler"}
            </div>
            <div className="text-sidebar-foreground/50 text-xs font-sans truncate">
              {user?.email ?? ""}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item.href, item.exact);
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-3 rounded-xl transition-all cursor-pointer group",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="font-sans text-sm font-medium">{item.label}</span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border" style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent font-sans min-h-[44px]"
          onClick={() => logoutMutation.mutate()}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-[100dvh] bg-background overflow-hidden">
      {/* Desktop Sidebar — hidden on mobile */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay (slide-in from left, for edge cases) */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-sidebar flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header
          className="flex items-center justify-between px-4 md:px-6 border-b border-border bg-card/95 backdrop-blur-sm flex-shrink-0"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingBottom: "0.75rem",
          }}
        >
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {/* Mobile: show brand logo instead of hamburger (bottom nav handles navigation) */}
            <Link href="/" className="md:hidden flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <BookOpen className="w-3.5 h-3.5 text-primary-foreground" />
              </div>
            </Link>
            <div className="min-w-0">
              {title && (
                <h1 className="text-base md:text-xl font-serif font-semibold text-foreground truncate leading-tight">{title}</h1>
              )}
              {subtitle && (
                <p className="text-xs md:text-sm text-muted-foreground font-sans truncate">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs hidden sm:flex">
              Client Portal
            </Badge>
            <NotificationBell />
          </div>
        </header>

        {/* Page content — extra bottom padding on mobile for bottom nav */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 pb-24 md:pb-6">
          {children}
        </div>
      </main>

      {/* Mobile bottom navigation */}
      <MobileBottomNav />
    </div>
  );
}
