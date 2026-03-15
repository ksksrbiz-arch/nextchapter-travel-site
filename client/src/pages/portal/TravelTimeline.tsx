import { useState } from "react";
import {
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  Plus,
  Trash2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FormFieldWrapper } from "@/components/ui/form-errors";
import { EmptyState } from "@/components/ui/empty-states";

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  time?: string;
  type: "flight" | "accommodation" | "activity" | "important" | "other";
  location?: string;
  completed: boolean;
}

const TRIP_START = "2024-06-15";
const TRIP_END = "2024-06-22";

export function TravelTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>([
    {
      id: "1",
      title: "Depart for Hawaii",
      description: "Flight departure from Los Angeles",
      date: "2024-06-15",
      time: "10:00 AM",
      type: "flight",
      location: "LAX Terminal 4",
      completed: false,
    },
    {
      id: "2",
      title: "Check-in at Resort",
      description: "Arrival and resort check-in",
      date: "2024-06-15",
      time: "4:30 PM",
      type: "accommodation",
      location: "Waikiki Beach Resort",
      completed: false,
    },
  ]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    type: "other" as TimelineEvent["type"],
    location: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = "Title required";
    if (!formData.date) newErrors.date = "Date required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddEvent = () => {
    if (!validateForm()) return;

    const newEvent: TimelineEvent = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: formData.date,
      time: formData.time,
      type: formData.type,
      location: formData.location,
      completed: false,
    };

    setEvents(
      [...events].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setEvents(prev =>
      [...prev, newEvent].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      )
    );
    setFormData({
      title: "",
      description: "",
      date: "",
      time: "",
      type: "other",
      location: "",
    });
    setErrors({});
    setShowForm(false);
  };

  const handleToggleComplete = (id: string) => {
    setEvents(
      events.map(e => (e.id === id ? { ...e, completed: !e.completed } : e))
    );
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  const completedCount = events.filter(e => e.completed).length;

  const calculateCountdown = () => {
    const today = new Date();
    const tripStart = new Date(TRIP_START);
    const daysUntilTrip = Math.ceil(
      (tripStart.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysUntilTrip < 0) {
      const tripEnd = new Date(TRIP_END);
      const daysLeft = Math.ceil(
        (tripEnd.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
      );
      return { label: "Days Left", count: Math.max(0, daysLeft) };
    }
    return { label: "Days Until Trip", count: Math.max(0, daysUntilTrip) };
  };

  const countdown = calculateCountdown();
  const tripDuration = Math.ceil(
    (new Date(TRIP_END).getTime() - new Date(TRIP_START).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  const typeIcons: Record<TimelineEvent["type"], string> = {
    flight: "✈️",
    accommodation: "🏨",
    activity: "🎯",
    important: "⚠️",
    other: "📌",
  };

  const typeColors: Record<TimelineEvent["type"], string> = {
    flight: "bg-blue-950/20 border-blue-500/20",
    accommodation: "bg-purple-950/20 border-purple-500/20",
    activity: "bg-amber-950/20 border-amber-500/20",
    important: "bg-red-950/20 border-red-500/20",
    other: "bg-slate-950/20 border-slate-500/20",
  };

  return (
    <div className="space-y-6">
      {/* Trip Overview */}
      <Card className="bg-gradient-to-br from-indigo-950/30 to-blue-950/30 border-indigo-500/20 p-6">
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div>
            <p className="text-xs text-muted-foreground mb-1">Trip Duration</p>
            <p className="text-2xl font-bold text-foreground">{tripDuration}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">
              {countdown.label}
            </p>
            <p className="text-3xl font-bold text-primary">{countdown.count}</p>
            <p className="text-xs text-muted-foreground">days</p>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-1">Progress</p>
            <p className="text-2xl font-bold text-foreground">
              {completedCount}
            </p>
            <p className="text-xs text-muted-foreground">of {events.length}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Timeline Progress</span>
            <span>
              {Math.round((completedCount / Math.max(events.length, 1)) * 100)}%
            </span>
          </div>
          <div className="w-full bg-black/30 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-indigo-500 to-blue-500 h-2 rounded-full transition-all"
              style={{
                width: `${(completedCount / Math.max(events.length, 1)) * 100}%`,
              }}
            />
          </div>
        </div>
      </Card>

      {/* Trip Dates */}
      <Card className="p-4 border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <div>
              <p className="text-xs text-muted-foreground">Trip Dates</p>
              <p className="text-sm font-semibold text-foreground">
                {new Date(TRIP_START).toLocaleDateString()} —{" "}
                {new Date(TRIP_END).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Add Event Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Timeline Event
        </Button>
      )}

      {/* Add Event Form */}
      {showForm && (
        <Card className="p-6 border-border/50">
          <h3 className="text-lg font-semibold mb-4">Add Timeline Event</h3>

          <div className="space-y-4">
            <FormFieldWrapper error={errors.title}>
              <input
                type="text"
                placeholder="Event Title"
                value={formData.title}
                onChange={e => {
                  setFormData({ ...formData, title: e.target.value });
                  setErrors({ ...errors, title: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={e =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={2}
            />

            <FormFieldWrapper error={errors.date}>
              <input
                type="date"
                value={formData.date}
                onChange={e => {
                  setFormData({ ...formData, date: e.target.value });
                  setErrors({ ...errors, date: "" });
                }}
                className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              />
            </FormFieldWrapper>

            <input
              type="time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
              placeholder="Time (optional)"
            />

            <input
              type="text"
              placeholder="Location (optional)"
              value={formData.location}
              onChange={e =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <select
              value={formData.type}
              onChange={e =>
                setFormData({
                  ...formData,
                  type: e.target.value as TimelineEvent["type"],
                })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="flight">Flight</option>
              <option value="accommodation">Accommodation</option>
              <option value="activity">Activity</option>
              <option value="important">Important</option>
              <option value="other">Other</option>
            </select>

            <div className="flex gap-3">
              <Button onClick={handleAddEvent} className="flex-1">
                Add Event
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

      {/* Events Timeline */}
      {sortedEvents.length > 0 ? (
        <div className="space-y-3">
          {sortedEvents.map((event, index) => (
            <Card
              key={event.id}
              className={`p-4 border-l-4 ${typeColors[event.type]} border-border`}
            >
              <div className="flex items-start gap-4">
                <button
                  onClick={() => handleToggleComplete(event.id)}
                  className="mt-1 flex-shrink-0"
                >
                  {event.completed ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-muted-foreground hover:border-foreground transition-colors" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">{typeIcons[event.type]}</span>
                    <h4
                      className={`font-semibold ${event.completed ? "text-muted-foreground line-through" : "text-foreground"}`}
                    >
                      {event.title}
                    </h4>
                  </div>

                  {event.description && (
                    <p className="text-sm text-muted-foreground mb-2">
                      {event.description}
                    </p>
                  )}

                  <div className="space-y-1 text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3 h-3" />
                      {new Date(event.date).toLocaleDateString()}
                    </div>
                    {event.time && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {event.time}
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-3 h-3" />
                        {event.location}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteEvent(event.id)}
                  className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>

              {index < sortedEvents.length - 1 && (
                <div className="ml-3 mt-3 h-6 border-l-2 border-dashed border-border/50" />
              )}
            </Card>
          ))}
        </div>
      ) : (
        !showForm && (
          <EmptyState
            icon={Calendar}
            title="No Timeline Events"
            description="Add flights, accommodations, activities, and important dates"
            action={{ label: "Add Event", onClick: () => setShowForm(true) }}
          />
        )
      )}

      {/* Preparation Tips */}
      <Card className="border-emerald-500/20 bg-emerald-950/20 p-4">
        <h4 className="font-medium text-sm text-emerald-400 mb-3">
          📋 Pre-Trip Checklist
        </h4>
        <ul className="text-xs text-muted-foreground space-y-2">
          <li>• ✓ Passport valid for travel dates</li>
          <li>• ✓ Visas obtained if required</li>
          <li>• ✓ Travel insurance purchased</li>
          <li>• ✓ Hotel reservations confirmed</li>
          <li>• ✓ Flights booked and paid</li>
          <li>• ✓ Notify bank of travel dates</li>
          <li>• ✓ Pack 3 days before departure</li>
        </ul>
      </Card>
    </div>
  );
}
