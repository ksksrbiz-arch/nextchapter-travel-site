import { useEffect, useRef, useCallback, useState } from "react";

export type SSEMessagePayload = {
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
  createdAt: string; // ISO string over the wire
};

export type SSETypingPayload = {
  fromUserId: number;
  toUserId: number;
  isTyping: boolean;
};

export type SSEReadPayload = {
  byUserId: number;
  fromUserId: number;
};

export type SSEEvent =
  | { type: "message"; data: SSEMessagePayload }
  | { type: "typing"; data: SSETypingPayload }
  | { type: "read"; data: SSEReadPayload }
  | { type: "ping" };

type UseSSEMessagesOptions = {
  onMessage?: (msg: SSEMessagePayload) => void;
  onTyping?: (evt: SSETypingPayload) => void;
  onRead?: (evt: SSEReadPayload) => void;
  enabled?: boolean;
};

/**
 * Connects to /api/messages/stream (SSE) and fires callbacks on events.
 * Automatically reconnects on disconnect with exponential back-off.
 */
export function useSSEMessages({
  onMessage,
  onTyping,
  onRead,
  enabled = true,
}: UseSSEMessagesOptions) {
  const esRef = useRef<EventSource | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const retryDelay = useRef(1000);
  const [connected, setConnected] = useState(false);

  const connect = useCallback(() => {
    if (!enabled) return;
    if (esRef.current) {
      esRef.current.close();
    }

    const es = new EventSource("/api/messages/stream", {
      withCredentials: true,
    });
    esRef.current = es;

    es.onopen = () => {
      setConnected(true);
      retryDelay.current = 1000; // reset back-off on success
    };

    es.onmessage = e => {
      try {
        const event: SSEEvent = JSON.parse(e.data);
        if (event.type === "message" && onMessage) {
          onMessage(event.data);
        } else if (event.type === "typing" && onTyping) {
          onTyping(event.data);
        } else if (event.type === "read" && onRead) {
          onRead(event.data);
        }
        // ping events are ignored
      } catch {
        // malformed event — ignore
      }
    };

    es.onerror = () => {
      setConnected(false);
      es.close();
      esRef.current = null;
      // Exponential back-off: 1s → 2s → 4s → 8s → max 30s
      const delay = Math.min(retryDelay.current, 30000);
      retryDelay.current = delay * 2;
      retryRef.current = setTimeout(connect, delay);
    };
  }, [enabled, onMessage, onTyping, onRead]);

  useEffect(() => {
    if (!enabled) return;
    connect();
    return () => {
      if (retryRef.current) clearTimeout(retryRef.current);
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }
    };
  }, [connect, enabled]);

  return { connected };
}
