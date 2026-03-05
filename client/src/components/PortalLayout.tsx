import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard, Calendar, FileText, Globe, MessageSquare,
  CheckSquare, Plane, Bell, LogOut, BookOpen, Menu, X, ChevronRight
} from "lucide-react";
import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import NotificationBell from "@/components/NotificationBell";

const NAV_ITEMS = [
  { href: "/portal", label: "Dashboard", icon: LayoutDashboard },
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

  const handleLogout = () => logoutMutation.mutate();

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="p-6 border-b border-sidebar-border">
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="w-4.5 h-4.5 text-sidebar-primary-foreground" />
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
          <div className="w-9 h-9 rounded-full bg-sidebar-primary/20 flex items-center justify-center text-sidebar-primary font-serif font-bold text-sm">
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
          const isActive = location === item.href || (item.href !== "/portal" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer group ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="font-sans text-sm font-medium">{item.label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-sidebar-border">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent font-sans"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4 mr-2" />
          Sign Out
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 flex-col bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-sidebar flex flex-col h-full shadow-2xl">
            <button
              className="absolute top-4 right-4 text-sidebar-foreground/60 hover:text-sidebar-foreground"
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
        {/* Top bar */}
        <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              className="md:hidden text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              {title && (
                <h1 className="text-xl font-serif font-semibold text-foreground">{title}</h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground font-sans">{subtitle}</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs hidden sm:flex">
              Client Portal
            </Badge>
            <NotificationBell />
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
