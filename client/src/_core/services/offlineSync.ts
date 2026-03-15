/**
 * Offline-First Synchronization Service
 *
 * Manages local data caching, synchronization with backend,
 * and conflict resolution for offline-capable features.
 *
 * Strategy:
 * - IndexedDB for structured data (itinerary, expenses, documents)
 * - Service Worker for request interception & caching
 * - Background sync for pending actions when online
 * - Last-write-wins conflict resolution
 */

interface SyncAction {
  id: string;
  type: "CREATE" | "UPDATE" | "DELETE";
  entity: string; // "itinerary", "expense", "document", etc.
  timestamp: number;
  data: Record<string, unknown>;
  synced: boolean;
  error?: string;
}

interface CacheMetadata {
  lastSynced: number;
  version: number;
  hash: string; // For conflict detection
}

class OfflineSyncService {
  private db: IDBDatabase | null = null;
  private syncQueue: SyncAction[] = [];
  private isOnline: boolean = navigator.onLine;
  private syncInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.initDatabase();
    this.setupEventListeners();
  }

  /**
   * Initialize IndexedDB with object stores
   */
  private initDatabase() {
    const request = indexedDB.open("nextchapter-travel", 1);

    request.onerror = () => {
      console.error("IndexedDB init failed");
    };

    request.onupgradeneeded = event => {
      const db = (event.target as IDBOpenDBRequest).result;

      // Store for trip itinerary
      if (!db.objectStoreNames.contains("itinerary")) {
        db.createObjectStore("itinerary", { keyPath: "id" });
      }

      // Store for expenses
      if (!db.objectStoreNames.contains("expenses")) {
        db.createObjectStore("expenses", { keyPath: "id" });
      }

      // Store for documents
      if (!db.objectStoreNames.contains("documents")) {
        db.createObjectStore("documents", { keyPath: "id" });
      }

      // Store for sync queue
      if (!db.objectStoreNames.contains("syncQueue")) {
        db.createObjectStore("syncQueue", { keyPath: "id" });
      }

      // Store for cache metadata
      if (!db.objectStoreNames.contains("cacheMetadata")) {
        db.createObjectStore("cacheMetadata", { keyPath: "entity" });
      }
    };

    request.onsuccess = () => {
      this.db = request.result;
      console.log("IndexedDB initialized");
      this.loadSyncQueue();
    };
  }

  /**
   * Set up online/offline event listeners
   */
  private setupEventListeners() {
    window.addEventListener("online", () => {
      this.isOnline = true;
      console.log("🟢 Online - starting sync");
      this.syncPendingActions();
    });

    window.addEventListener("offline", () => {
      this.isOnline = false;
      console.log("🔴 Offline - queuing actions");
    });

    // Periodic sync when online (every 30 seconds)
    if ("serviceWorker" in navigator) {
      this.syncInterval = setInterval(() => {
        if (this.isOnline) {
          this.syncPendingActions();
        }
      }, 30000);
    }
  }

  /**
   * Save data locally with sync tracking
   */
  async saveLocal(entity: string, data: Record<string, unknown>) {
    if (!this.db) return;

    const store = this.db.transaction(entity, "readwrite").objectStore(entity);
    const putRequest = store.put(data);

    return new Promise((resolve, reject) => {
      putRequest.onsuccess = () => resolve(putRequest.result);
      putRequest.onerror = () => reject(putRequest.error);
    });
  }

  /**
   * Queue action for later sync
   */
  async queueAction(action: Omit<SyncAction, "id" | "timestamp" | "synced">) {
    if (!this.db) return;

    const syncAction: SyncAction = {
      id: `${action.entity}-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      synced: false,
      ...action,
    };

    // Save to queue
    const transaction = this.db.transaction("syncQueue", "readwrite");
    const store = transaction.objectStore("syncQueue");
    store.add(syncAction);

    this.syncQueue.push(syncAction);

    // If online, attempt sync immediately
    if (this.isOnline) {
      await this.syncAction(syncAction);
    }
  }

  /**
   * Sync a single action to backend
   */
  private async syncAction(action: SyncAction) {
    try {
      const response = await fetch(`/api/sync/${action.entity}`, {
        method: action.type === "DELETE" ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: action.type,
          data: action.data,
          timestamp: action.timestamp,
        }),
      });

      if (response.ok) {
        // Mark as synced
        action.synced = true;
        await this.removeSyncQueueItem(action.id);
        console.log(`✅ Synced: ${action.entity} (${action.id})`);
        return true;
      } else {
        action.error = `HTTP ${response.status}`;
        console.warn(`❌ Sync failed: ${action.entity}`, action.error);
        return false;
      }
    } catch (error) {
      action.error = String(error);
      console.error(`❌ Sync error: ${action.entity}`, error);
      return false;
    }
  }

  /**
   * Sync all pending actions
   */
  async syncPendingActions() {
    if (this.syncQueue.length === 0) return;

    console.log(`🔄 Syncing ${this.syncQueue.length} pending actions...`);

    for (const action of this.syncQueue) {
      if (!action.synced) {
        await this.syncAction(action);
      }
    }
  }

  /**
   * Load sync queue from IndexedDB on startup
   */
  private async loadSyncQueue() {
    if (!this.db) return;

    const transaction = this.db.transaction("syncQueue", "readonly");
    const store = transaction.objectStore("syncQueue");
    const request = store.getAll();

    request.onsuccess = () => {
      this.syncQueue = request.result.filter(action => !action.synced);
      console.log(`📋 Loaded ${this.syncQueue.length} pending actions`);
    };
  }

  /**
   * Retrieve data from local cache
   */
  async getLocal(entity: string, id?: string) {
    if (!this.db) return null;

    const transaction = this.db.transaction(entity, "readonly");
    const store = transaction.objectStore(entity);

    if (id) {
      return new Promise(resolve => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
      });
    } else {
      return new Promise(resolve => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
      });
    }
  }

  /**
   * Clear specific entity cache
   */
  async clearCache(entity: string) {
    if (!this.db) return;

    const transaction = this.db.transaction(entity, "readwrite");
    const store = transaction.objectStore(entity);
    store.clear();

    console.log(`🗑️ Cleared cache for ${entity}`);
  }

  /**
   * Remove single item from sync queue
   */
  private async removeSyncQueueItem(id: string) {
    if (!this.db) return;

    const transaction = this.db.transaction("syncQueue", "readwrite");
    const store = transaction.objectStore("syncQueue");
    store.delete(id);

    this.syncQueue = this.syncQueue.filter(a => a.id !== id);
  }

  /**
   * Get sync queue statistics
   */
  getSyncStats() {
    return {
      pending: this.syncQueue.filter(a => !a.synced).length,
      synced: this.syncQueue.filter(a => a.synced).length,
      failed: this.syncQueue.filter(a => a.error).length,
      isOnline: this.isOnline,
    };
  }

  /**
   * Cleanup on app unload
   */
  destroy() {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    if (this.db) {
      this.db.close();
    }
  }
}

// Singleton instance
let syncService: OfflineSyncService | null = null;

export function getOfflineSyncService(): OfflineSyncService {
  if (!syncService) {
    syncService = new OfflineSyncService();
  }
  return syncService;
}

export type { SyncAction, CacheMetadata };
