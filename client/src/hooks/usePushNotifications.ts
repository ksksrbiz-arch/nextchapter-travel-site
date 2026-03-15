import { useState, useEffect, useCallback } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

type PushStatus = "unsupported" | "denied" | "granted" | "default" | "loading";

function urlBase64ToUint8Array(base64String: string): Uint8Array<ArrayBuffer> {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length) as Uint8Array<ArrayBuffer>;
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const [status, setStatus] = useState<PushStatus>("loading");
  const [isSubscribed, setIsSubscribed] = useState(false);

  const subscribeMutation = trpc.push.subscribe.useMutation({
    onSuccess: () => {
      setIsSubscribed(true);
      toast.success("Push notifications enabled!");
    },
    onError: () => toast.error("Failed to save push subscription."),
  });

  const unsubscribeMutation = trpc.push.unsubscribe.useMutation({
    onSuccess: () => {
      setIsSubscribed(false);
      toast.success("Push notifications disabled.");
    },
  });

  useEffect(() => {
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      setStatus("unsupported");
      return;
    }
    setStatus(Notification.permission as PushStatus);

    // Check if already subscribed
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setIsSubscribed(!!sub);
      });
    });
  }, []);

  const registerServiceWorker = useCallback(async () => {
    if (!("serviceWorker" in navigator)) return null;
    try {
      const reg = await navigator.serviceWorker.register("/sw.js");
      await navigator.serviceWorker.ready;
      return reg;
    } catch (err) {
      console.error("SW registration failed:", err);
      return null;
    }
  }, []);

  const requestPermissionAndSubscribe = useCallback(async () => {
    if (!("Notification" in window)) {
      toast.error("Your browser does not support push notifications.");
      return;
    }

    setStatus("loading");

    const permission = await Notification.requestPermission();
    setStatus(permission as PushStatus);

    if (permission !== "granted") {
      toast.error("Push notification permission was denied.");
      return;
    }

    const reg = await registerServiceWorker();
    if (!reg) {
      toast.error("Service worker registration failed.");
      return;
    }

    try {
      // Use a dummy VAPID key for demo — in production, generate a real one
      // For now we store the subscription endpoint without actual push delivery
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U"
        ),
      });

      const json = sub.toJSON();
      subscribeMutation.mutate({
        endpoint: json.endpoint!,
        p256dh: (json.keys as any)?.p256dh ?? "",
        auth: (json.keys as any)?.auth ?? "",
        userAgent: navigator.userAgent,
      });
    } catch (err) {
      console.error("Push subscription failed:", err);
      toast.error("Failed to subscribe to push notifications.");
      setStatus("denied");
    }
  }, [registerServiceWorker, subscribeMutation]);

  const unsubscribe = useCallback(async () => {
    const reg = await navigator.serviceWorker.ready;
    const sub = await reg.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      unsubscribeMutation.mutate({ endpoint: sub.endpoint });
    }
  }, [unsubscribeMutation]);

  return {
    status,
    isSubscribed,
    isSupported: status !== "unsupported",
    requestPermissionAndSubscribe,
    unsubscribe,
  };
}
