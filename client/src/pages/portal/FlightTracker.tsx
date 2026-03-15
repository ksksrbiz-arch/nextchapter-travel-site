import { useState } from "react";
import { Plane, Plus, Trash2, Calendar } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface Flight {
  id: string;
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    city: string;
    time: string;
    date: string;
    gate?: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    city: string;
    time: string;
    date: string;
    gate?: string;
    terminal?: string;
  };
  status: "scheduled" | "boarding" | "delayed" | "cancelled" | "landed";
  delayMinutes?: number;
  seat: string;
  confirmationCode: string;
  notes?: string;
}

const AIRLINES = [
  "American Airlines",
  "Delta Air Lines",
  "United Airlines",
  "Southwest Airlines",
  "JetBlue Airways",
  "Alaska Airlines",
  "Hawaiian Airlines",
  "Spirit Airlines",
  "Frontier Airlines",
  "Other",
];

const STATUSES = [
  {
    value: "scheduled",
    label: "Scheduled",
    color: "bg-blue-950/20 border-blue-500/20",
  },
  {
    value: "boarding",
    label: "Boarding",
    color: "bg-purple-950/20 border-purple-500/20",
  },
  {
    value: "delayed",
    label: "Delayed",
    color: "bg-orange-950/20 border-orange-500/20",
  },
  {
    value: "cancelled",
    label: "Cancelled",
    color: "bg-red-950/20 border-red-500/20",
  },
  {
    value: "landed",
    label: "Landed",
    color: "bg-emerald-950/20 border-emerald-500/20",
  },
];

export function FlightTracker() {
  const [flights, setFlights] = useState<Flight[]>([
    {
      id: "1",
      airline: "Delta Air Lines",
      flightNumber: "DL 428",
      departure: {
        airport: "LAX",
        city: "Los Angeles",
        time: "10:30 AM",
        date: "2024-06-15",
        gate: "B12",
        terminal: "2",
      },
      arrival: {
        airport: "HNL",
        city: "Honolulu",
        time: "2:45 PM",
        date: "2024-06-15",
        terminal: "2",
      },
      status: "scheduled",
      seat: "12A",
      confirmationCode: "ABC123",
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    airline: "",
    flightNumber: "",
    departureCity: "",
    departureAirport: "",
    departureTime: "",
    departureDate: "",
    arrivalCity: "",
    arrivalAirport: "",
    arrivalTime: "",
    arrivalDate: "",
    seat: "",
    confirmationCode: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.airline) newErrors.airline = "Airline required";
    if (!formData.flightNumber)
      newErrors.flightNumber = "Flight number required";
    if (!formData.departureAirport)
      newErrors.departureAirport = "Departure airport required";
    if (!formData.departureTime)
      newErrors.departureTime = "Departure time required";
    if (!formData.departureDate)
      newErrors.departureDate = "Departure date required";
    if (!formData.arrivalAirport)
      newErrors.arrivalAirport = "Arrival airport required";
    if (!formData.arrivalTime) newErrors.arrivalTime = "Arrival time required";
    if (!formData.arrivalDate) newErrors.arrivalDate = "Arrival date required";
    if (!formData.seat) newErrors.seat = "Seat required";
    if (!formData.confirmationCode)
      newErrors.confirmationCode = "Confirmation code required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddFlight = () => {
    if (!validateForm()) return;

    const newFlight: Flight = {
      id: Date.now().toString(),
      airline: formData.airline,
      flightNumber: formData.flightNumber,
      departure: {
        airport: formData.departureAirport,
        city: formData.departureCity,
        time: formData.departureTime,
        date: formData.departureDate,
      },
      arrival: {
        airport: formData.arrivalAirport,
        city: formData.arrivalCity,
        time: formData.arrivalTime,
        date: formData.arrivalDate,
      },
      seat: formData.seat,
      confirmationCode: formData.confirmationCode,
      status: "scheduled",
    };

    setFlights([newFlight, ...flights]);
    setFormData({
      airline: "",
      flightNumber: "",
      departureCity: "",
      departureAirport: "",
      departureTime: "",
      departureDate: "",
      arrivalCity: "",
      arrivalAirport: "",
      arrivalTime: "",
      arrivalDate: "",
      seat: "",
      confirmationCode: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleDeleteFlight = (id: string) => {
    setFlights(flights.filter(f => f.id !== id));
  };

  const handleUpdateStatus = (id: string, status: Flight["status"]) => {
    setFlights(flights.map(f => (f.id === id ? { ...f, status } : f)));
  };

  const upcomingFlights = flights.filter(
    f => f.status !== "landed" && f.status !== "cancelled"
  );

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <Card className="bg-gradient-to-br from-sky-950/30 to-blue-950/30 border-sky-500/20 p-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-4">
          Flight Summary
        </h3>

        <div className="grid grid-cols-4 gap-3">
          <div className="p-3 bg-black/20 rounded-lg">
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="text-2xl font-bold text-foreground">
              {flights.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-sky-500/30">
            <p className="text-xs text-sky-300">Upcoming</p>
            <p className="text-2xl font-bold text-sky-400">
              {upcomingFlights.length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-emerald-500/30">
            <p className="text-xs text-emerald-300">Landed</p>
            <p className="text-2xl font-bold text-emerald-400">
              {flights.filter(f => f.status === "landed").length}
            </p>
          </div>

          <div className="p-3 bg-black/20 rounded-lg border border-orange-500/30">
            <p className="text-xs text-orange-300">Delayed</p>
            <p className="text-2xl font-bold text-orange-400">
              {flights.filter(f => f.status === "delayed").length}
            </p>
          </div>
        </div>
      </Card>

      {/* Add Flight Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Flight
        </Button>
      )}

      {/* Add Flight Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Add New Flight</h3>

          <div className="space-y-4">
            <FormFieldWrapper error={errors.airline}>
              <select
                value={formData.airline}
                onChange={e => {
                  setFormData({ ...formData, airline: e.target.value });
                  setErrors({ ...errors, airline: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="">Select Airline</option>
                {AIRLINES.map(a => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </FormFieldWrapper>

            <FormFieldWrapper error={errors.flightNumber}>
              <input
                type="text"
                placeholder="Flight Number (e.g., DL 428)"
                value={formData.flightNumber}
                onChange={e => {
                  setFormData({ ...formData, flightNumber: e.target.value });
                  setErrors({ ...errors, flightNumber: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.departureAirport}>
                <input
                  type="text"
                  placeholder="Departure Airport (LAX)"
                  value={formData.departureAirport}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      departureAirport: e.target.value,
                    });
                    setErrors({ ...errors, departureAirport: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <input
                type="text"
                placeholder="City"
                value={formData.departureCity}
                onChange={e =>
                  setFormData({ ...formData, departureCity: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.departureDate}>
                <input
                  type="date"
                  value={formData.departureDate}
                  onChange={e => {
                    setFormData({ ...formData, departureDate: e.target.value });
                    setErrors({ ...errors, departureDate: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.departureTime}>
                <input
                  type="time"
                  value={formData.departureTime}
                  onChange={e => {
                    setFormData({ ...formData, departureTime: e.target.value });
                    setErrors({ ...errors, departureTime: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.arrivalAirport}>
                <input
                  type="text"
                  placeholder="Arrival Airport (HNL)"
                  value={formData.arrivalAirport}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      arrivalAirport: e.target.value,
                    });
                    setErrors({ ...errors, arrivalAirport: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <input
                type="text"
                placeholder="City"
                value={formData.arrivalCity}
                onChange={e =>
                  setFormData({ ...formData, arrivalCity: e.target.value })
                }
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.arrivalDate}>
                <input
                  type="date"
                  value={formData.arrivalDate}
                  onChange={e => {
                    setFormData({ ...formData, arrivalDate: e.target.value });
                    setErrors({ ...errors, arrivalDate: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.arrivalTime}>
                <input
                  type="time"
                  value={formData.arrivalTime}
                  onChange={e => {
                    setFormData({ ...formData, arrivalTime: e.target.value });
                    setErrors({ ...errors, arrivalTime: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <FormFieldWrapper error={errors.seat}>
                <input
                  type="text"
                  placeholder="Seat (12A)"
                  value={formData.seat}
                  onChange={e => {
                    setFormData({ ...formData, seat: e.target.value });
                    setErrors({ ...errors, seat: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>

              <FormFieldWrapper error={errors.confirmationCode}>
                <input
                  type="text"
                  placeholder="Confirmation Code"
                  value={formData.confirmationCode}
                  onChange={e => {
                    setFormData({
                      ...formData,
                      confirmationCode: e.target.value,
                    });
                    setErrors({ ...errors, confirmationCode: "" });
                  }}
                  className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
                />
              </FormFieldWrapper>
            </div>

            <div className="flex gap-3">
              <Button onClick={handleAddFlight} className="flex-1">
                Add Flight
              </Button>
              <Button
                onClick={() => {
                  setShowForm(false);
                  setErrors({});
                }}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Flights List */}
      {flights.length > 0 ? (
        <div className="space-y-3">
          {flights.map(flight => {
            const statusConfig = STATUSES.find(s => s.value === flight.status);
            return (
              <Card
                key={flight.id}
                className={`p-4 border-l-4 ${statusConfig?.color || "border-border"}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Plane className="w-5 h-5 text-primary" />
                      <h4 className="font-semibold text-foreground">
                        {flight.airline}
                      </h4>
                      <Badge variant="outline" className="text-xs">
                        {flight.flightNumber}
                      </Badge>
                      <Badge
                        variant={
                          flight.status === "delayed"
                            ? "destructive"
                            : "default"
                        }
                        className="text-xs"
                      >
                        {statusConfig?.label}
                      </Badge>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteFlight(flight.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </button>
                </div>

                {/* Flight Route */}
                <div className="grid grid-cols-3 gap-4 mb-4 p-4 bg-black/20 rounded-lg">
                  {/* Departure */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Departure
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {flight.departure.airport}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flight.departure.city}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {flight.departure.time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {flight.departure.date}
                    </p>
                    {flight.departure.gate && (
                      <p className="text-xs text-primary mt-1">
                        Gate {flight.departure.gate}
                      </p>
                    )}
                  </div>

                  {/* Arrow */}
                  <div className="flex items-center justify-center">
                    <Plane className="w-5 h-5 text-muted-foreground rotate-90" />
                  </div>

                  {/* Arrival */}
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground mb-1">
                      Arrival
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {flight.arrival.airport}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {flight.arrival.city}
                    </p>
                    <p className="text-sm font-medium text-foreground mt-1">
                      {flight.arrival.time}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {flight.arrival.date}
                    </p>
                    {flight.arrival.gate && (
                      <p className="text-xs text-primary mt-1">
                        Gate {flight.arrival.gate}
                      </p>
                    )}
                  </div>
                </div>

                {/* Flight Details */}
                <div className="grid grid-cols-3 gap-3 text-xs mb-3">
                  <div className="p-2 bg-black/20 rounded-lg">
                    <p className="text-muted-foreground">Seat</p>
                    <p className="font-semibold text-foreground">
                      {flight.seat}
                    </p>
                  </div>

                  <div className="p-2 bg-black/20 rounded-lg">
                    <p className="text-muted-foreground">Confirmation</p>
                    <p className="font-mono text-foreground">
                      {flight.confirmationCode}
                    </p>
                  </div>

                  <div className="p-2 bg-black/20 rounded-lg">
                    <p className="text-muted-foreground">Status</p>
                    <p className="font-semibold text-foreground">
                      {statusConfig?.label}
                    </p>
                  </div>
                </div>

                {/* Status Selector */}
                <div className="flex gap-2 flex-wrap">
                  {STATUSES.map(status => (
                    <button
                      key={status.value}
                      onClick={() =>
                        handleUpdateStatus(
                          flight.id,
                          status.value as Flight["status"]
                        )
                      }
                      className={`text-xs px-3 py-1.5 rounded-lg transition-all border ${
                        flight.status === status.value
                          ? "border-primary bg-primary/20 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Plane}
            title="No Flights Added"
            description="Add your flights to track status, gates, and boarding information"
            action={{ label: "Add Flight", onClick: () => setShowForm(true) }}
          />
        )
      )}

      {/* Travel Tips */}
      <Card className="border-blue-500/20 bg-blue-950/20 p-4">
        <h4 className="font-medium text-sm text-blue-400 mb-3">
          ✈️ Flight Tips
        </h4>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• Check in online 24 hours before departure</li>
          <li>
            • Arrive 2-3 hours before domestic, 3-4 hours before international
          </li>
          <li>• Enable flight status notifications on airline app</li>
          <li>• Have confirmationcode ready for check-in</li>
          <li>
            • Monitor gate changes closely (often announced 30 mins before)
          </li>
        </ul>
      </Card>
    </div>
  );
}
