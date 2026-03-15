/**
 * Mobile App Shell Component
 *
 * Provides the foundation for a Progressive Web App (PWA) experience.
 * Includes:
 * - Responsive layout optimized for mobile
 * - Persistent header/footer navigation
 * - Bottom navigation for app-like feel
 * - Service worker integration
 * - Offline indicator
 */

import { useEffect, useState } from "react";
import { AlertCircle, Wifi, WifiOff } from "lucide-react";
import { Card } from "@/components/ui/card";

interface MobileAppShellProps {
  children: React.ReactNode;
  title: string;
  showBottomNav?: boolean;
}

export function MobileAppShell({
  children,
  title,
  showBottomNav = true,
}: MobileAppShellProps) {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncStatus, setSyncStatus] = useState<
    "idle" | "syncing" | "complete" | "error"
  >("idle");
  const [showSyncIndicator, setShowSyncIndicator] = useState(false);

  useEffect(() => {
    // Monitor online/offline status
    const handleOnline = () => {
      setIsOnline(true);
      setSyncStatus("syncing");
      setShowSyncIndicator(true);
      // Hide indicator after 2 seconds
      const timer = setTimeout(() => setShowSyncIndicator(false), 2000);
      return () => clearTimeout(timer);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowSyncIndicator(true);
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    // Register service worker for PWA functionality
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then(registration => {
          console.log("✅ Service Worker registered", registration);

          // Listen for updates
          registration.addEventListener("updatefound", () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  console.log("🔄 New service worker available");
                  // Could show "app updated" notification here
                }
              });
            }
          });
        })
        .catch(err =>
          console.error("❌ Service Worker registration failed", err)
        );
    }

    // Enable app install prompt
    let deferredPrompt: Event | null = null;
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt = e;
      // Could show install button here
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt
      );
    };
  }, []);

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold text-foreground">{title}</h1>

          {/* Online/Offline Indicator */}
          {showSyncIndicator && (
            <div
              className={`flex items-center gap-1.5 text-xs px-2 py-1 rounded-full ${
                isOnline
                  ? "bg-emerald-500/10 text-emerald-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {isOnline ? (
                <>
                  <Wifi className="w-3 h-3" />
                  <span>Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3" />
                  <span>Offline</span>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Offline Warning Banner */}
      {!isOnline && (
        <div className="bg-yellow-500/10 border-b border-yellow-500/20 px-4 py-2 flex items-center gap-2 text-sm text-yellow-700 dark:text-yellow-400">
          <AlertCircle className="w-4 h-4" />
          <span>
            You're offline. Changes will sync when you're back online.
          </span>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        <div className="max-w-md mx-auto px-4 py-4">{children}</div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      {showBottomNav && (
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <div className="max-w-md mx-auto flex items-center justify-around h-16">
            <a
              href="/portal/dashboard"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                📊
              </div>
              <span>Dashboard</span>
            </a>

            <a
              href="/portal/itinerary"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                📅
              </div>
              <span>Itinerary</span>
            </a>

            <a
              href="/portal/expenses"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                💰
              </div>
              <span>Expenses</span>
            </a>

            <a
              href="/portal/guides"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                🗺️
              </div>
              <span>Guides</span>
            </a>

            <a
              href="/portal/profile"
              className="flex-1 flex flex-col items-center justify-center gap-1 text-xs hover:text-primary transition-colors"
            >
              <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                👤
              </div>
              <span>Profile</span>
            </a>
          </div>
        </nav>
      )}
    </div>
  );
}

export default MobileAppShell;
