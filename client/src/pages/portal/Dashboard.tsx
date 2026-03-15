import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Calendar,
  Plane,
  FileText,
  MessageSquare,
  CheckSquare,
  Globe,
  Bell,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import PushNotificationSettings from "@/components/PushNotificationSettings";

import React from "react";

const STATUS_COLORS: Record<string, string> = {
  planning: "bg-blue-100 text-blue-800",
  confirmed: "bg-green-100 text-green-800",
  active: "bg-amber-100 text-amber-800",
  completed: "bg-gray-100 text-gray-700",
  cancelled: "bg-red-100 text-red-700",
};

interface Trip {
  id: number;
  title: string;
  destination: string;
  startDate: string | Date | null;
  endDate?: string | Date | null;
  status: string;
  coverImageUrl?: string | null;
}

function TripCountdownWidget({ trip }: { trip: Trip }) {
  const [countdown, setCountdown] = React.useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  React.useEffect(() => {
    const calculateCountdown = () => {
      if (!trip.startDate) return;
      const startDate = new Date(trip.startDate).getTime();
      const now = new Date().getTime();
      const difference = startDate - now;

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      } else {
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    return () => clearInterval(interval);
  }, [trip.startDate]);

  if (!countdown) return null;

  const isActive = trip.status === "active";
  const isCompleted = trip.status === "completed";

  return (
    <div className="mb-8 rounded-2xl overflow-hidden bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent border border-secondary/20 p-6 sm:p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg sm:text-xl font-serif font-bold text-foreground flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            {isActive
              ? "Currently Traveling"
              : isCompleted
                ? "Trip Completed"
                : "Countdown to Adventure"}
          </h3>
          <p className="text-muted-foreground font-sans text-sm mt-1">
            {trip.title}
          </p>
        </div>
      </div>

      {!isCompleted ? (
        <div className="grid grid-cols-4 gap-2 sm:gap-4">
          {[
            { value: countdown.days, label: "Days" },
            { value: countdown.hours, label: "Hours" },
            { value: countdown.minutes, label: "Mins" },
            { value: countdown.seconds, label: "Secs" },
          ].map(item => (
            <div key={item.label} className="flex flex-col items-center">
              <div className="w-full aspect-square rounded-xl bg-secondary/20 border border-secondary/30 flex items-center justify-center mb-2 hover:bg-secondary/30 transition-colors">
                <span className="text-2xl sm:text-4xl font-serif font-bold text-secondary">
                  {String(item.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-xs sm:text-sm font-sans font-medium text-muted-foreground">
                {item.label}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-lg font-serif font-semibold text-foreground mb-2">
            ✨ Trip Completed!
          </p>
          <p className="text-muted-foreground font-sans text-sm">
            We hope you had an amazing adventure!
          </p>
        </div>
      )}

      {trip.endDate && !isCompleted && (
        <div className="mt-6 pt-6 border-t border-secondary/20">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-sans font-medium text-muted-foreground">
              Trip Progress
            </span>
            <span className="text-xs font-sans font-medium text-secondary">
              {trip.startDate
                ? new Date(trip.startDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}{" "}
              –{" "}
              {trip.endDate
                ? new Date(trip.endDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })
                : ""}
            </span>
          </div>
          <div className="w-full h-2 rounded-full bg-secondary/10 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-secondary to-secondary/60 rounded-full"
              style={{
                width: isActive ? "50%" : "0%",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default function PortalDashboard() {
  const { user } = useAuth();
  const { data: trips, isLoading } = trpc.trips.list.useQuery();
  const { data: alerts } = trpc.alerts.list.useQuery({});

  const activeTrip = trips?.find(
    t => t.status === "active" || t.status === "confirmed"
  );
  const upcomingTrips =
    trips?.filter(t => t.status === "planning" || t.status === "confirmed") ??
    [];
  const unreadAlerts = alerts?.filter(a => !a.isRead) ?? [];

  const quickLinks = [
    {
      href: "/portal/itinerary",
      icon: Calendar,
      label: "View Itinerary",
      color: "text-blue-600 bg-blue-50",
    },
    {
      href: "/portal/documents",
      icon: FileText,
      label: "My Documents",
      color: "text-green-600 bg-green-50",
    },
    {
      href: "/portal/messages",
      icon: MessageSquare,
      label: "Message Jessica",
      color: "text-purple-600 bg-purple-50",
    },
    {
      href: "/portal/packing",
      icon: CheckSquare,
      label: "Packing List",
      color: "text-amber-600 bg-amber-50",
    },
    {
      href: "/portal/guides",
      icon: Globe,
      label: "Destination Guide",
      color: "text-teal-600 bg-teal-50",
    },
    {
      href: "/portal/bookings",
      icon: Plane,
      label: "Bookings",
      color: "text-indigo-600 bg-indigo-50",
    },
  ];

  return (
    <PortalLayout
      title={`Welcome back, ${user?.name?.split(" ")[0] ?? "Traveler"}`}
      subtitle="Here's your travel overview"
    >
      {/* Alerts banner */}
      {unreadAlerts.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 flex items-start gap-3">
          <Bell className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-amber-800 font-sans font-medium text-sm">
              You have {unreadAlerts.length} unread alert
              {unreadAlerts.length > 1 ? "s" : ""}
            </p>
            <p className="text-amber-700 font-sans text-sm mt-0.5">
              {unreadAlerts[0]?.title}
            </p>
          </div>
          <Link href="/portal/alerts">
            <Button
              variant="ghost"
              size="sm"
              className="text-amber-700 hover:bg-amber-100 font-sans text-xs"
            >
              View All
            </Button>
          </Link>
        </div>
      )}

      {/* Trip Countdown Widget */}
      {activeTrip && activeTrip.startDate && (
        <TripCountdownWidget trip={activeTrip} />
      )}

      {/* Active Trip Hero */}
      {activeTrip ? (
        <div className="mb-8 relative rounded-2xl overflow-hidden bg-primary text-primary-foreground">
          <div className="absolute inset-0 opacity-20">
            <img
              src={
                activeTrip.coverImageUrl ||
                "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=1200&q=80"
              }
              alt={activeTrip.destination}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative p-8">
            <Badge className="mb-3 bg-secondary/90 text-secondary-foreground border-0 font-sans text-xs">
              {activeTrip.status === "active"
                ? "🌍 Currently Traveling"
                : "✈️ Upcoming Trip"}
            </Badge>
            <h2 className="text-3xl font-serif font-bold mb-2">
              {activeTrip.title}
            </h2>
            <div className="flex items-center gap-4 text-primary-foreground/70 font-sans text-sm mb-6">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                {activeTrip.destination}
              </span>
              {activeTrip.startDate && (
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  {new Date(activeTrip.startDate).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              )}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/portal/itinerary">
                <Button
                  size="sm"
                  className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-sans"
                >
                  View Itinerary <ArrowRight className="ml-1.5 w-3.5 h-3.5" />
                </Button>
              </Link>
              <Link href="/portal/documents">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 font-sans bg-transparent"
                >
                  Travel Documents
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-8 p-8 rounded-2xl border-2 border-dashed border-border text-center">
          <Plane className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            No Active Trip
          </h3>
          <p className="text-muted-foreground font-sans text-sm">
            Your upcoming trips will appear here once Jessica confirms your
            booking.
          </p>
        </div>
      )}

      {/* Quick Links */}
      <div className="mb-8">
        <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
          Quick Access
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickLinks.map(link => (
            <Link key={link.href} href={link.href}>
              <div className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-card hover:border-secondary/40 hover:shadow-md transition-all cursor-pointer group text-center">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center ${link.color}`}
                >
                  <link.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-sans font-medium text-foreground group-hover:text-secondary transition-colors leading-tight">
                  {link.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* All Trips */}
      {trips && trips.length > 0 && (
        <div>
          <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
            All Trips
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {trips.map(trip => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-serif font-semibold text-foreground truncate">
                          {trip.title}
                        </h4>
                        <Badge
                          className={`text-xs font-sans flex-shrink-0 ${STATUS_COLORS[trip.status]}`}
                        >
                          {trip.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground font-sans text-sm flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5" />
                        {trip.destination}
                      </p>
                      {trip.startDate && (
                        <p className="text-muted-foreground font-sans text-xs mt-1">
                          {new Date(trip.startDate).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                          {trip.endDate &&
                            ` – ${new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}`}
                        </p>
                      )}
                    </div>
                    <Link href={`/portal/itinerary?trip=${trip.id}`}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-secondary hover:bg-secondary/10 font-sans flex-shrink-0"
                      >
                        View <ArrowRight className="ml-1 w-3.5 h-3.5" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isLoading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {[1, 2].map(i => (
            <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      )}

      {/* Push Notification opt-in */}
      <div className="mt-8">
        <h3 className="text-lg font-serif font-semibold text-foreground mb-4">
          Notification Settings
        </h3>
        <PushNotificationSettings />
      </div>
    </PortalLayout>
  );
}
