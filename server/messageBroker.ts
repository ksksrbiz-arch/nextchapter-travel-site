import type { Response } from "express";

/**
 * In-memory SSE message broker.
 * Keyed by userId (number). Each user can have multiple connections (tabs).
 * Events are pushed to all connections for that user.
 */

export type SSEEvent =
  | { type: "message"; data: MessageEvent }
  | { type: "typing"; data: TypingEvent }
  | { type: "read"; data: ReadEvent }
  | { type: "flight_alert"; data: FlightAlertEvent }
  | { type: "ping" };

export type MessageEvent = {
  id: number;
  fromUserId: number;
  toUserId: number;
  content: string;
  tripId: number | null;
  attachmentUrl: string | null;
  attachmentName: string | null;
  attachmentType: string | null;
  attachmentSize: number | null;
  isRead: boolean;
  createdAt: Date;
};

export type TypingEvent = {
  fromUserId: number;
  toUserId: number;
  isTyping: boolean;
};

export type ReadEvent = {
  byUserId: number;
  fromUserId: number;
};

export type FlightAlertEvent = {
  alertId: number;
  userId: number;
  tripId: number | null;
  flightNumber: string;
  status: "on_time" | "delayed" | "cancelled" | "boarding" | "departed" | "arrived" | "gate_change";
  newDepartureIso?: string | null;
  newArrivalIso?: string | null;
  newGate?: string | null;
  message: string;
  severity: "info" | "warning" | "urgent";
  createdAt: Date;
};

// Map<userId, Set<SSEClient>>
const clients = new Map<number, Set<SSEClient>>();

type SSEClient = {
  res: Response;
  userId: number;
};

/**
 * Register a new SSE connection for a user.
 * Returns a cleanup function to call when the connection closes.
 */
export function registerSSEClient(userId: number, res: Response): () => void {
  const client: SSEClient = { res, userId };

  if (!clients.has(userId)) {
    clients.set(userId, new Set());
  }
  clients.get(userId)!.add(client);

  // Send initial connection confirmation
  sendToClient(res, { type: "ping" });

  return () => {
    clients.get(userId)?.delete(client);
    if (clients.get(userId)?.size === 0) {
      clients.delete(userId);
    }
  };
}

/**
 * Push an SSE event to a specific user (all their connections).
 */
export function pushToUser(userId: number, event: SSEEvent): void {
  const userClients = clients.get(userId);
  if (!userClients || userClients.size === 0) return;

  for (const client of Array.from(userClients)) {
    try {
      sendToClient(client.res, event);
    } catch {
      // Connection was closed; cleanup will happen via the close handler
    }
  }
}

/**
 * Push a message event to both sender and receiver.
 */
export function broadcastMessage(msg: MessageEvent): void {
  pushToUser(msg.fromUserId, { type: "message", data: msg });
  pushToUser(msg.toUserId, { type: "message", data: msg });
}

/**
 * Push a typing indicator to the recipient.
 */
export function broadcastTyping(event: TypingEvent): void {
  pushToUser(event.toUserId, { type: "typing", data: event });
}

/**
 * Push a read receipt to the original sender.
 */
export function broadcastRead(event: ReadEvent): void {
  pushToUser(event.fromUserId, { type: "read", data: event });
}

/**
 * Push a flight-status alert to the affected client.
 */
export function broadcastFlightAlert(event: FlightAlertEvent): void {
  pushToUser(event.userId, { type: "flight_alert", data: event });
}

function sendToClient(res: Response, event: SSEEvent): void {
  const data = JSON.stringify(event);
  res.write(`data: ${data}\n\n`);
  // Flush if available (for compression middleware)
  if (typeof (res as any).flush === "function") {
    (res as any).flush();
  }
}

/**
 * Get count of connected users (for diagnostics).
 */
export function getConnectedCount(): number {
  return clients.size;
}
