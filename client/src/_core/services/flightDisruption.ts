/**
 * Flight Disruption Service
 * Monitors flight status and detects disruptions in real-time
 */

export interface FlightInfo {
  flightNumber: string;
  airline: string;
  departure: {
    airport: string;
    time: number; // timestamp
    scheduled: number;
  };
  arrival: {
    airport: string;
    time: number; // timestamp
    scheduled: number;
  };
}

export type FlightStatus =
  | "on-time"
  | "delayed"
  | "cancelled"
  | "diverted"
  | "landed"
  | "unknown";

export interface FlightDisruption {
  flightNumber: string;
  status: FlightStatus;
  delayMinutes?: number;
  reason?: string;
  newTime?: number;
  alternateAirport?: string;
  severity: "low" | "medium" | "high" | "critical";
  detectedAt: number;
  updatedAt: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  role: "primary" | "secondary" | "coordinator" | "local";
  country?: string;
}

export interface CrisisProtocol {
  id: string;
  name: string;
  description: string;
  triggers: string[]; // Event types that trigger this protocol
  actions: ProtocolAction[];
  escalationLevel: number; // 1-5
}

export interface ProtocolAction {
  type: "notify" | "call" | "sms" | "email" | "track" | "reroute";
  target?: EmergencyContact;
  message?: string;
  delay?: number; // ms delay before executing
  condition?: boolean;
}

class FlightDisruptionService {
  private flights: Map<string, FlightInfo> = new Map();
  private disruptions: Map<string, FlightDisruption> = new Map();
  private emergencyContacts: EmergencyContact[] = [];
  private protocols: Map<string, CrisisProtocol> = new Map();
  private checkInterval: number | null = null;
  private eventHandlers: Map<string, Set<(data: any) => void>> = new Map();

  /**
   * Register a flight to monitor
   */
  addFlight(flight: FlightInfo): void {
    this.flights.set(flight.flightNumber, flight);
    console.log(`[FlightDisruption] Monitoring flight: ${flight.flightNumber}`);
  }

  /**
   * Add emergency contact
   */
  addEmergencyContact(contact: EmergencyContact): void {
    this.emergencyContacts.push(contact);
    console.log(`[FlightDisruption] Added emergency contact: ${contact.name}`);
  }

  /**
   * Register a crisis protocol (e.g., "Flight Cancelled" → notify family, rebook, etc.)
   */
  registerProtocol(protocol: CrisisProtocol): void {
    this.protocols.set(protocol.id, protocol);
    console.log(`[FlightDisruption] Registered protocol: ${protocol.name}`);
  }

  /**
   * Start monitoring flights for disruptions
   */
  startMonitoring(checkIntervalMs: number = 30000): void {
    console.log("[FlightDisruption] Starting flight monitoring...");

    this.checkInterval = window.setInterval(() => {
      this.checkFlightStatus();
    }, checkIntervalMs);
  }

  /**
   * Stop monitoring flights
   */
  stopMonitoring(): void {
    if (this.checkInterval !== null) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    console.log("[FlightDisruption] Stopped flight monitoring");
  }

  /**
   * Update flight status manually (simulating API call)
   */
  updateFlightStatus(
    flightNumber: string,
    status: FlightStatus,
    delayMinutes?: number,
    reason?: string
  ): void {
    const flight = this.flights.get(flightNumber);
    if (!flight) {
      console.warn(`[FlightDisruption] Flight not found: ${flightNumber}`);
      return;
    }

    const disruption: FlightDisruption = {
      flightNumber,
      status,
      delayMinutes,
      reason,
      severity: this.calculateSeverity(status, delayMinutes),
      detectedAt: Date.now(),
      updatedAt: Date.now(),
    };

    this.disruptions.set(flightNumber, disruption);

    // If status changed, trigger protocols
    if (status !== "on-time" && status !== "landed") {
      this.triggerProtocols(disruption);
      this.emit("disruption-detected", disruption);
    }

    console.log(
      `[FlightDisruption] Flight ${flightNumber}: ${status} ${delayMinutes ? `(${delayMinutes}m delay)` : ""}`
    );
  }

  /**
   * Get active disruptions
   */
  getDisruptions(): FlightDisruption[] {
    return Array.from(this.disruptions.values()).filter(
      d => d.status !== "on-time" && d.status !== "landed"
    );
  }

  /**
   * Get disruption for specific flight
   */
  getFlightDisruption(flightNumber: string): FlightDisruption | undefined {
    return this.disruptions.get(flightNumber);
  }

  /**
   * Subscribe to disruption events
   */
  on(event: string, handler: (data: any) => void): () => void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, new Set());
    }
    this.eventHandlers.get(event)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(event)?.delete(handler);
    };
  }

  /**
   * Get emergency contacts ordered by escalation
   */
  getEmergencyContacts(role?: EmergencyContact["role"]): EmergencyContact[] {
    let contacts = this.emergencyContacts;
    if (role) {
      contacts = contacts.filter(c => c.role === role);
    }
    return contacts.sort((a, b) => {
      const roleOrder: Record<string, number> = {
        primary: 0,
        secondary: 1,
        coordinator: 2,
        local: 3,
      };
      return roleOrder[a.role] - roleOrder[b.role];
    });
  }

  /**
   * Trigger all applicable protocols for a disruption
   */
  private triggerProtocols(disruption: FlightDisruption): void {
    for (const protocol of this.protocols.values()) {
      // Check if any trigger matches this disruption
      const triggered = protocol.triggers.some(trigger => {
        if (trigger === "flight-delayed" && disruption.status === "delayed")
          return true;
        if (trigger === "flight-cancelled" && disruption.status === "cancelled")
          return true;
        if (trigger === "flight-diverted" && disruption.status === "diverted")
          return true;
        if (
          trigger === "high-delay" &&
          disruption.delayMinutes &&
          disruption.delayMinutes > 120
        )
          return true;
        return false;
      });

      if (triggered) {
        console.log(`[FlightDisruption] Executing protocol: ${protocol.name}`);
        this.executeProtocol(protocol, disruption);
      }
    }
  }

  /**
   * Execute crisis protocol with escalation
   */
  private executeProtocol(
    protocol: CrisisProtocol,
    disruption: FlightDisruption
  ): void {
    protocol.actions.forEach((action, index) => {
      const delay = action.delay || index * 500; // Stagger actions by 500ms

      setTimeout(() => {
        const isDisabled =
          Object.prototype.hasOwnProperty.call(action, "condition") &&
          action.condition === false;
        if (isDisabled) return;

        switch (action.type) {
          case "notify":
            this.emit("notify", {
              contact: action.target,
              message:
                action.message ||
                `Flight ${disruption.flightNumber} is ${disruption.status}`,
              severity: disruption.severity,
            });
            break;

          case "call":
            this.emit("call-contact", {
              contact: action.target,
              reason: action.message,
            });
            break;

          case "sms":
            this.emit("sms-contact", {
              contact: action.target,
              message: action.message,
            });
            break;

          case "email":
            this.emit("email-contact", {
              contact: action.target,
              message: action.message,
            });
            break;

          case "track":
            this.emit("track-disruption", {
              disruption,
              protocol,
            });
            break;

          case "reroute":
            this.emit("suggest-alternatives", {
              flight: disruption.flightNumber,
              reason: action.message,
            });
            break;
        }
      }, delay);
    });

    this.emit("protocol-executed", {
      protocol: protocol.name,
      disruption: disruption.flightNumber,
      escalationLevel: protocol.escalationLevel,
    });
  }

  /**
   * Check flight status (mock implementation - in production would call API)
   */
  private checkFlightStatus(): void {
    // This would call real flight status API in production
    // For now, it's a placeholder
  }

  /**
   * Calculate disruption severity
   */
  private calculateSeverity(
    status: FlightStatus,
    delayMinutes?: number
  ): "low" | "medium" | "high" | "critical" {
    if (status === "cancelled") return "critical";
    if (status === "diverted") return "high";
    if (delayMinutes && delayMinutes > 240) return "high";
    if (delayMinutes && delayMinutes > 120) return "medium";
    if (delayMinutes && delayMinutes > 30) return "low";
    return "low";
  }

  /**
   * Emit event
   */
  private emit(event: string, data: any): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      handlers.forEach(handler => handler(data));
    }
  }
}

// Singleton instance
let flightDisruptionInstance: FlightDisruptionService | null = null;

export function getFlightDisruptionService(): FlightDisruptionService {
  if (!flightDisruptionInstance) {
    flightDisruptionInstance = new FlightDisruptionService();
  }
  return flightDisruptionInstance;
}
