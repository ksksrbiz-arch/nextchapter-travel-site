/**
 * Family Check-In System
 *
 * Allows family members to:
 * - Mark themselves as "safe" with timestamp
 * - Optional location sharing (with privacy controls)
 * - Group messaging (in-trip communication)
 * - Emergency SOS alerts
 */

import { useState, useEffect, useRef } from "react";
import {
  MapPin,
  Send,
  AlertCircle,
  CheckCircle2,
  Clock,
  Users,
  MessageSquare,
  Phone,
  MoreVertical,
  Zap,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getRealtimeSyncService } from "@/_core/services/realtimeSync";
import { getPushNotificationService } from "@/_core/services/pushNotifications";
import { getGeofencingService } from "@/_core/services/geofencing";

interface FamilyMember {
  id: string;
  name: string;
  role: "adult" | "child" | "senior";
  status: "safe" | "pending" | "emergency" | "offline";
  lastCheckIn?: number;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  avatar?: string;
}

interface Message {
  id: string;
  from: string;
  text: string;
  timestamp: number;
  type: "message" | "alert" | "system";
}

export function FamilyCheckIn() {
  const [members, setMembers] = useState<FamilyMember[]>([
    {
      id: "mom",
      name: "Mom (Parent)",
      role: "adult",
      status: "safe",
      lastCheckIn: Date.now(),
      avatar: "👩",
    },
    {
      id: "dad",
      name: "Dad (Parent)",
      role: "adult",
      status: "safe",
      lastCheckIn: Date.now() - 5 * 60 * 1000,
      avatar: "👨",
    },
    {
      id: "child1",
      name: "Emma (Child)",
      role: "child",
      status: "pending",
      avatar: "👧",
    },
    {
      id: "child2",
      name: "Liam (Child)",
      role: "child",
      status: "safe",
      lastCheckIn: Date.now() - 2 * 60 * 1000,
      avatar: "👦",
    },
    {
      id: "grandma",
      name: "Grandma (Senior)",
      role: "senior",
      status: "safe",
      lastCheckIn: Date.now() - 15 * 60 * 1000,
      avatar: "👵",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      from: "system",
      text: "Trip to Orlando began - All family members in group!",
      timestamp: Date.now() - 2 * 60 * 60 * 1000,
      type: "system",
    },
    {
      id: "2",
      from: "Mom",
      text: "Made it safely to hotel! 🏨",
      timestamp: Date.now() - 1 * 60 * 60 * 1000,
      type: "message",
    },
  ]);

  const [messageInput, setMessageInput] = useState("");
  const [showLocationShare, setShowLocationShare] = useState(false);
  const [selectedMember, setSelectedMember] = useState<string | null>(null);

  // WebSocket and services
  const realtimeSync = useRef(getRealtimeSyncService());
  const pushNotifications = useRef(getPushNotificationService());
  const geofencing = useRef(getGeofencingService());
  const unsubscribers = useRef<Array<() => void>>([]);

  // Initialize WebSocket and geofencing
  useEffect(() => {
    initializeServices();

    return () => {
      unsubscribers.current.forEach(unsub => unsub());
      realtimeSync.current.disconnect();
      geofencing.current.stopMonitoring();
    };
  }, []);

  const initializeServices = async () => {
    try {
      // Connect to WebSocket
      const tripId = "trip-123";
      const userId = "user-456";
      await realtimeSync.current.connect(tripId, userId);

      // Subscribe to check-in status updates
      const unsubStatus = realtimeSync.current.subscribe(
        "checkin-status",
        msg => {
          const { userId: memberId, status } = msg.data;
          setMembers(prev =>
            prev.map(m =>
              m.id === memberId ? { ...m, status, lastCheckIn: Date.now() } : m
            )
          );
        }
      );

      // Subscribe to location updates
      const unsubLocation = realtimeSync.current.subscribe(
        "location-update",
        msg => {
          const { userId: memberId, latitude, longitude } = msg.data;
          setMembers(prev =>
            prev.map(m =>
              m.id === memberId
                ? {
                    ...m,
                    location: { lat: latitude, lng: longitude },
                  }
                : m
            )
          );
        }
      );

      unsubscribers.current.push(unsubStatus, unsubLocation);

      // Start location tracking
      realtimeSync.current.startLocationTracking(location => {
        console.log("[FamilyCheckIn] Location updated:", location);
      });

      // Setup geofencing for trip locations (hotels, airports, etc.)
      geofencing.current.addGeofence({
        id: "hotel-1",
        name: "Hotel Orlando",
        latitude: 28.5421,
        longitude: -81.379,
        radiusKm: 0.5,
        type: "hotel",
      });

      const unsubEnter = geofencing.current.on("hotel-1", "enter", data => {
        pushNotifications.current.notifyLocationAlert(
          data.geofence.name,
          "You've arrived at your destination"
        );
      });

      unsubscribers.current.push(unsubEnter);

      // Start geofence monitoring
      await geofencing.current.startMonitoring();
    } catch (err) {
      console.error("[FamilyCheckIn] Failed to initialize services:", err);
    }
  };

  const handleCheckIn = (memberId: string) => {
    setMembers(
      members.map(member =>
        member.id === memberId
          ? {
              ...member,
              status: "safe",
              lastCheckIn: Date.now(),
            }
          : member
      )
    );

    const member = members.find(m => m.id === memberId);
    if (member) {
      // Send via WebSocket
      realtimeSync.current.sendCheckInStatus("safe");

      // Show notification
      pushNotifications.current.notifyCheckInReminder(member.name);

      addMessage({
        id: `msg-${Date.now()}`,
        from: member.name,
        text: `${member.name} marked as safe ✓`,
        timestamp: Date.now(),
        type: "alert",
      });
    }
  };

  const handleSOS = (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    setMembers(
      members.map(m => (m.id === memberId ? { ...m, status: "emergency" } : m))
    );

    // Send emergency via WebSocket
    realtimeSync.current.sendCheckInStatus("emergency");

    // Show emergency notification to all members
    pushNotifications.current.notifyEmergency(
      member.name,
      "Emergency SOS activated"
    );

    addMessage({
      id: `emergency-${Date.now()}`,
      from: member.name,
      text: `🚨 EMERGENCY: ${member.name} needs help!`,
      timestamp: Date.now(),
      type: "alert",
    });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    addMessage({
      id: `msg-${Date.now()}`,
      from: "You",
      text: messageInput,
      timestamp: Date.now(),
      type: "message",
    });

    setMessageInput("");
  };

  const addMessage = (message: Message) => {
    setMessages([...messages, message]);
  };

  const getStatusColor = (status: FamilyMember["status"]) => {
    switch (status) {
      case "safe":
        return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "pending":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "emergency":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      case "offline":
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
      default:
        return "bg-gray-500/10 text-gray-500";
    }
  };

  const getStatusIcon = (status: FamilyMember["status"]) => {
    switch (status) {
      case "safe":
        return <CheckCircle2 className="w-4 h-4" />;
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "emergency":
        return <AlertCircle className="w-4 h-4 animate-pulse" />;
      case "offline":
        return <Users className="w-4 h-4 opacity-50" />;
      default:
        return null;
    }
  };

  const getTimeAgo = (timestamp?: number) => {
    if (!timestamp) return "Never";
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  const safeCount = members.filter(m => m.status === "safe").length;
  const emergencyCount = members.filter(m => m.status === "emergency").length;

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card
        className={`p-4 border ${
          emergencyCount > 0
            ? "bg-red-500/10 border-red-500/20"
            : "bg-emerald-950/30 border-emerald-500/20"
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-1">
              Family Status
            </h3>
            <p className="text-sm text-muted-foreground">
              {safeCount}/{members.length} members safe
              {emergencyCount > 0 && ` • ${emergencyCount} emergency alert(s)`}
            </p>
          </div>

          {emergencyCount > 0 && (
            <AlertCircle className="w-6 h-6 text-red-500 animate-pulse" />
          )}
        </div>
      </Card>

      {/* Family Members Grid */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3">
          Family Members
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {members.map(member => (
            <Card
              key={member.id}
              className={`p-3 border-2 transition-all cursor-pointer ${
                selectedMember === member.id
                  ? "border-primary bg-primary/5"
                  : "border-border/50 hover:border-border"
              }`}
              onClick={() => setSelectedMember(member.id)}
            >
              <div className="space-y-2">
                {/* Avatar & Name */}
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{member.avatar}</span>
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {member.name}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {member.role}
                    </p>
                  </div>
                </div>

                {/* Status Badge */}
                <Badge
                  className={`text-xs font-medium border w-full justify-center ${getStatusColor(member.status)}`}
                >
                  <span className="flex items-center gap-1 w-full justify-center">
                    {getStatusIcon(member.status)}
                    {member.status === "pending"
                      ? "Check In"
                      : member.status.charAt(0).toUpperCase() +
                        member.status.slice(1)}
                  </span>
                </Badge>

                {/* Last Check-in */}
                {member.lastCheckIn && (
                  <p className="text-xs text-muted-foreground text-center">
                    {getTimeAgo(member.lastCheckIn)}
                  </p>
                )}

                {/* Quick Actions */}
                <div className="flex gap-1 pt-1">
                  <button
                    onClick={() => handleCheckIn(member.id)}
                    className="flex-1 px-2 py-1 text-xs rounded bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 transition-colors font-medium"
                  >
                    ✓ Safe
                  </button>

                  {member.role === "child" && (
                    <button
                      onClick={() => setShowLocationShare(!showLocationShare)}
                      className="flex-1 px-2 py-1 text-xs rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 transition-colors"
                    >
                      📍 Locate
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Emergency SOS */}
      {selectedMember && (
        <Card className="p-4 border-red-500/30 bg-red-500/5">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-500">
              Emergency Alert
            </p>
            <Button
              onClick={() => handleSOS(selectedMember)}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              <AlertCircle className="w-4 h-4 mr-2" />
              Send SOS for {members.find(m => m.id === selectedMember)?.name}
            </Button>
          </div>
        </Card>
      )}

      {/* Group Messages */}
      <Card className="p-4 border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <MessageSquare className="w-4 h-4" />
          Trip Messages
        </h3>

        {/* Message Thread */}
        <div className="space-y-2 mb-3 h-48 overflow-y-auto">
          {messages.map(message => (
            <div key={message.id} className="text-xs">
              {message.type === "system" ? (
                <div className="text-center py-2 text-muted-foreground italic">
                  {message.text}
                </div>
              ) : message.type === "alert" ? (
                <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-600">
                  {message.text}
                </div>
              ) : (
                <div className="flex gap-2">
                  <span className="font-medium text-primary min-w-fit">
                    {message.from}:
                  </span>
                  <span className="text-foreground flex-1">{message.text}</span>
                  <span className="text-muted-foreground text-xs ml-auto">
                    {getTimeAgo(message.timestamp)}
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Message Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Message family..."
            value={messageInput}
            onChange={e => setMessageInput(e.target.value)}
            onKeyPress={e => e.key === "Enter" && handleSendMessage()}
            className="flex-1 bg-black/20 border border-border/50 rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/50"
          />
          <Button onClick={handleSendMessage} size="sm">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </Card>

      {/* Emergency Contacts */}
      <Card className="p-4 border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <Phone className="w-4 h-4" />
          Emergency Contacts
        </h3>

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Local Emergency</span>
            <button className="text-primary hover:underline font-medium">
              911
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">US Embassy</span>
            <button className="text-primary hover:underline font-medium">
              +1-202-647-1512
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Travel Insurance</span>
            <button className="text-primary hover:underline font-medium">
              1-800-123-4567
            </button>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Jessica (Concierge)</span>
            <button className="text-primary hover:underline font-medium">
              1-888-TRAVEL-1
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default FamilyCheckIn;
