import React, { useState, useEffect } from "react";
import {
  Plane,
  Clock,
  MapPin,
  DollarSign,
  AlertCircle,
  CheckCircle2,
  Zap,
  TrendingDown,
  MapPinOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface FlightOption {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: number; // timestamp
  };
  arrival: {
    airport: string;
    time: number;
  };
  duration: number; // minutes
  stops: number;
  price: number;
  originalPrice: number;
  priceChange: number; // negative = cheaper
  seats: number;
  rating: number;
  recommendation?: "best-value" | "fastest" | "most-convenient";
  amenities: string[];
  cancellationFee: boolean;
  rebookingEligible: boolean;
}

interface FlightAlternativesProps {
  originalFlight?: {
    flightNumber: string;
    departure: {
      airport: string;
      time: number;
    };
    arrival: {
      airport: string;
      time: number;
    };
  };
  reason?: string;
  tripId: string;
}

// Mock flight alternatives database
const FLIGHT_OPTIONS: FlightOption[] = [
  {
    id: "1",
    airline: "American Airlines",
    flightNumber: "AA124",
    departure: { airport: "STL", time: Date.now() + 2 * 60 * 60 * 1000 },
    arrival: { airport: "MCO", time: Date.now() + 5 * 60 * 60 * 1000 },
    duration: 180,
    stops: 0,
    price: 189,
    originalPrice: 279,
    priceChange: -90,
    seats: 12,
    rating: 4.7,
    recommendation: "best-value",
    amenities: ["WiFi", "Snack"],
    cancellationFee: false,
    rebookingEligible: true,
  },
  {
    id: "2",
    airline: "Southwest Airlines",
    flightNumber: "SW456",
    departure: { airport: "STL", time: Date.now() + 4 * 60 * 60 * 1000 },
    arrival: { airport: "MCO", time: Date.now() + 7 * 60 * 60 * 1000 },
    duration: 180,
    stops: 1,
    price: 156,
    originalPrice: 249,
    priceChange: -93,
    seats: 8,
    rating: 4.5,
    recommendation: "fastest",
    amenities: ["Free Checked Bag", "WiFi"],
    cancellationFee: false,
    rebookingEligible: true,
  },
  {
    id: "3",
    airline: "United Airlines",
    flightNumber: "UA789",
    departure: { airport: "STL", time: Date.now() + 5 * 60 * 60 * 1000 },
    arrival: { airport: "MCO", time: Date.now() + 8 * 60 * 60 * 1000 },
    duration: 180,
    stops: 0,
    price: 224,
    originalPrice: 299,
    priceChange: -75,
    seats: 3,
    rating: 4.6,
    amenities: ["Premium Seat", "Meal"],
    cancellationFee: true,
    rebookingEligible: false,
  },
  {
    id: "4",
    airline: "Delta Airlines",
    flightNumber: "DL101",
    departure: { airport: "STL", time: Date.now() + 7 * 60 * 60 * 1000 },
    arrival: { airport: "TPA", time: Date.now() + 10 * 60 * 60 * 1000 }, // Diverted to Tampa
    duration: 180,
    stops: 0,
    price: 99,
    originalPrice: 279,
    priceChange: -180,
    seats: 25,
    rating: 4.4,
    recommendation: "most-convenient",
    amenities: ["WiFi", "Meal", "Entertainment"],
    cancellationFee: false,
    rebookingEligible: true,
  },
];

const FlightAlternatives: React.FC<FlightAlternativesProps> = ({
  originalFlight,
  reason,
  tripId,
}) => {
  const [flights, setFlights] = useState<FlightOption[]>([]);
  const [sortBy, setSortBy] = useState<"price" | "time" | "rating">("price");
  const [selectedFlight, setSelectedFlight] = useState<FlightOption | null>(
    null
  );
  const [bookingInProgress, setBookingInProgress] = useState(false);

  useEffect(() => {
    // In production, this would call an API to fetch real flight data
    // Using mocked data for now
    setFlights(FLIGHT_OPTIONS.sort((a, b) => a.price - b.price));
  }, []);

  const sortedFlights = [...flights].sort((a, b) => {
    switch (sortBy) {
      case "price":
        return a.price - b.price;
      case "time":
        return a.duration - b.duration;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0;
    }
  });

  const handleBookFlight = (flight: FlightOption) => {
    setBookingInProgress(true);
    // Simulate booking
    setTimeout(() => {
      console.log("[FlightAlternatives] Booked flight:", flight.flightNumber);
      setBookingInProgress(false);
      alert(`✅ Successfully rebooked on ${flight.flightNumber}!`);
    }, 2000);
  };

  const getRecommendationBadge = (recommendation?: string) => {
    switch (recommendation) {
      case "best-value":
        return (
          <Badge className="bg-emerald-600">
            <TrendingDown className="w-3 h-3 mr-1" />
            Best Value
          </Badge>
        );
      case "fastest":
        return (
          <Badge className="bg-blue-600">
            <Zap className="w-3 h-3 mr-1" />
            Fastest
          </Badge>
        );
      case "most-convenient":
        return (
          <Badge className="bg-purple-600">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Most Convenient
          </Badge>
        );
        return null;
    }
  };

  const formatTime = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Disruption Context */}
      {reason && (
        <Card className="p-4 border-amber-500/20 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900">
                Disruption Detected
              </h3>
              <p className="text-sm text-amber-800 mt-1">{reason}</p>
              {originalFlight && (
                <div className="mt-3 p-3 bg-black/5 rounded text-sm">
                  <div className="flex items-center gap-2">
                    <Plane className="w-4 h-4" />
                    <span>
                      Original: {originalFlight.flightNumber}{" "}
                      {formatTime(originalFlight.departure.time)}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Sort Options */}
      <div className="flex gap-2">
        <Button
          variant={sortBy === "price" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("price")}
        >
          <DollarSign className="w-4 h-4 mr-1" />
          Price
        </Button>
        <Button
          variant={sortBy === "time" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("time")}
        >
          <Clock className="w-4 h-4 mr-1" />
          Duration
        </Button>
        <Button
          variant={sortBy === "rating" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("rating")}
        >
          ⭐ Rating
        </Button>
      </div>

      {/* Flight Options List */}
      <div className="space-y-3">
        {sortedFlights.map(flight => (
          <Card
            key={flight.id}
            className={`p-4 border cursor-pointer transition ${
              selectedFlight?.id === flight.id
                ? "border-blue-500/50 bg-blue-500/5"
                : "border-border/50 hover:border-border"
            }`}
            onClick={() => setSelectedFlight(flight)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {/* Airline Logo/Name */}
                <div className="text-3xl flex-shrink-0">
                  {flight.airline === "American Airlines" && "✈️"}
                  {flight.airline === "Southwest Airlines" && "🛫"}
                  {flight.airline === "United Airlines" && "🌐"}
                  {flight.airline === "Delta Airlines" && "🚀"}
                </div>

                {/* Flight Details */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold">{flight.flightNumber}</h3>
                    <span className="text-sm text-muted-foreground">
                      {flight.airline}
                    </span>
                    {getRecommendationBadge(flight.recommendation)}
                  </div>

                  {/* Route and Time */}
                  <div className="flex items-center gap-2 text-sm mb-2">
                    <div className="font-mono">
                      {flight.departure.airport}{" "}
                      {formatTime(flight.departure.time)}
                    </div>
                    <ArrowRightIcon />
                    <div className="font-mono">
                      {flight.arrival.airport} {formatTime(flight.arrival.time)}
                    </div>
                  </div>

                  {/* Flight Properties */}
                  <div className="flex gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDuration(flight.duration)}
                    </span>
                    <span>
                      {flight.stops === 0 ? "Nonstop" : `${flight.stops} stop`}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {flight.seats} seats
                    </span>
                  </div>

                  {/* Amenities */}
                  {flight.amenities.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {flight.amenities.map(amenity => (
                        <Badge
                          key={amenity}
                          variant="outline"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price and Rating */}
              <div className="text-right flex-shrink-0">
                <div className="text-2xl font-bold text-emerald-600">
                  ${flight.price}
                </div>
                <div className="text-xs text-muted-foreground line-through">
                  ${flight.originalPrice}
                </div>
                <div className="text-sm font-semibold text-emerald-600 mt-1">
                  Save ${Math.abs(flight.priceChange)}
                </div>
                <div className="text-xs mt-2 text-yellow-600">
                  ⭐ {flight.rating}/5.0
                </div>
              </div>
            </div>

            {/* Warnings */}
            {flight.cancellationFee && (
              <div className="text-xs text-red-600 flex items-center gap-1 mb-2">
                <AlertCircle className="w-3 h-3" />
                Has cancellation fee
              </div>
            )}

            {!flight.rebookingEligible && (
              <div className="text-xs text-orange-600 flex items-center gap-1 mb-2">
                <AlertCircle className="w-3 h-3" />
                Not eligible for free rebooking
              </div>
            )}

            {flight.arrival.airport !== originalFlight?.arrival.airport && (
              <div className="text-xs text-blue-600 flex items-center gap-1">
                <MapPinOff className="w-3 h-3" />
                Arrives at different airport ({flight.arrival.airport})
              </div>
            )}
          </Card>
        ))}
      </div>

      {/* Selected Flight Details Panel */}
      {selectedFlight && (
        <Card className="p-6 border-blue-500/20 bg-blue-500/5">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold">Booking Details</h3>
            <button
              onClick={() => setSelectedFlight(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Route */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Route</h4>
              <div className="p-3 bg-black/5 rounded">
                <div className="flex items-center gap-4">
                  <div>
                    <div className="text-2xl font-bold">
                      {selectedFlight.departure.airport}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(selectedFlight.departure.time)}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="text-center text-muted-foreground">
                      {formatDuration(selectedFlight.duration)}
                    </div>
                    <div className="border-t border-border/50 my-2"></div>
                    <div className="text-center text-sm">
                      {selectedFlight.stops === 0
                        ? "✓ Nonstop"
                        : `${selectedFlight.stops} stop`}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold">
                      {selectedFlight.arrival.airport}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {formatTime(selectedFlight.arrival.time)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Base Fare</span>
                  <span>${selectedFlight.price}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Savings from original</span>
                  <span>-${Math.abs(selectedFlight.priceChange)}</span>
                </div>
                <div className="border-t border-border/50 pt-2 flex justify-between font-bold">
                  <span>Total Per Person</span>
                  <span>${selectedFlight.price}</span>
                </div>
              </div>
            </div>

            {/* Important Info */}
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Important Information
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li>✓ Rebooking costs are covered</li>
                <li>
                  {selectedFlight.cancellationFee ? "✗" : "✓"} No cancellation
                  fee
                </li>
                <li>✓ Trip insurance protection applies</li>
              </ul>
            </div>

            {/* Booking Button */}
            <Button
              className="w-full h-12 text-base"
              onClick={() => handleBookFlight(selectedFlight)}
              disabled={bookingInProgress}
            >
              {bookingInProgress
                ? "Booking..."
                : `Book Now - $${selectedFlight.price}`}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

function ArrowRightIcon() {
  return (
    <svg
      className="w-4 h-4 text-muted-foreground"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}

export default FlightAlternatives;
