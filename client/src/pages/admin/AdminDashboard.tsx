import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { toast } from "sonner";
import {
  Users,
  Plane,
  MessageSquare,
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  Settings,
  TrendingUp,
  Calendar,
  FileText,
  Globe,
  CheckSquare,
  Radio,
} from "lucide-react";

const ADMIN_NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/clients", label: "Clients", icon: Users },
  { href: "/admin/trips", label: "Trips", icon: Plane },
  { href: "/admin/messages", label: "Messages", icon: MessageSquare },
  { href: "/admin/guides", label: "Destination Guides", icon: Globe },
  { href: "/admin/alerts", label: "Send Alerts", icon: Bell },
  { href: "/admin/notifications", label: "Notifications", icon: Radio },
];

function AdminLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}) {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      logout();
      toast.success("Signed out");
    },
  });

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div
        className="p-5 border-b border-sidebar-border"
        style={{ paddingTop: "max(1.25rem, env(safe-area-inset-top))" }}
      >
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <div className="text-sidebar-foreground font-serif font-semibold text-sm">
                Next Chapter Travel
              </div>
              <div className="text-sidebar-foreground/50 text-xs font-sans">
                Admin Dashboard
              </div>
            </div>
          </div>
        </Link>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3 p-3 rounded-xl bg-sidebar-accent">
          <div className="w-9 h-9 rounded-full bg-secondary/20 flex items-center justify-center text-secondary font-serif font-bold text-sm">
            JS
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sidebar-foreground font-sans text-sm font-medium">
              Jessica Seiders
            </div>
            <div className="text-sidebar-foreground/50 text-xs font-sans">
              Travel Advisor
            </div>
          </div>
          <Badge className="bg-secondary/20 text-secondary border-0 font-sans text-xs">
            Admin
          </Badge>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {ADMIN_NAV.map(item => {
          const isActive =
            location === item.href ||
            (item.href !== "/admin" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer ${
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                }`}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="font-sans text-sm font-medium">
                  {item.label}
                </span>
                {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </div>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-sidebar-border space-y-1">
        <Link href="/portal">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground cursor-pointer transition-all">
            <Settings className="w-4 h-4" />
            <span className="font-sans text-sm">Client View</span>
          </div>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent font-sans"
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
      <aside className="hidden md:flex w-64 flex-col bg-sidebar flex-shrink-0">
        <SidebarContent />
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="relative w-72 bg-sidebar flex flex-col h-full shadow-2xl animate-in slide-in-from-left duration-300">
            <button
              className="absolute top-4 right-4 text-sidebar-foreground/60 p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <main className="flex-1 flex flex-col overflow-hidden">
        <header
          className="flex items-center justify-between px-4 sm:px-6 border-b border-border bg-card flex-shrink-0"
          style={{
            paddingTop: "max(0.75rem, env(safe-area-inset-top))",
            paddingBottom: "0.75rem",
          }}
        >
          <div className="flex items-center gap-3">
            <button
              className="md:hidden text-muted-foreground p-2 min-h-[44px] min-w-[44px] flex items-center justify-center"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              {title && (
                <h1 className="text-xl font-serif font-semibold text-foreground">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="text-sm text-muted-foreground font-sans">
                  {subtitle}
                </p>
              )}
            </div>
          </div>
          <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs hidden sm:flex">
            Admin Panel
          </Badge>
        </header>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 pb-6">{children}</div>
      </main>
    </div>
  );
}

export default function AdminDashboard() {
  const { data: stats, isLoading } = trpc.admin.stats.useQuery();
  const { data: clients } = trpc.admin.clients.useQuery();
  const { data: trips } = trpc.trips.list.useQuery();

  const recentClients = clients?.slice(0, 5) ?? [];
  const recentTrips = trips?.slice(0, 5) ?? [];

  const statCards = [
    {
      label: "Total Clients",
      value: stats?.totalClients ?? 0,
      icon: Users,
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Active Trips",
      value: stats?.activeTrips ?? 0,
      icon: Plane,
      color: "text-green-600 bg-green-50",
    },
    {
      label: "Total Trips",
      value: stats?.totalTrips ?? 0,
      icon: Calendar,
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Unread Messages",
      value: stats?.unreadMessages ?? 0,
      icon: MessageSquare,
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Jessica">
      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
        {statCards.map(s => (
          <Card key={s.label}>
            <CardContent className="p-3 sm:p-5">
              <div className="flex items-center justify-between mb-2 sm:mb-3">
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center ${s.color}`}
                >
                  <s.icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <TrendingUp className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="text-xl sm:text-2xl font-serif font-bold text-foreground">
                {s.value}
              </div>
              <div className="text-sm font-sans text-muted-foreground mt-0.5">
                {s.label}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent clients */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-base">
                Recent Clients
              </CardTitle>
              <Link href="/admin/clients">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary font-sans text-xs"
                >
                  View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentClients.length === 0 ? (
              <p className="text-muted-foreground font-sans text-sm text-center py-4">
                No clients yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentClients.map(client => (
                  <div key={client.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-serif font-bold text-xs">
                      {client.name?.charAt(0) ?? "?"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-foreground truncate">
                        {client.name ?? "Unknown"}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground truncate">
                        {client.email ?? ""}
                      </p>
                    </div>
                    <Link href={`/admin/clients/${client.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-secondary font-sans text-xs"
                      >
                        View
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent trips */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="font-serif text-base">
                Recent Trips
              </CardTitle>
              <Link href="/admin/trips">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-secondary font-sans text-xs"
                >
                  View All <ChevronRight className="w-3.5 h-3.5 ml-1" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentTrips.length === 0 ? (
              <p className="text-muted-foreground font-sans text-sm text-center py-4">
                No trips yet
              </p>
            ) : (
              <div className="space-y-3">
                {recentTrips.map(trip => (
                  <div key={trip.id} className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-secondary/10 flex items-center justify-center">
                      <Plane className="w-4 h-4 text-secondary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-sans text-sm font-medium text-foreground truncate">
                        {trip.title}
                      </p>
                      <p className="font-sans text-xs text-muted-foreground truncate">
                        {trip.destination}
                      </p>
                    </div>
                    <Badge
                      className={`text-xs font-sans ${
                        trip.status === "confirmed"
                          ? "bg-green-100 text-green-800"
                          : trip.status === "active"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {trip.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

// Export AdminLayout for use in other admin pages
export { AdminLayout };
