import { useAuth } from "@/_core/hooks/useAuth";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Globe,
  MessageSquare,
  CheckSquare,
  Plane,
  Bell,
  LogOut,
  BookOpen,
  X,
  ChevronRight,
  Keyboard,
  DollarSign,
  Shield,
  Cloud,
  Phone,
  Users,
  MapPin,
  AlertTriangle,
  Wallet,
  Heart,
  Building2,
  Backpack,
  Gift,
  Heart as HeartIcon,
  Languages,
  Lock,
  CreditCard,
  Clock,
  Navigation,
  Smartphone,
  AlertCircle,
  TrendingUp,
  Zap,
  Images,
  Archive,
  Compass,
} from "lucide-react";
import { useState, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import NotificationBell from "@/components/NotificationBell";
import MobileBottomNav from "@/components/MobileBottomNav";
import { cn } from "@/lib/utils";
import { useVideoHero, VIDEO_CATALOG } from "@/contexts/VideoHeroContext";
import { preloadVideo } from "@/components/GlobalVideoBackground";
import { TripProvider } from "@/contexts/TripContext";
import TripSwitcher from "@/components/TripSwitcher";
import {
  CommandPalette,
  useCommandPalette,
} from "@/components/ui/command-palette";
import {
  KeyboardShortcutsHelp,
  useKeyboardShortcutsHelp,
} from "@/components/ui/keyboard-shortcuts-help";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

const NAV_ITEMS = [
  {
    href: "/portal",
    label: "Dashboard",
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
    href: "/portal/timeline",
    label: "Timeline",
    icon: AlertTriangle,
    videoKey: "timeline",
  },
  {
    href: "/portal/documents",
    label: "Documents",
    icon: FileText,
    videoKey: "documents",
  },
  {
    href: "/portal/guides",
    label: "Destination Guides",
    icon: Globe,
    videoKey: "guides",
  },
  {
    href: "/portal/messages",
    label: "Messages",
    icon: MessageSquare,
    videoKey: "messages",
  },
  {
    href: "/portal/flights",
    label: "Flight Tracker",
    icon: Plane,
    videoKey: "flights",
  },
  {
    href: "/portal/hotel",
    label: "Hotel Bookings",
    icon: Building2,
    videoKey: "hotel",
  },
  {
    href: "/portal/packing",
    label: "Packing List",
    icon: Backpack,
    videoKey: "packing",
  },
  {
    href: "/portal/bookings",
    label: "Bookings",
    icon: Plane,
    videoKey: "bookings",
  },
  { href: "/portal/alerts", label: "Alerts", icon: Bell, videoKey: "alerts" },
  // Phase 1: Core Travel Features
  {
    href: "/portal/budget",
    label: "Budget Tracker",
    icon: Wallet,
    videoKey: "budget",
  },
  {
    href: "/portal/visa",
    label: "Visa Checklist",
    icon: Shield,
    videoKey: "visa",
  },
  {
    href: "/portal/weather",
    label: "Weather & Alerts",
    icon: Cloud,
    videoKey: "weather",
  },
  {
    href: "/portal/insurance",
    label: "Travel Insurance",
    icon: Heart,
    videoKey: "insurance",
  },
  {
    href: "/portal/currency",
    label: "Currency Converter",
    icon: DollarSign,
    videoKey: "currency",
  },
  {
    href: "/portal/emergency",
    label: "Emergency Contacts",
    icon: Phone,
    videoKey: "emergency",
  },
  {
    href: "/portal/travel-documents",
    label: "Travel Documents",
    icon: FileText,
    videoKey: "travel-documents",
  },
  {
    href: "/portal/group-travel",
    label: "Group Travel",
    icon: Users,
    videoKey: "group-travel",
  },
  {
    href: "/portal/recommendations",
    label: "Recommendations",
    icon: MapPin,
    videoKey: "recommendations",
  },
  // Phase 2: Loyalty & Health Features
  {
    href: "/portal/loyalty",
    label: "Loyalty Programs",
    icon: Gift,
    videoKey: "loyalty",
  },
  {
    href: "/portal/vaccination",
    label: "Vaccinations",
    icon: HeartIcon,
    videoKey: "vaccination",
  },
  {
    href: "/portal/translation",
    label: "Translation Helper",
    icon: Languages,
    videoKey: "translation",
  },
  // Phase 3: Documents & Currency Features
  {
    href: "/portal/documents-vault",
    label: "Document Vault",
    icon: Lock,
    videoKey: "documents-vault",
  },
  {
    href: "/portal/insurance-tracker",
    label: "Insurance Tracker",
    icon: Shield,
    videoKey: "insurance-tracker",
  },
  {
    href: "/portal/currency-converter",
    label: "Currency Converter",
    icon: CreditCard,
    videoKey: "currency-converter",
  },
  // Phase 4: In-Trip Mobile Experience
  {
    href: "/portal/live-itinerary",
    label: "Live Itinerary",
    icon: Clock,
    videoKey: "live-itinerary",
  },
  {
    href: "/portal/family-checkin",
    label: "Family Check-in",
    icon: Users,
    videoKey: "family-checkin",
  },
  {
    href: "/portal/location-guides",
    label: "Location Guides",
    icon: Navigation,
    videoKey: "location-guides",
  },
  {
    href: "/portal/crisis-management",
    label: "Crisis Management",
    icon: AlertTriangle,
    videoKey: "crisis-management",
  },
  {
    href: "/portal/flight-alternatives",
    label: "Flight Alternatives",
    icon: Plane,
    videoKey: "flight-alternatives",
  },
  {
    href: "/portal/expense-tracker",
    label: "Expense Tracker",
    icon: DollarSign,
    videoKey: "expense-tracker",
  },
  // Phase 4.5: Post-Trip Memory Curation
  {
    href: "/portal/memory-curation",
    label: "Memory Curation",
    icon: Images,
    videoKey: "memory-curation",
  },
  // Phase 5: Memory Archives & Rebooking
  {
    href: "/portal/memory-archives",
    label: "Memory Archives",
    icon: Archive,
    videoKey: "memory-archives",
  },
  // Phase 6: Business Operations & AI Co-pilot
  {
    href: "/portal/business-operations",
    label: "Business Operations",
    icon: Zap,
    videoKey: "business-operations",
  },
];

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function PortalLayout({
  children,
  title,
  subtitle,
}: PortalLayoutProps) {
  const { user, logout } = useAuth();
  const [location, navigate] = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { setVideoContext } = useVideoHero();

  // Command palette and keyboard shortcuts
  const commandPalette = useCommandPalette();
  const shortcutsHelp = useKeyboardShortcutsHelp();

  // Navigation shortcuts
  useKeyboardShortcuts([
    {
      combo: { key: "1", alt: true },
      handler: () => navigate("/portal"),
      description: "Dashboard",
    },
    {
      combo: { key: "2", alt: true },
      handler: () => navigate("/portal/itinerary"),
      description: "Itinerary",
    },
    {
      combo: { key: "3", alt: true },
      handler: () => navigate("/portal/messages"),
      description: "Messages",
    },
    {
      combo: { key: "4", alt: true },
      handler: () => navigate("/portal/packing"),
      description: "Packing",
    },
  ]);

  // Set video context based on current route on mount and route change
  useEffect(() => {
    const matched = NAV_ITEMS.find(item =>
      item.exact ? location === item.href : location.startsWith(item.href)
    );
    if (matched) setVideoContext(matched.videoKey);
  }, [location, setVideoContext]);

  // Preload all video pools on mount for instant transitions
  useEffect(() => {
    Object.values(VIDEO_CATALOG).forEach(pool => {
      if (pool && pool.length > 0) {
        // Preload first video immediately, rest after a delay
        preloadVideo(pool[0].src);
        if (pool.length > 1) {
          setTimeout(() => preloadVideo(pool[1].src), 500);
        }
      }
    });
  }, []);

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
      <div
        className="p-6 border-b border-sidebar-border"
        style={{ paddingTop: "max(1.5rem, env(safe-area-inset-top))" }}
      >
        <Link href="/">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-9 h-9 rounded-full bg-sidebar-primary flex items-center justify-center">
              <BookOpen className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div>
              <div className="text-sidebar-foreground font-serif font-semibold text-sm leading-tight">
                Next Chapter Travel
              </div>
              <div className="text-sidebar-foreground/50 text-xs font-sans">
                Jessica Seiders
              </div>
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
        {NAV_ITEMS.map(item => {
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
                onClick={() => {
                  setSidebarOpen(false);
                  setVideoContext(item.videoKey);
                }}
                onMouseEnter={() => {
                  // Preload next video in pool on hover for instant crossfade
                  const pool = VIDEO_CATALOG[item.videoKey];
                  if (pool && pool.length > 1) preloadVideo(pool[1].src);
                }}
              >
                <item.icon className="w-4.5 h-4.5 flex-shrink-0" />
                <span className="font-sans text-sm font-medium">
                  {item.label}
                </span>
                {active && <ChevronRight className="w-3.5 h-3.5 ml-auto" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div
        className="p-4 border-t border-sidebar-border"
        style={{ paddingBottom: "max(1rem, env(safe-area-inset-bottom))" }}
      >
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
    <TripProvider>
      <div
        className="flex h-[100dvh] overflow-hidden"
        style={{ backgroundColor: "transparent" }}
      >
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
                  <h1 className="text-base md:text-xl font-serif font-semibold text-foreground truncate leading-tight">
                    {title}
                  </h1>
                )}
                {subtitle && (
                  <p className="text-xs md:text-sm text-muted-foreground font-sans truncate">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {/* Quick search button (opens command palette) */}
              <button
                onClick={commandPalette.open}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/50 border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-sm font-sans"
                aria-label="Search (⌘K)"
              >
                <span className="text-xs">Search...</span>
                <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">
                  ⌘K
                </kbd>
              </button>
              <TripSwitcher />
              <Badge className="bg-secondary/10 text-secondary border-secondary/20 font-sans text-xs hidden sm:flex">
                Client Portal
              </Badge>
              <NotificationBell />
            </div>
          </header>

          {/* Page content — extra bottom padding on mobile for bottom nav + home indicator */}
          <div
            className="flex-1 overflow-y-auto p-4 md:p-6 portal-content-pad"
            style={{ backgroundColor: "transparent" }}
          >
            {children}
          </div>
        </main>

        {/* Mobile bottom navigation */}
        <MobileBottomNav />

        {/* Command palette (⌘K) */}
        <CommandPalette
          isOpen={commandPalette.isOpen}
          onClose={commandPalette.close}
        />

        {/* Keyboard shortcuts help (/) */}
        <KeyboardShortcutsHelp
          isOpen={shortcutsHelp.isOpen}
          onClose={shortcutsHelp.close}
        />
      </div>
    </TripProvider>
  );
}
