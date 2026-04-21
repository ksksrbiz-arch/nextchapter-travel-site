import React, { useState, useEffect, useRef } from "react";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Phone,
  MessageSquare,
  Clock,
  Shield,
  Zap,
  X,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  getFlightDisruptionService,
  FlightDisruption,
  EmergencyContact,
  CrisisProtocol,
} from "../_core/services/flightDisruption";
import { getRealtimeSyncService } from "../_core/services/realtimeSync";
import { getPushNotificationService } from "../_core/services/pushNotifications";

interface CrisisEvent {
  id: string;
  type:
    | "flight-delay"
    | "flight-cancel"
    | "diverted"
    | "sos"
    | "medical"
    | "lost-member";
  severity: "low" | "medium" | "high" | "critical";
  title: string;
  description: string;
  timestamp: number;
  disruption?: FlightDisruption;
  status: "active" | "acknowledged" | "resolved";
  escalationLevel: number;
}

// Unused interface - kept for future use
// interface EscalationAction {
//   label: string;
//   icon: React.ReactNode;
//   action: () => void;
//   severity: "low" | "medium" | "high" | "critical";
// }

const CrisisManagement: React.FC<{ tripId: string }> = ({ tripId }) => {
  const [crisisEvents, setCrisisEvents] = useState<CrisisEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CrisisEvent | null>(null);
  const [emergencyContacts, setEmergencyContacts] = useState<
    EmergencyContact[]
  >([]);
  const [protocols, setProtocols] = useState<CrisisProtocol[]>([]);
  const [_escalationMode, _setEscalationMode] = useState(false);
  const [_expandedEvent, _setExpandedEvent] = useState<string | null>(null);

  const flightDisruptionService = useRef(getFlightDisruptionService());
  const realtimeSync = useRef(getRealtimeSyncService());
  const pushNotifications = useRef(getPushNotificationService());

  // Initialize services and mock data
  useEffect(() => {
    initializeServices();
  }, [tripId]);

  const initializeServices = () => {
    // Setup emergency contacts
    const contacts: EmergencyContact[] = [
      {
        id: "mom",
        name: "Mom",
        relationship: "Parent",
        phone: "+1-555-0101",
        email: "mom@example.com",
        role: "primary",
      },
      {
        id: "embassy",
        name: "US Embassy",
        relationship: "Embassy",
        phone: "+1-555-EMBASSY",
        role: "local",
        country: "Orlando",
      },
      {
        id: "insurance",
        name: "Travel Insurance",
        relationship: "Insurance Provider",
        phone: "+1-555-INSURE",
        email: "claims@insurance.com",
        role: "secondary",
      },
      {
        id: "concierge",
        name: "Trip Concierge",
        relationship: "Support",
        phone: "+1-555-CONCIERGE",
        email: "support@nextchapter.travel",
        role: "coordinator",
      },
    ];
    setEmergencyContacts(contacts);
    contacts.forEach(c =>
      flightDisruptionService.current.addEmergencyContact(c)
    );

    // Register crisis protocols
    const protocolsList: CrisisProtocol[] = [
      {
        id: "flight-delayed-120",
        name: "Flight Delayed (2+ hours)",
        description: "Notify family, offer rebooking options",
        triggers: ["high-delay"],
        escalationLevel: 2,
        actions: [
          {
            type: "notify",
            target: contacts[0], // Mom
            message: "Your flight is delayed by 2+ hours",
          },
          {
            type: "email",
            target: contacts[2], // Insurance
            message: "Flight delay claim initiated",
          },
        ],
      },
      {
        id: "flight-cancelled",
        name: "Flight Cancelled",
        description:
          "Critical: Notify all contacts, find alternatives, arrange rebooking",
        triggers: ["flight-cancelled"],
        escalationLevel: 4,
        actions: [
          {
            type: "notify",
            target: contacts[0],
            message:
              "Your flight has been CANCELLED. Immediate rebooking required.",
          },
          {
            type: "call",
            target: contacts[3],
            message: "Flight cancelled - help with alternative flights",
          },
          {
            type: "email",
            target: contacts[2],
            message: "Flight cancellation - file claim immediately",
          },
          {
            type: "reroute",
            message: "Finding alternative flights...",
          },
        ],
      },
      {
        id: "diverted",
        name: "Flight Diverted",
        description:
          "Track location, notify family, arrange ground transportation",
        triggers: ["flight-diverted"],
        escalationLevel: 3,
        actions: [
          {
            type: "notify",
            target: contacts[0],
            message: "Flight has been diverted to alternate airport",
          },
          {
            type: "track",
            message: "Tracking flight location and passenger status",
          },
          {
            type: "call",
            target: contacts[3],
            message: "Arrange ground transportation from diversion airport",
          },
        ],
      },
    ];
    setProtocols(protocolsList);
    protocolsList.forEach(p =>
      flightDisruptionService.current.registerProtocol(p)
    );

    // Listen for disruptions
    flightDisruptionService.current.on(
      "disruption-detected",
      (disruption: FlightDisruption) => {
        const newEvent: CrisisEvent = {
          id: `crisis-${Date.now()}`,
          type:
            disruption.status === "cancelled"
              ? "flight-cancel"
              : disruption.status === "delayed"
                ? "flight-delay"
                : "diverted",
          severity: disruption.severity,
          title: `Flight ${disruption.flightNumber} ${disruption.status}`,
          description:
            disruption.reason ||
            "Flight status has changed. Check details for action items.",
          timestamp: Date.now(),
          disruption,
          status: "active",
          escalationLevel: 1,
        };
        setCrisisEvents(prev => [newEvent, ...prev]);
        setSelectedEvent(newEvent);

        // Show push notification
        if (disruption.severity === "critical") {
          pushNotifications.current.notifyEmergency(
            `Flight ${disruption.flightNumber}`,
            `Flight ${disruption.status}`
          );
        } else {
          pushNotifications.current.notifySystem(
            `Flight ${disruption.status}`,
            `Flight ${disruption.flightNumber}: ${disruption.reason || "Status changed"}`
          );
        }
      }
    );

    flightDisruptionService.current.on("protocol-executed", data => {
      console.log("[CrisisManagement] Protocol executed:", data);
      pushNotifications.current.notifySystem(
        "Crisis Protocol Activated",
        data.protocol
      );
    });
  };

  const handleEscalate = (event: CrisisEvent) => {
    const newEvent = {
      ...event,
      escalationLevel: Math.min(event.escalationLevel + 1, 5),
      status: "acknowledged" as const,
    };
    setCrisisEvents(prev => prev.map(e => (e.id === event.id ? newEvent : e)));
    setSelectedEvent(newEvent);
    realtimeSync.current.sendMessage({
      type: "emergency",
      tripId,
      userId: "user-456",
      timestamp: Date.now(),
      data: {
        eventId: event.id,
        escalationLevel: newEvent.escalationLevel,
        contacts: emergencyContacts,
      },
    } as any);
  };

  const handleContactEmergency = (contact: EmergencyContact) => {
    console.log("[CrisisManagement] Contacting:", contact.name);
    pushNotifications.current.notifySystem(
      "Emergency Contact",
      `Initiating contact with ${contact.name}...`
    );
  };

  const handleResolve = (eventId: string) => {
    setCrisisEvents(prev =>
      prev.map(e => (e.id === eventId ? { ...e, status: "resolved" } : e))
    );
    if (selectedEvent?.id === eventId) {
      setSelectedEvent(null);
    }
  };

  const simulateFlightDisruption = (
    status: "delayed" | "cancelled" | "diverted"
  ) => {
    const delays = {
      delayed: 180,
      cancelled: null,
      diverted: null,
    };
    const reasons = {
      delayed: "Mechanical issue - engineers on-site",
      cancelled: "Weather conditions prohibit safe operation",
      diverted: "Medical emergency on board",
    };
    flightDisruptionService.current.updateFlightStatus(
      "AA123",
      status as any,
      delays[status] || undefined,
      reasons[status]
    );
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/10 border-red-500/20 text-red-700";
      case "high":
        return "bg-orange-500/10 border-orange-500/20 text-orange-700";
      case "medium":
        return "bg-yellow-500/10 border-yellow-500/20 text-yellow-700";
      case "low":
        return "bg-blue-500/10 border-blue-500/20 text-blue-700";
      default:
        return "bg-gray-500/10 border-gray-500/20 text-gray-700";
    }
  };

  const activeEvents = crisisEvents.filter(e => e.status === "active");
  const acknowledgedEvents = crisisEvents.filter(
    e => e.status === "acknowledged"
  );
  const resolvedEvents = crisisEvents.filter(e => e.status === "resolved");

  return (
    <div className="space-y-6">
      {/* Status Summary */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="p-4 border-red-500/20 bg-red-500/5">
          <div className="text-sm text-muted-foreground">Active Crises</div>
          <div className="text-2xl font-bold text-red-600">
            {activeEvents.length}
          </div>
        </Card>
        <Card className="p-4 border-yellow-500/20 bg-yellow-500/5">
          <div className="text-sm text-muted-foreground">Acknowledged</div>
          <div className="text-2xl font-bold text-yellow-600">
            {acknowledgedEvents.length}
          </div>
        </Card>
        <Card className="p-4 border-emerald-500/20 bg-emerald-500/5">
          <div className="text-sm text-muted-foreground">Resolved</div>
          <div className="text-2xl font-bold text-emerald-600">
            {resolvedEvents.length}
          </div>
        </Card>
        <Card className="p-4 border-blue-500/20 bg-blue-500/5">
          <div className="text-sm text-muted-foreground">Escalation</div>
          <div className="text-2xl font-bold text-blue-600">
            {selectedEvent?.escalationLevel || 0}/5
          </div>
        </Card>
      </div>

      {/* Demo Buttons - Testing */}
      {activeEvents.length === 0 && (
        <Card className="p-4 border-blue-500/20 bg-blue-500/5">
          <p className="text-sm text-muted-foreground mb-3">
            Simulate disruptions for testing:
          </p>
          <div className="flex gap-2">
            <Button
              size="sm"
              className="bg-yellow-600 hover:bg-yellow-700"
              onClick={() => simulateFlightDisruption("delayed")}
            >
              Simulate Delay
            </Button>
            <Button
              size="sm"
              className="bg-orange-600 hover:bg-orange-700"
              onClick={() => simulateFlightDisruption("diverted")}
            >
              Simulate Divert
            </Button>
            <Button
              size="sm"
              className="bg-red-600 hover:bg-red-700"
              onClick={() => simulateFlightDisruption("cancelled")}
            >
              Simulate Cancel
            </Button>
          </div>
        </Card>
      )}

      {/* Active Crisis Events */}
      {activeEvents.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            🚨 Active Crises
          </h3>
          {activeEvents.map(event => (
            <Card
              key={event.id}
              className={`p-4 border cursor-pointer transition ${getSeverityColor(event.severity)}`}
              onClick={() => setSelectedEvent(event)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  {event.severity === "critical" && (
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                  )}
                  {event.severity === "high" && (
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  )}
                  {event.severity === "medium" && (
                    <Clock className="w-5 h-5 flex-shrink-0 opacity-75" />
                  )}
                  <div className="flex-1">
                    <h4 className="font-semibold">{event.title}</h4>
                    <p className="text-sm opacity-75 mt-1">
                      {event.description}
                    </p>
                  </div>
                </div>
                <Badge
                  className={`text-xs ${
                    event.severity === "critical"
                      ? "bg-red-600"
                      : event.severity === "high"
                        ? "bg-orange-600"
                        : "bg-yellow-600"
                  }`}
                >
                  L{event.escalationLevel}
                </Badge>
              </div>

              {/* Quick Actions */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={e => {
                    e.stopPropagation();
                    handleEscalate(event);
                  }}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Escalate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={e => {
                    e.stopPropagation();
                    handleResolve(event.id);
                  }}
                >
                  <CheckCircle2 className="w-4 h-4 mr-1" />
                  Resolve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Event Details */}
      {selectedEvent && (
        <Card
          className={`p-5 border-2 ${getSeverityColor(selectedEvent.severity)}`}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold">{selectedEvent.title}</h3>
              <p className="text-sm opacity-75 mt-1">
                {new Date(selectedEvent.timestamp).toLocaleTimeString()}
              </p>
            </div>
            <button
              onClick={() => setSelectedEvent(null)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {/* Crisis Details */}
            <div>
              <h4 className="font-semibold text-sm mb-2">Details</h4>
              <p className="text-sm">{selectedEvent.description}</p>
              {selectedEvent.disruption && (
                <div className="mt-2 p-3 bg-black/10 rounded-lg text-sm space-y-1">
                  <div>
                    <span className="opacity-75">Flight:</span>{" "}
                    {selectedEvent.disruption.flightNumber}
                  </div>
                  <div>
                    <span className="opacity-75">Reason:</span>{" "}
                    {selectedEvent.disruption.reason || "N/A"}
                  </div>
                  {selectedEvent.disruption.delayMinutes && (
                    <div>
                      <span className="opacity-75">Delay:</span>{" "}
                      {selectedEvent.disruption.delayMinutes} minutes
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Escalation Actions */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-sm">Escalation Actions</h4>
                <Badge className="bg-blue-600">
                  Level {selectedEvent.escalationLevel}/5
                </Badge>
              </div>
              <div className="space-y-2">
                <Button
                  className="w-full justify-start"
                  variant={
                    selectedEvent.escalationLevel >= 2 ? "default" : "outline"
                  }
                  onClick={() => handleEscalate(selectedEvent)}
                  disabled={selectedEvent.escalationLevel >= 5}
                >
                  <Zap className="w-4 h-4 mr-2" />
                  Escalate to Level{" "}
                  {Math.min(selectedEvent.escalationLevel + 1, 5)}
                </Button>
              </div>
            </div>

            {/* Emergency Contacts */}
            <div>
              <h4 className="font-semibold text-sm mb-3">
                Contact Emergency Responders
              </h4>
              <div className="space-y-2">
                {emergencyContacts.map(contact => (
                  <div
                    key={contact.id}
                    className="flex items-center justify-between p-3 bg-black/5 rounded border border-border/50"
                  >
                    <div>
                      <div className="font-sm font-medium">{contact.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {contact.role.toUpperCase()} • {contact.phone}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        className="p-2 hover:bg-blue-500/10 rounded transition"
                        title="Call"
                        onClick={() => handleContactEmergency(contact)}
                      >
                        <Phone className="w-4 h-4 text-blue-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-green-500/10 rounded transition"
                        title="SMS"
                        onClick={() => handleContactEmergency(contact)}
                      >
                        <MessageSquare className="w-4 h-4 text-green-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Protocol Info */}
            <div>
              <h4 className="font-semibold text-sm mb-2">
                Activated Protocols
              </h4>
              <div className="space-y-2">
                {protocols
                  .filter(
                    p =>
                      (selectedEvent.severity === "critical" &&
                        p.escalationLevel >= 3) ||
                      (selectedEvent.severity === "high" &&
                        p.escalationLevel >= 2) ||
                      (selectedEvent.severity === "medium" &&
                        p.escalationLevel >= 1)
                  )
                  .map(p => (
                    <div
                      key={p.id}
                      className="p-3 bg-black/5 rounded border border-border/50"
                    >
                      <div className="flex items-start gap-2">
                        <Shield className="w-4 h-4 mt-0.5 flex-shrink-0 text-amber-600" />
                        <div>
                          <div className="font-sm font-medium">{p.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {p.description}
                          </div>
                          <div className="text-xs text-muted-foreground mt-1">
                            {p.actions.length} automatic actions
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Historical Events */}
      {(acknowledgedEvents.length > 0 || resolvedEvents.length > 0) && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">History</h3>
          <div className="space-y-2">
            {[...acknowledgedEvents, ...resolvedEvents].map(event => (
              <Card
                key={event.id}
                className="p-3 border opacity-65 cursor-pointer hover:opacity-100 transition"
                onClick={() => setSelectedEvent(event)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {event.status === "resolved" && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                    {event.status === "acknowledged" && (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <span className="text-sm">{event.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(event.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CrisisManagement;
