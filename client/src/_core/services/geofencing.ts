/**
 * Geofencing Service
 * Monitors user location and triggers events when entering/exiting trip locations
 */

export interface Geofence {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  radiusKm: number;
  type: "hotel" | "attraction" | "event" | "restaurant" | "meeting-point";
  metadata?: Record<string, any>;
}

export type GeofenceEvent = "enter" | "exit";

export interface GeofenceEventData {
  geofence: Geofence;
  event: GeofenceEvent;
  timestamp: number;
  userLocation: {
    latitude: number;
    longitude: number;
    accuracy: number;
  };
}

class GeofencingService {
  private geofences: Map<string, Geofence> = new Map();
  private activeGeofences: Set<string> = new Set(); // Currently inside
  private eventHandlers: Map<string, Set<(data: GeofenceEventData) => void>> =
    new Map();
  private watchId: number | null = null;
  private checkInterval = 5000; // Check every 5 seconds
  private updateInterval: number | null = null;

  /**
   * Add geofence to monitor
   */
  addGeofence(geofence: Geofence): void {
    this.geofences.set(geofence.id, geofence);
    console.log(
      `[Geofencing] Added geofence: ${geofence.name} (${geofence.radiusKm}km radius)`
    );
  }

  /**
   * Remove geofence from monitoring
   */
  removeGeofence(geofenceId: string): void {
    this.geofences.delete(geofenceId);
    this.activeGeofences.delete(geofenceId);
  }

  /**
   * Start geofence monitoring
   */
  startMonitoring(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }

      console.log("[Geofencing] Starting geofence monitoring...");

      // Start continuous location watching
      this.watchId = navigator.geolocation.watchPosition(
        position => {
          this.checkGeofences(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy
          );
        },
        error => {
          console.error("[Geofencing] Position tracking error:", error);
        },
        {
          enableHighAccuracy: false,
          timeout: 10000,
          maximumAge: 5000, // Check every 5 seconds
        }
      );

      // Fallback polling in case watch doesn't provide frequent updates
      this.updateInterval = window.setInterval(() => {
        navigator.geolocation.getCurrentPosition(position => {
          this.checkGeofences(
            position.coords.latitude,
            position.coords.longitude,
            position.coords.accuracy
          );
        });
      }, this.checkInterval);

      resolve();
    });
  }

  /**
   * Stop geofence monitoring
   */
  stopMonitoring(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
    if (this.updateInterval !== null) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    console.log("[Geofencing] Stopped geofence monitoring");
  }

  /**
   * Subscribe to geofence event
   */
  on(
    geofenceId: string | "all",
    event: GeofenceEvent,
    handler: (data: GeofenceEventData) => void
  ): () => void {
    const key = `${geofenceId}:${event}`;
    if (!this.eventHandlers.has(key)) {
      this.eventHandlers.set(key, new Set());
    }
    this.eventHandlers.get(key)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.eventHandlers.get(key)?.delete(handler);
    };
  }

  /**
   * Get all active geofences (currently inside)
   */
  getActiveGeofences(): Geofence[] {
    return Array.from(this.activeGeofences)
      .map(id => this.geofences.get(id))
      .filter(g => g !== undefined) as Geofence[];
  }

  /**
   * Get all monitored geofences
   */
  getAllGeofences(): Geofence[] {
    return Array.from(this.geofences.values());
  }

  /**
   * Check if user is currently inside a geofence
   */
  isInGeofence(geofenceId: string): boolean {
    return this.activeGeofences.has(geofenceId);
  }

  // Private methods

  private checkGeofences(
    latitude: number,
    longitude: number,
    accuracy: number
  ): void {
    const userLocation = { latitude, longitude, accuracy };

    for (const [id, geofence] of this.geofences.entries()) {
      const distance = this.calculateDistance(
        latitude,
        longitude,
        geofence.latitude,
        geofence.longitude
      );

      const isInside = distance <= geofence.radiusKm;
      const wasInside = this.activeGeofences.has(id);

      // Enter event
      if (isInside && !wasInside) {
        this.activeGeofences.add(id);
        this.triggerEvent({
          geofence,
          event: "enter",
          timestamp: Date.now(),
          userLocation,
        });
        console.log(`[Geofencing] Entered: ${geofence.name}`);
      }

      // Exit event
      if (!isInside && wasInside) {
        this.activeGeofences.delete(id);
        this.triggerEvent({
          geofence,
          event: "exit",
          timestamp: Date.now(),
          userLocation,
        });
        console.log(`[Geofencing] Exited: ${geofence.name}`);
      }
    }
  }

  private triggerEvent(data: GeofenceEventData): void {
    // Specific geofence + event handlers
    const specificKey = `${data.geofence.id}:${data.event}`;
    this.eventHandlers.get(specificKey)?.forEach(handler => handler(data));

    // All geofences + event handlers
    const allKey = `all:${data.event}`;
    this.eventHandlers.get(allKey)?.forEach(handler => handler(data));
  }

  private calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
}

// Singleton instance
let geofencingInstance: GeofencingService | null = null;

export function getGeofencingService(): GeofencingService {
  if (!geofencingInstance) {
    geofencingInstance = new GeofencingService();
  }
  return geofencingInstance;
}
