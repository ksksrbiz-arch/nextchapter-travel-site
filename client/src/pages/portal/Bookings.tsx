import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useTrip } from "@/contexts/TripContext";
import {
  Plane,
  Hotel,
  Ship,
  Map,
  Car,
  ArrowRight,
  Hash,
  Calendar,
  DollarSign,
  Loader2,
} from "lucide-react";
import { NoBookingsEmptyState } from "@/components/ui/empty-states";
import { BookingsSkeleton } from "@/components/ui/skeletons";

const TYPE_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  flight: {
    icon: Plane,
    color: "text-blue-600",
    bg: "bg-blue-50",
    label: "Flight",
  },
  hotel: {
    icon: Hotel,
    color: "text-green-600",
    bg: "bg-green-50",
    label: "Hotel",
  },
  cruise: {
    icon: Ship,
    color: "text-teal-600",
    bg: "bg-teal-50",
    label: "Cruise",
  },
  tour: {
    icon: Map,
    color: "text-amber-600",
    bg: "bg-amber-50",
    label: "Tour",
  },
  car_rental: {
    icon: Car,
    color: "text-purple-600",
    bg: "bg-purple-50",
    label: "Car Rental",
  },
  transfer: {
    icon: ArrowRight,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    label: "Transfer",
  },
  other: {
    icon: Calendar,
    color: "text-gray-600",
    bg: "bg-gray-50",
    label: "Other",
  },
};

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-700",
  waitlisted: "bg-orange-100 text-orange-800",
};

export default function Bookings() {
  const { selectedTripId: tripId } = useTrip();

  const { data: bookings, isLoading } = trpc.bookings.list.useQuery(
    { tripId: tripId! },
    { enabled: !!tripId }
  );

  const confirmedCount =
    bookings?.filter(b => b.status === "confirmed").length ?? 0;
  const pendingCount =
    bookings?.filter(b => b.status === "pending").length ?? 0;

  return (
    <PortalLayout
      title="Booking Tracker"
      subtitle="All your reservations in one place"
    >
      {/* Trip selector is in the portal header (TripSwitcher) */}

      {/* Stats */}
      {bookings && bookings.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-green-50 border border-green-200 text-center">
            <div className="text-2xl font-serif font-bold text-green-700">
              {confirmedCount}
            </div>
            <div className="text-xs font-sans text-green-600 mt-0.5">
              Confirmed
            </div>
          </div>
          <div className="p-4 rounded-xl bg-yellow-50 border border-yellow-200 text-center">
            <div className="text-2xl font-serif font-bold text-yellow-700">
              {pendingCount}
            </div>
            <div className="text-xs font-sans text-yellow-600 mt-0.5">
              Pending
            </div>
          </div>
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 text-center">
            <div className="text-2xl font-serif font-bold text-primary">
              {bookings.length}
            </div>
            <div className="text-xs font-sans text-muted-foreground mt-0.5">
              Total
            </div>
          </div>
        </div>
      )}

      {/* Loading */}
      {isLoading && <BookingsSkeleton />}

      {/* Empty state */}
      {!isLoading && tripId && (!bookings || bookings.length === 0) && (
        <NoBookingsEmptyState />
      )}

      {/* Bookings list */}
      <div className="space-y-4">
        {bookings?.map(booking => {
          const config = TYPE_CONFIG[booking.type] ?? TYPE_CONFIG.other;
          const Icon = config.icon;
          return (
            <Card
              key={booking.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent className="p-5">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${config.bg}`}
                  >
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <h4 className="font-serif font-semibold text-foreground">
                          {booking.vendor ?? config.label}
                        </h4>
                        <Badge
                          className={`text-xs font-sans mt-1 ${config.bg} ${config.color} border-0`}
                        >
                          {config.label}
                        </Badge>
                      </div>
                      <Badge
                        className={`text-xs font-sans flex-shrink-0 ${STATUS_COLORS[booking.status]}`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-x-6 gap-y-1 mt-3">
                      {booking.confirmationNumber && (
                        <div className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground">
                          <Hash className="w-3.5 h-3.5" />
                          {booking.confirmationNumber}
                        </div>
                      )}
                      {booking.checkIn && (
                        <div className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(booking.checkIn).toLocaleDateString(
                            "en-US",
                            { month: "short", day: "numeric" }
                          )}
                          {booking.checkOut &&
                            ` – ${new Date(booking.checkOut).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`}
                        </div>
                      )}
                      {booking.amount && (
                        <div className="flex items-center gap-1.5 text-sm font-sans text-muted-foreground">
                          <DollarSign className="w-3.5 h-3.5" />
                          {(booking.amount / 100).toLocaleString("en-US", {
                            style: "currency",
                            currency: booking.currency ?? "USD",
                          })}
                        </div>
                      )}
                    </div>
                    {booking.notes && (
                      <p className="text-muted-foreground font-sans text-xs mt-3 italic">
                        {booking.notes}
                      </p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </PortalLayout>
  );
}
