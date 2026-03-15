/**
 * Push Notification Service
 * Handles Web Notifications and background notifications via service workers
 */

export interface NotificationPayload {
  title: string;
  body?: string;
  icon?: string;
  tag?: string; // Replace existing notification with same tag
  requireInteraction?: boolean; // Keep notification until user dismisses
  data?: Record<string, any>;
  actions?: NotificationAction[];
  vibrate?: number[];
}

export interface NotificationAction {
  action: string;
  title: string;
  icon?: string;
}

export type NotificationType =
  | "itinerary-update"
  | "checkin-reminder"
  | "location-alert"
  | "emergency"
  | "message"
  | "system";

class PushNotificationService {
  /**
   * Check if notifications are supported
   */
  isSupported(): boolean {
    return "Notification" in window;
  }

  /**
   * Get current permission status
   */
  getPermission(): NotificationPermission {
    if (!this.isSupported()) {
      return "denied";
    }
    return Notification.permission;
  }

  /**
   * Request notification permission from user
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!this.isSupported()) {
      console.warn("[Notifications] Notifications not supported");
      return "denied";
    }

    if (Notification.permission === "granted") {
      return "granted";
    }

    if (Notification.permission !== "denied") {
      const permission = await Notification.requestPermission();
      return permission;
    }

    return "denied";
  }

  /**
   * Show a local notification
   */
  async notify(
    type: NotificationType,
    payload: NotificationPayload
  ): Promise<void> {
    if (this.getPermission() !== "granted") {
      console.warn("[Notifications] Notification permission not granted");
      return;
    }

    try {
      // Add type to data for tracking
      const data = { ...payload.data, type };

      new Notification(payload.title, {
        body: payload.body,
        icon: payload.icon || "/manifest.json",
        tag: payload.tag,
        requireInteraction: payload.requireInteraction,
        data,
        actions: payload.actions,
        vibrate: payload.vibrate || [200, 100, 200],
      });

      console.log(`[Notifications] Sent: ${type}`);
    } catch (err) {
      console.error("[Notifications] Failed to send notification:", err);
    }
  }

  /**
   * Notify about itinerary changes
   */
  async notifyItineraryUpdate(itemName: string, change: string): Promise<void> {
    await this.notify("itinerary-update", {
      title: "Itinerary Updated",
      body: `${itemName}: ${change}`,
      tag: "itinerary-update",
      vibrate: [200, 100, 200],
    });
  }

  /**
   * Notify about check-in reminders
   */
  async notifyCheckInReminder(familyMemberName: string): Promise<void> {
    await this.notify("checkin-reminder", {
      title: "Check-in Reminder",
      body: `Haven't heard from ${familyMemberName} in a while`,
      tag: "checkin-reminder",
      requireInteraction: true,
      actions: [
        { action: "mark-safe", title: "Mark Safe" },
        { action: "contact", title: "Contact" },
      ],
    });
  }

  /**
   * Notify about location alerts
   */
  async notifyLocationAlert(
    locationName: string,
    alert: string
  ): Promise<void> {
    await this.notify("location-alert", {
      title: `Nearby: ${locationName}`,
      body: alert,
      tag: `location-${locationName}`,
    });
  }

  /**
   * Notify about emergency
   */
  async notifyEmergency(personName: string, type: string): Promise<void> {
    await this.notify("emergency", {
      title: "🚨 EMERGENCY ALERT",
      body: `${personName} has triggered SOS: ${type}`,
      tag: "emergency",
      requireInteraction: true,
      vibrate: [500, 100, 500, 100, 500], // Intense vibration pattern
    });
  }

  /**
   * Notify about message
   */
  async notifyMessage(
    senderName: string,
    messagePreview: string
  ): Promise<void> {
    await this.notify("message", {
      title: `Message from ${senderName}`,
      body: messagePreview,
      tag: `message-${senderName}`,
    });
  }

  /**
   * Notify system message
   */
  async notifySystem(title: string, body?: string): Promise<void> {
    await this.notify("system", {
      title,
      body,
      tag: "system",
    });
  }

  /**
   * Close a notification by tag
   */
  closeNotification(tag: string): void {
    // Try to close via service worker if available
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.controller?.postMessage({
        type: "CLOSE_NOTIFICATION",
        tag,
      });
    }
  }

  /**
   * Register service worker for background notifications
   */
  async registerServiceWorker(
    swPath: string = "/sw.js"
  ): Promise<ServiceWorkerRegistration | null> {
    if (!("serviceWorker" in navigator)) {
      console.warn("[Notifications] Service Workers not supported");
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.register(swPath);
      console.log("[Notifications] Service Worker registered");

      // Listen for messages from service worker
      navigator.serviceWorker.addEventListener("message", event => {
        if (event.data.type === "NOTIFICATION_CLICK") {
          console.log("[Notifications] Notification clicked:", event.data);
          // Handle notification click
        }
      });

      return registration;
    } catch (err) {
      console.error("[Notifications] Failed to register service worker:", err);
      return null;
    }
  }

  /**
   * Subscribe to push notifications (requires service worker)
   */
  async subscribePushNotifications(
    vapidPublicKey: string
  ): Promise<PushSubscription | null> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("[Notifications] Push notifications not supported");
      return null;
    }

    const permission = await this.requestPermission();
    if (permission !== "granted") {
      return null;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(vapidPublicKey),
      });

      console.log("[Notifications] Push subscription created");
      return subscription;
    } catch (err) {
      console.error("[Notifications] Failed to subscribe to push:", err);
      return null;
    }
  }

  /**
   * Check if user is subscribed to push notifications
   */
  async isPushSubscribed(): Promise<boolean> {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      return subscription !== null;
    } catch (err) {
      return false;
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribePushNotifications(): Promise<boolean> {
    if (!("serviceWorker" in navigator)) {
      return false;
    }

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.getSubscription();
      if (subscription) {
        await subscription.unsubscribe();
        console.log("[Notifications] Push unsubscribed");
        return true;
      }
    } catch (err) {
      console.error("[Notifications] Failed to unsubscribe:", err);
    }
    return false;
  }

  // Private utility methods

  private urlBase64ToUint8Array(base64String: string): Uint8Array {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }
}

// Singleton instance
let pushNotificationInstance: PushNotificationService | null = null;

export function getPushNotificationService(): PushNotificationService {
  if (!pushNotificationInstance) {
    pushNotificationInstance = new PushNotificationService();
  }
  return pushNotificationInstance;
}
