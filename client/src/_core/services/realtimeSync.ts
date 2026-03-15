/**
 * Real-time Synchronization Service (WebSocket)
 * Handles live updates for itinerary, family check-in, location sharing
 */

export interface RealtimeMessage {
  type:
    | "itinerary-update"
    | "checkin-status"
    | "location-update"
    | "message"
    | "error";
  tripId: string;
  userId: string;
  timestamp: number;
  data: Record<string, any>;
}

export interface LocationUpdate {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface CheckInStatusUpdate {
  userId: string;
  status: "safe" | "pending" | "emergency" | "offline";
  lastUpdated: number;
  location?: LocationUpdate;
}

class RealtimeSyncService {
  private ws: WebSocket | null = null;
  private url: string;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectDelay = 3000;
  private messageHandlers: Map<string, Set<(msg: RealtimeMessage) => void>> =
    new Map();
  private isConnected = false;
  private heartbeatInterval: number | null = null;
  private tripId: string | null = null;
  private userId: string | null = null;
  private backgroundLocationTracking = false;

  constructor(url: string = "wss://api.nextchapter.travel/ws") {
    this.url = url;
  }

  /**
   * Connect to WebSocket and subscribe to trip updates
   */
  connect(tripId: string, userId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.tripId = tripId;
        this.userId = userId;

        this.ws = new WebSocket(
          `${this.url}?tripId=${tripId}&userId=${userId}`
        );

        this.ws.onopen = () => {
          console.log("[RealtimeSync] Connected to WebSocket");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.startHeartbeat();
          resolve();
        };

        this.ws.onmessage = event => {
          try {
            const message: RealtimeMessage = JSON.parse(event.data);
            this.handleMessage(message);
          } catch (err) {
            console.error("[RealtimeSync] Failed to parse message:", err);
          }
        };

        this.ws.onerror = error => {
          console.error("[RealtimeSync] WebSocket error:", error);
          this.isConnected = false;
          reject(error);
        };

        this.ws.onclose = () => {
          console.log(
            "[RealtimeSync] Connection closed, attempting reconnect..."
          );
          this.isConnected = false;
          this.stopHeartbeat();
          this.attemptReconnect();
        };
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect(): void {
    if (this.ws) {
      this.stopHeartbeat();
      this.ws.close();
      this.ws = null;
    }
    this.isConnected = false;
  }

  /**
   * Subscribe to message type (e.g., 'itinerary-update', 'checkin-status')
   */
  subscribe(type: string, handler: (msg: RealtimeMessage) => void): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, new Set());
    }
    this.messageHandlers.get(type)!.add(handler);

    // Return unsubscribe function
    return () => {
      this.messageHandlers.get(type)?.delete(handler);
    };
  }

  /**
   * Send itinerary update
   */
  sendItineraryUpdate(data: any): void {
    this.sendMessage({
      type: "itinerary-update",
      tripId: this.tripId!,
      userId: this.userId!,
      timestamp: Date.now(),
      data,
    });
  }

  /**
   * Send check-in status update
   */
  sendCheckInStatus(
    status: "safe" | "pending" | "emergency" | "offline"
  ): void {
    this.sendMessage({
      type: "checkin-status",
      tripId: this.tripId!,
      userId: this.userId!,
      timestamp: Date.now(),
      data: { status },
    });
  }

  /**
   * Send location update
   */
  sendLocationUpdate(location: LocationUpdate): void {
    this.sendMessage({
      type: "location-update",
      tripId: this.tripId!,
      userId: this.userId!,
      timestamp: Date.now(),
      data: location,
    });
  }

  /**
   * Send message (chat, alerts)
   */
  sendMessage(message: RealtimeMessage): void {
    if (!this.isConnected || !this.ws) {
      console.warn("[RealtimeSync] Not connected, message queued for retry");
      return;
    }
    try {
      this.ws.send(JSON.stringify(message));
    } catch (err) {
      console.error("[RealtimeSync] Failed to send message:", err);
    }
  }

  /**
   * Start tracking device location in background
   */
  startLocationTracking(
    onLocationUpdate?: (location: LocationUpdate) => void
  ): void {
    if (!navigator.geolocation) {
      console.warn("[RealtimeSync] Geolocation not supported");
      return;
    }

    this.backgroundLocationTracking = true;
    const watchId = navigator.geolocation.watchPosition(
      position => {
        const location: LocationUpdate = {
          userId: this.userId!,
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now(),
        };
        this.sendLocationUpdate(location);
        onLocationUpdate?.(location);
      },
      error => {
        console.error("[RealtimeSync] Geolocation error:", error);
      },
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 30000, // Update every 30 seconds
      }
    );

    // Store watchId for cleanup if needed
    (this as any).locationWatchId = watchId;
  }

  /**
   * Stop tracking device location
   */
  stopLocationTracking(): void {
    if ((this as any).locationWatchId !== undefined) {
      navigator.geolocation.clearWatch((this as any).locationWatchId);
    }
    this.backgroundLocationTracking = false;
  }

  /**
   * Get connection status
   */
  getStatus(): {
    connected: boolean;
    tripId: string | null;
    userId: string | null;
    tracking: boolean;
  } {
    return {
      connected: this.isConnected,
      tripId: this.tripId,
      userId: this.userId,
      tracking: this.backgroundLocationTracking,
    };
  }

  // Private methods

  private handleMessage(message: RealtimeMessage): void {
    const handlers = this.messageHandlers.get(message.type);
    if (handlers) {
      handlers.forEach(handler => handler(message));
    }
  }

  private startHeartbeat(): void {
    this.heartbeatInterval = window.setInterval(() => {
      if (this.ws && this.isConnected) {
        this.ws.send(JSON.stringify({ type: "ping" }));
      }
    }, 30000); // Every 30 seconds
  }

  private stopHeartbeat(): void {
    if (this.heartbeatInterval !== null) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  private attemptReconnect(): void {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay =
        this.reconnectDelay * Math.pow(1.5, this.reconnectAttempts - 1);
      console.log(
        `[RealtimeSync] Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts})`
      );
      setTimeout(() => {
        if (this.tripId && this.userId) {
          this.connect(this.tripId, this.userId).catch(err => {
            console.error("[RealtimeSync] Reconnection failed:", err);
          });
        }
      }, delay);
    } else {
      console.error("[RealtimeSync] Max reconnection attempts reached");
    }
  }
}

// Singleton instance
let realtimeSyncInstance: RealtimeSyncService | null = null;

export function getRealtimeSyncService(): RealtimeSyncService {
  if (!realtimeSyncInstance) {
    realtimeSyncInstance = new RealtimeSyncService();
  }
  return realtimeSyncInstance;
}
