/**
 * Live Itinerary Component
 *
 * Real-time synchronized trip itinerary with:
 * - Activity timeline with live status updates
 * - Push notifications for changes
 * - Collaborative editing for family members
 * - Offline-first syncing
 */

import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  MapPin,
  Clock,
  Users,
  Edit2,
  Trash2,
  Plus,
  AlertCircle,
  CheckCircle2,
  Loader,
  Wifi,
  WifiOff,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getOfflineSyncService } from "@/_core/services/offlineSync";
import { getRealtimeSyncService } from "@/_core/services/realtimeSync";
import { getPushNotificationService } from "@/_core/services/pushNotifications";

interface ItineraryItem {
  id: string;
  date: string;
  time: string;
  activity: string;
  location: string;
  category: "flight" | "hotel" | "activity" | "dining" | "transport";
  notes?: string;
  attendees: string[];
  status: "scheduled" | "in-progress" | "completed" | "cancelled";
  lastUpdated: number;
  updatedBy?: string;
}

export function LiveItinerary() {
  const [items, setItems] = useState<ItineraryItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [isLoading, setIsLoading] = useState(false);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "synced" | "error"
  >("idle");
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [connectedToWebSocket, setConnectedToWebSocket] = useState(false);
  const syncService = getOfflineSyncService();
  const realtimeSync = useRef(getRealtimeSyncService());
  const pushNotifications = useRef(getPushNotificationService());
  const unsubscribers = useRef<Array<() => void>>([]);

  const [formData, setFormData] = useState({
    time: "",
    activity: "",
    location: "",
    category: "activity" as const,
    notes: "",
    attendees: [] as string[],
  });

  // Load itinerary and connect to WebSocket
  useEffect(() => {
    loadItinerary();
    initializeWebSocket();
    setupOnlineOfflineListeners();

    // Set up sync interval
    const interval = setInterval(() => {
      syncPendingItems();
    }, 5000);

    return () => {
      clearInterval(interval);
      // Cleanup WebSocket listeners
      unsubscribers.current.forEach(unsub => unsub());
      realtimeSync.current.disconnect();
    };
  }, []);

  // Online/offline detection
  const setupOnlineOfflineListeners = () => {
    const handleOnline = () => {
      setIsOnline(true);
      pushNotifications.current.notifySystem(
        "Back Online",
        "Syncing changes..."
      );
      syncPendingItems();
    };

    const handleOffline = () => {
      setIsOnline(false);
      pushNotifications.current.notifySystem(
        "No Connection",
        "Changes will sync when online"
      );
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  };

  // Initialize WebSocket connection
  const initializeWebSocket = async () => {
    try {
      // For production, tripId and userId would come from context/auth
      const tripId = "trip-123";
      const userId = "user-456";

      await realtimeSync.current.connect(tripId, userId);
      setConnectedToWebSocket(true);

      // Subscribe to itinerary updates
      const unsubUpdate = realtimeSync.current.subscribe(
        "itinerary-update",
        msg => {
          console.log("[LiveItinerary] Received update:", msg);
          const item = msg.data as ItineraryItem;

          // Update local state
          setItems(prev => {
            const idx = prev.findIndex(i => i.id === item.id);
            if (idx >= 0) {
              prev[idx] = item;
            } else {
              prev.push(item);
            }
            return [...prev];
          });

          // Show notification
          pushNotifications.current.notifyItineraryUpdate(
            item.activity,
            "Updated by " + (item.updatedBy || "you")
          );
        }
      );

      unsubscribers.current.push(unsubUpdate);
    } catch (err) {
      console.error("[LiveItinerary] Failed to connect WebSocket:", err);
      setConnectedToWebSocket(false);
    }
  };

  const loadItinerary = async () => {
    setIsLoading(true);
    try {
      // Load from offline cache first
      const cached = await syncService.getLocal("itinerary");
      if (cached) {
        setItems(cached);
      }

      // TODO: Fetch from backend API in production
      // const response = await fetch("/api/itinerary");
      // if (response.ok) {
      //   const data = await response.json();
      //   setItems(data);
      //   syncService.saveLocal("itinerary", data);
      // }
    } catch (error) {
      console.error("Failed to load itinerary", error);
    } finally {
      setIsLoading(false);
    }
  };

  const syncPendingItems = async () => {
    setSyncStatus("syncing");
    try {
      await syncService.syncPendingActions();
      setSyncStatus("synced");
      setTimeout(() => setSyncStatus("idle"), 2000);
    } catch (error) {
      setSyncStatus("error");
      console.error("Sync failed", error);
    }
  };

  const handleAddItem = async () => {
    if (!formData.time || !formData.activity || !formData.location) {
      return;
    }

    const newItem: ItineraryItem = {
      id: `itinerary-${Date.now()}`,
      date: selectedDate,
      time: formData.time,
      activity: formData.activity,
      location: formData.location,
      category: formData.category,
      notes: formData.notes,
      attendees: formData.attendees,
      status: "scheduled",
      lastUpdated: Date.now(),
      updatedBy: "user-456", // In production, get from auth context
    };

    // Add to local state
    setItems([...items, newItem]);

    // Queue for sync
    await syncService.queueAction({
      type: "CREATE",
      entity: "itinerary",
      data: newItem,
    });

    // Send via WebSocket for real-time broadcast
    if (connectedToWebSocket) {
      realtimeSync.current.sendItineraryUpdate(newItem);
    }

    // Show notification
    pushNotifications.current.notifyItineraryUpdate(
      newItem.activity,
      "Added to itinerary"
    );

    // Reset form
    setFormData({
      time: "",
      activity: "",
      location: "",
      category: "activity",
      notes: "",
      attendees: [],
    });
    setShowForm(false);
  };

  const handleDeleteItem = async (id: string) => {
    setItems(items.filter(item => item.id !== id));

    await syncService.queueAction({
      type: "DELETE",
      entity: "itinerary",
      data: { id },
    });
  };

  const handleUpdateStatus = async (
    id: string,
    newStatus: ItineraryItem["status"]
  ) => {
    setItems(
      items.map(item =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              lastUpdated: Date.now(),
              updatedBy: "user-456",
            }
          : item
      )
    );

    const item = items.find(i => i.id === id);
    if (item) {
      const updatedItem = {
        ...item,
        status: newStatus,
        lastUpdated: Date.now(),
        updatedBy: "user-456",
      };

      await syncService.queueAction({
        type: "UPDATE",
        entity: "itinerary",
        data: updatedItem,
      });

      // Send via WebSocket
      if (connectedToWebSocket) {
        realtimeSync.current.sendItineraryUpdate(updatedItem);
      }

      // Show notification
      pushNotifications.current.notifyItineraryUpdate(
        item.activity,
        `Marked as ${newStatus}`
      );
    }
  };

  const itemsByDate = items.reduce(
    (acc, item) => {
      if (!acc[item.date]) acc[item.date] = [];
      acc[item.date].push(item);
      return acc;
    },
    {} as Record<string, ItineraryItem[]>
  );

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "flight":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "hotel":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20";
      case "dining":
        return "bg-orange-500/10 text-orange-500 border-orange-500/20";
      case "activity":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "transport":
        return "bg-cyan-500/10 text-cyan-500 border-cyan-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "flight":
        return "✈️";
      case "hotel":
        return "🏨";
      case "dining":
        return "🍽️";
      case "activity":
        return "🎯";
      case "transport":
        return "🚗";
      default:
        return "📌";
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex gap-2">
        {/* Online/Offline Indicator */}
        <Card
          className={`flex-1 p-3 border ${
            isOnline
              ? "bg-emerald-500/10 border-emerald-500/20"
              : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            {isOnline ? (
              <>
                <Wifi className="w-4 h-4 text-emerald-500" />
                <span className="text-emerald-700">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-4 h-4 text-red-500" />
                <span className="text-red-700">Offline</span>
              </>
            )}
          </div>
        </Card>

        {/* WebSocket Status */}
        <Card
          className={`flex-1 p-3 border ${
            connectedToWebSocket
              ? "bg-blue-500/10 border-blue-500/20"
              : "bg-gray-500/10 border-gray-500/20"
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            {connectedToWebSocket ? (
              <>
                <Loader className="w-4 h-4 text-blue-500" />
                <span className="text-blue-700">Live Sync</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-gray-500" />
                <span className="text-gray-700">Offline Mode</span>
              </>
            )}
          </div>
        </Card>
      </div>
      {/* Sync Status */}
      {syncStatus !== "idle" && (
        <Card
          className={`p-3 border ${
            syncStatus === "syncing"
              ? "bg-blue-500/10 border-blue-500/20"
              : syncStatus === "synced"
                ? "bg-emerald-500/10 border-emerald-500/20"
                : "bg-red-500/10 border-red-500/20"
          }`}
        >
          <div className="flex items-center gap-2 text-sm">
            {syncStatus === "syncing" && (
              <Loader className="w-4 h-4 animate-spin" />
            )}
            {syncStatus === "synced" && (
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            )}
            {syncStatus === "error" && (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
            <span>
              {syncStatus === "syncing" && "Syncing changes..."}
              {syncStatus === "synced" && "All changes synced ✓"}
              {syncStatus === "error" && "Sync error - retrying..."}
            </span>
          </div>
        </Card>
      )}

      {/* Date Picker */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 7 }).map((_, i) => {
          const date = new Date();
          date.setDate(date.getDate() + i);
          const dateStr = date.toISOString().split("T")[0];
          const isSelected = dateStr === selectedDate;

          return (
            <button
              key={dateStr}
              onClick={() => setSelectedDate(dateStr)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg border text-sm transition-colors ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border/50 hover:border-primary/50"
              }`}
            >
              <div className="text-xs opacity-75">
                {date.toLocaleDateString("en-US", { weekday: "short" })}
              </div>
              <div className="font-semibold">{date.getDate()}</div>
            </button>
          );
        })}
      </div>

      {/* Add Item Button */}
      {!showForm && (
        <Button onClick={() => setShowForm(true)} className="w-full">
          <Plus className="w-4 h-4 mr-2" />
          Add Activity
        </Button>
      )}

      {/* Add Item Form */}
      {showForm && (
        <Card className="p-4 border-primary/30 bg-primary/5">
          <div className="space-y-3">
            <input
              type="time"
              value={formData.time}
              onChange={e => setFormData({ ...formData, time: e.target.value })}
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            />

            <input
              type="text"
              placeholder="Activity (e.g., Arrive at airport)"
              value={formData.activity}
              onChange={e =>
                setFormData({ ...formData, activity: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <input
              type="text"
              placeholder="Location"
              value={formData.location}
              onChange={e =>
                setFormData({ ...formData, location: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
            />

            <select
              value={formData.category}
              onChange={e =>
                setFormData({
                  ...formData,
                  category: e.target.value as ItineraryItem["category"],
                })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50"
            >
              <option value="activity">Activity</option>
              <option value="flight">Flight</option>
              <option value="hotel">Hotel</option>
              <option value="dining">Dining</option>
              <option value="transport">Transport</option>
            </select>

            <textarea
              placeholder="Notes (optional)"
              value={formData.notes}
              onChange={e =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50 resize-none"
              rows={2}
            />

            <div className="flex gap-2">
              <Button onClick={handleAddItem} className="flex-1">
                Add
              </Button>
              <Button
                onClick={() => setShowForm(false)}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Itinerary Timeline */}
      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">
          Loading itinerary...
        </div>
      ) : itemsByDate[selectedDate]?.length > 0 ? (
        <div className="space-y-3">
          {itemsByDate[selectedDate]
            .sort((a, b) => a.time.localeCompare(b.time))
            .map(item => (
              <Card key={item.id} className="p-4 border-border/50">
                <div className="flex items-start gap-3">
                  {/* Time Marker */}
                  <div className="flex-shrink-0 text-2xl">
                    {getCategoryIcon(item.category)}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-foreground">
                          {item.activity}
                        </h4>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                          <Clock className="w-4 h-4" />
                          <span>{item.time}</span>
                        </div>
                      </div>

                      <div className="flex gap-1">
                        <button className="p-2 hover:bg-red-500/10 rounded-lg transition-colors">
                          <Trash2
                            className="w-4 h-4 text-red-500"
                            onClick={() => handleDeleteItem(item.id)}
                          />
                        </button>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="w-4 h-4" />
                      <span>{item.location}</span>
                    </div>

                    {/* Category Badge */}
                    <div className="flex items-center gap-2 mb-2">
                      <Badge
                        className={`text-xs border ${getCategoryColor(item.category)}`}
                      >
                        {item.category.charAt(0).toUpperCase() +
                          item.category.slice(1)}
                      </Badge>

                      {/* Status Badge */}
                      <select
                        value={item.status}
                        onChange={e =>
                          handleUpdateStatus(
                            item.id,
                            e.target.value as ItineraryItem["status"]
                          )
                        }
                        className={`text-xs px-2 py-1 rounded border bg-black/10 focus:outline-none ${
                          item.status === "completed"
                            ? "text-emerald-500 border-emerald-500/30"
                            : item.status === "cancelled"
                              ? "text-red-500 border-red-500/30"
                              : "text-foreground border-border/50"
                        }`}
                      >
                        <option value="scheduled">Scheduled</option>
                        <option value="in-progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Notes */}
                    {item.notes && (
                      <p className="text-xs text-muted-foreground italic mb-2">
                        {item.notes}
                      </p>
                    )}

                    {/* Attendees */}
                    {item.attendees.length > 0 && (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Users className="w-3 h-3" />
                        <span>{item.attendees.join(", ")}</span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground">
          No activities scheduled for this day
        </div>
      )}
    </div>
  );
}

export default LiveItinerary;
