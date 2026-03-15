import PortalLayout from "@/components/PortalLayout";
import { trpc } from "@/lib/trpc";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo } from "react";
import { useTrip } from "@/contexts/TripContext";
import {
  Plane,
  Hotel,
  Utensils,
  Activity,
  Bus,
  Clock,
  MapPin,
  Hash,
  Calendar,
  Loader2,
  Compass,
} from "lucide-react";

const CATEGORY_CONFIG: Record<
  string,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  flight: {
    icon: Plane,
    color: "text-blue-600",
    bg: "bg-blue-50 border-blue-200",
    label: "Flight",
  },
  hotel: {
    icon: Hotel,
    color: "text-green-600",
    bg: "bg-green-50 border-green-200",
    label: "Hotel",
  },
  activity: {
    icon: Activity,
    color: "text-amber-600",
    bg: "bg-amber-50 border-amber-200",
    label: "Activity",
  },
  dining: {
    icon: Utensils,
    color: "text-red-600",
    bg: "bg-red-50 border-red-200",
    label: "Dining",
  },
  transport: {
    icon: Bus,
    color: "text-purple-600",
    bg: "bg-purple-50 border-purple-200",
    label: "Transport",
  },
  free_time: {
    icon: Compass,
    color: "text-teal-600",
    bg: "bg-teal-50 border-teal-200",
    label: "Free Time",
  },
  other: {
    icon: Calendar,
    color: "text-gray-600",
    bg: "bg-gray-50 border-gray-200",
    label: "Other",
  },
};

export default function Itinerary() {
  const {
    trips,
    tripsLoading,
    selectedTripId: tripId,
    selectedTrip,
  } = useTrip();

  const { data: items, isLoading: itemsLoading } = trpc.itinerary.list.useQuery(
    { tripId: tripId! },
    { enabled: !!tripId }
  );

  const groupedByDay = useMemo(() => {
    if (!items) return {};
    return items.reduce(
      (acc, item) => {
        const day = item.dayNumber;
        if (!acc[day]) acc[day] = [];
        acc[day].push(item);
        return acc;
      },
      {} as Record<number, typeof items>
    );
  }, [items]);

  const days = Object.keys(groupedByDay)
    .map(Number)
    .sort((a, b) => a - b);

  const getDayDate = (dayNumber: number) => {
    if (!selectedTrip?.startDate) return null;
    const date = new Date(selectedTrip.startDate);
    date.setDate(date.getDate() + dayNumber - 1);
    return date;
  };

  return (
    <PortalLayout title="Trip Itinerary" subtitle="Your day-by-day schedule">
      {/* Trip selector is in the portal header (TripSwitcher) — no inline selector needed */}

      {/* Trip header */}
      {selectedTrip && (
        <div className="mb-8 p-6 rounded-2xl bg-primary text-primary-foreground">
          <h2 className="text-2xl font-serif font-bold mb-1">
            {selectedTrip.title}
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-primary-foreground/70 font-sans text-sm">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {selectedTrip.destination}
            </span>
            {selectedTrip.startDate && selectedTrip.endDate && (
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                {new Date(selectedTrip.startDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
                {" – "}
                {new Date(selectedTrip.endDate).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            )}
            {selectedTrip.confirmationCode && (
              <span className="flex items-center gap-1.5">
                <Hash className="w-4 h-4" />
                Ref: {selectedTrip.confirmationCode}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {(tripsLoading || itemsLoading) && (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
        </div>
      )}

      {/* Empty state */}
      {!tripsLoading && !trips?.length && (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            No Trips Yet
          </h3>
          <p className="text-muted-foreground font-sans text-sm">
            Your itinerary will appear here once Jessica creates your trip.
          </p>
        </div>
      )}

      {!itemsLoading && tripId && items?.length === 0 && (
        <div className="text-center py-16">
          <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
            Itinerary Coming Soon
          </h3>
          <p className="text-muted-foreground font-sans text-sm">
            Jessica is putting the finishing touches on your itinerary.
          </p>
        </div>
      )}

      {/* Day-by-day timeline */}
      {days.length > 0 && (
        <div className="space-y-8">
          {days.map(day => {
            const dayDate = getDayDate(day);
            const dayItems = groupedByDay[day];
            return (
              <div key={day}>
                {/* Day header */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-primary text-primary-foreground flex flex-col items-center justify-center">
                    <span className="text-xs font-sans opacity-70 uppercase tracking-wider">
                      Day
                    </span>
                    <span className="text-xl font-serif font-bold leading-none">
                      {day}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-serif font-semibold text-foreground">
                      {dayDate
                        ? dayDate.toLocaleDateString("en-US", {
                            weekday: "long",
                            month: "long",
                            day: "numeric",
                          })
                        : `Day ${day}`}
                    </h3>
                    <p className="text-muted-foreground font-sans text-sm">
                      {dayItems.length} event{dayItems.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                </div>

                {/* Timeline items */}
                <div className="ml-7 border-l-2 border-border pl-8 space-y-4">
                  {dayItems.map((item, idx) => {
                    const cat =
                      CATEGORY_CONFIG[item.category] ?? CATEGORY_CONFIG.other;
                    const Icon = cat.icon;
                    return (
                      <div key={item.id} className="relative">
                        {/* Timeline dot */}
                        <div
                          className={`absolute -left-[2.75rem] top-4 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${cat.bg}`}
                        >
                          <div
                            className={`w-2 h-2 rounded-full ${cat.color.replace("text-", "bg-")}`}
                          />
                        </div>

                        <Card className="hover:shadow-md transition-shadow">
                          <CardContent className="p-5">
                            <div className="flex items-start gap-4">
                              <div
                                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border ${cat.bg}`}
                              >
                                <Icon className={`w-5 h-5 ${cat.color}`} />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-2 mb-1">
                                  <h4 className="font-serif font-semibold text-foreground">
                                    {item.title}
                                  </h4>
                                  <Badge
                                    className={`text-xs font-sans flex-shrink-0 border ${cat.bg} ${cat.color}`}
                                  >
                                    {cat.label}
                                  </Badge>
                                </div>
                                {item.time && (
                                  <p className="text-muted-foreground font-sans text-sm flex items-center gap-1 mb-1">
                                    <Clock className="w-3.5 h-3.5" />
                                    {item.time}
                                  </p>
                                )}
                                {item.location && (
                                  <p className="text-muted-foreground font-sans text-sm flex items-center gap-1 mb-2">
                                    <MapPin className="w-3.5 h-3.5" />
                                    {item.location}
                                  </p>
                                )}
                                {item.description && (
                                  <p className="text-foreground/70 font-sans text-sm leading-relaxed">
                                    {item.description}
                                  </p>
                                )}
                                {item.confirmationNumber && (
                                  <p className="text-muted-foreground font-sans text-xs mt-2 flex items-center gap-1">
                                    <Hash className="w-3 h-3" />
                                    Confirmation: {item.confirmationNumber}
                                  </p>
                                )}
                                {item.notes && (
                                  <div className="mt-3 p-3 rounded-lg bg-muted/50 border border-border">
                                    <p className="text-muted-foreground font-sans text-xs italic">
                                      {item.notes}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </PortalLayout>
  );
}
