import { eq, and, or, desc, asc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { createPool } from "mysql2";
import type { Pool, PoolOptions } from "mysql2/promise";
import {
  users,
  trips,
  itineraryItems,
  documents,
  messages,
  packingItems,
  bookings,
  destinationGuides,
  travelAlerts,
  notifications,
  pushSubscriptions,
  inviteTokens,
  InsertUser,
  Trip,
  ItineraryItem,
  Document,
  Message,
  PackingItem,
  Booking,
  DestinationGuide,
  TravelAlert,
  Notification,
  InsertNotification,
  PushSubscription,
  InviteToken,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let pool: Pool | null = null;
let _db: ReturnType<typeof drizzle> | null = null;

function getPool(): Pool | null {
  if (pool) return pool;

  if (!ENV.databaseUrl) {
    console.error("[Database] DATABASE_URL is missing; skipping pool creation");
    return null;
  }

  try {
    const options: PoolOptions | string = ENV.databaseUrl;
    pool = createPool(options).promise();
  } catch (error) {
    console.error("[Database] Failed to create pool:", error);
    pool = null;
  }

  return pool;
}

export async function getDb() {
  if (_db) return _db;

  const activePool = getPool();
  if (!activePool) return null;

  try {
    // Cast to align mysql2 promise pool type with drizzle's expected signature
    _db = drizzle(activePool as any);
  } catch (error) {
    console.warn("[Database] Failed to initialize drizzle:", error);
    _db = null;
  }

  return _db;
}

export async function pingDatabase(): Promise<boolean> {
  const activePool = getPool();
  if (!activePool) return false;

  try {
    await activePool.query("SELECT 1");
    return true;
  } catch (error) {
    console.warn("[Database] Ping failed:", error);
    return false;
  }
}

// ─── Users ──────────────────────────────────────────────────────────────────

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];
    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };
    textFields.forEach(assignNullable);
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0)
      updateSet.lastSignedIn = new Date();
    await db
      .insert(users)
      .values(values)
      .onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return await db.select().from(users).orderBy(desc(users.createdAt));
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateUserProfile(
  id: number,
  data: Partial<{
    name: string;
    phone: string;
    emergencyContactName: string;
    emergencyContactPhone: string;
    emergencyContactRelation: string;
  }>
) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set(data).where(eq(users.id, id));
  return { success: true };
}

// ─── Trips ───────────────────────────────────────────────────────────────────

export async function getTrips(userId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (userId) {
    return await db
      .select()
      .from(trips)
      .where(eq(trips.userId, userId))
      .orderBy(desc(trips.startDate));
  }
  return await db.select().from(trips).orderBy(desc(trips.startDate));
}

export async function getTripById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(trips).where(eq(trips.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createTrip(
  data: Omit<Trip, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(trips).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
}

export async function updateTrip(
  id: number,
  data: Partial<Omit<Trip, "id" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(trips).set(data).where(eq(trips.id, id));
  return { success: true };
}

export async function deleteTrip(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(trips).where(eq(trips.id, id));
  return { success: true };
}

// ─── Itinerary Items ──────────────────────────────────────────────────────────

export async function getItineraryItems(tripId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(itineraryItems)
    .where(eq(itineraryItems.tripId, tripId))
    .orderBy(asc(itineraryItems.dayNumber), asc(itineraryItems.sortOrder));
}

export async function createItineraryItem(
  data: Omit<ItineraryItem, "id" | "createdAt">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(itineraryItems).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
}

export async function updateItineraryItem(
  id: number,
  data: Partial<Omit<ItineraryItem, "id" | "createdAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(itineraryItems).set(data).where(eq(itineraryItems.id, id));
  return { success: true };
}

export async function deleteItineraryItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(itineraryItems).where(eq(itineraryItems.id, id));
  return { success: true };
}

// ─── Documents ───────────────────────────────────────────────────────────────

export async function getDocuments(userId?: number, tripId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (userId && tripId) {
    return await db
      .select()
      .from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.tripId, tripId)))
      .orderBy(desc(documents.createdAt));
  }
  if (userId) {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.userId, userId))
      .orderBy(desc(documents.createdAt));
  }
  if (tripId) {
    return await db
      .select()
      .from(documents)
      .where(eq(documents.tripId, tripId))
      .orderBy(desc(documents.createdAt));
  }
  return await db.select().from(documents).orderBy(desc(documents.createdAt));
}

export async function createDocument(data: Omit<Document, "id" | "createdAt">) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(documents).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
}

export async function deleteDocument(
  id: number,
  userId: number,
  isAdmin: boolean
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  if (isAdmin) {
    await db.delete(documents).where(eq(documents.id, id));
  } else {
    await db
      .delete(documents)
      .where(and(eq(documents.id, id), eq(documents.userId, userId)));
  }
  return { success: true };
}

// ─── Messages ────────────────────────────────────────────────────────────────

export async function getMessages(
  userId: number,
  otherUserId?: number,
  tripId?: number
) {
  const db = await getDb();
  if (!db) return [];
  if (otherUserId) {
    return await db
      .select()
      .from(messages)
      .where(
        or(
          and(
            eq(messages.fromUserId, userId),
            eq(messages.toUserId, otherUserId)
          ),
          and(
            eq(messages.fromUserId, otherUserId),
            eq(messages.toUserId, userId)
          )
        )
      )
      .orderBy(asc(messages.createdAt));
  }
  return await db
    .select()
    .from(messages)
    .where(or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId)))
    .orderBy(desc(messages.createdAt));
}

export async function createMessage(
  data: Omit<Message, "id" | "createdAt" | "isRead">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(messages).values({ ...data, isRead: false });
  return {
    id: Number((result as any)[0]?.insertId ?? 0),
    ...data,
    isRead: false,
  };
}

export async function markMessagesRead(toUserId: number, fromUserId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(messages)
    .set({ isRead: true })
    .where(
      and(eq(messages.toUserId, toUserId), eq(messages.fromUserId, fromUserId))
    );
  return { success: true };
}

/**
 * Get conversation threads.
 * For admin: returns all unique users who have sent/received messages.
 * For client: returns their thread with the admin.
 */
export async function getMessageThreads(userId: number, isAdmin: boolean) {
  const db = await getDb();
  if (!db) return [];

  // Get all messages involving this user
  const allMessages = await db
    .select()
    .from(messages)
    .where(or(eq(messages.fromUserId, userId), eq(messages.toUserId, userId)))
    .orderBy(desc(messages.createdAt));

  if (!isAdmin) {
    // Client: just return their messages (single thread with Jessica)
    return allMessages;
  }

  // Admin: group by the other party, return latest message per thread
  const threadMap = new Map<
    number,
    (typeof allMessages)[0] & {
      unreadCount: number;
      otherUser?: typeof users.$inferSelect;
    }
  >();
  for (const msg of allMessages) {
    const otherId = msg.fromUserId === userId ? msg.toUserId : msg.fromUserId;
    if (!threadMap.has(otherId)) {
      threadMap.set(otherId, { ...msg, unreadCount: 0 });
    }
    // Count unread messages TO admin FROM this user
    if (msg.toUserId === userId && !msg.isRead) {
      const existing = threadMap.get(otherId)!;
      existing.unreadCount = (existing.unreadCount ?? 0) + 1;
    }
  }

  // Enrich with user info
  const threads = [];
  for (const [otherId, latestMsg] of Array.from(threadMap.entries())) {
    const otherUser = await getUserById(otherId);
    threads.push({ ...latestMsg, otherUser: otherUser ?? null });
  }

  return threads;
}

// ─── Packing Items ────────────────────────────────────────────────────────────

export async function getPackingItems(tripId: number, userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(packingItems)
    .where(
      and(eq(packingItems.tripId, tripId), eq(packingItems.userId, userId))
    )
    .orderBy(asc(packingItems.sortOrder), asc(packingItems.createdAt));
}

export async function createPackingItem(
  data: Omit<PackingItem, "id" | "createdAt" | "isPacked">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db
    .insert(packingItems)
    .values({ ...data, isPacked: false });
  return {
    id: Number((result as any)[0]?.insertId ?? 0),
    ...data,
    isPacked: false,
  };
}

export async function updatePackingItem(
  id: number,
  data: Partial<
    Pick<PackingItem, "isPacked" | "item" | "category" | "quantity" | "notes">
  >
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(packingItems).set(data).where(eq(packingItems.id, id));
  return { success: true };
}

export async function deletePackingItem(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(packingItems).where(eq(packingItems.id, id));
  return { success: true };
}

// ─── Bookings ─────────────────────────────────────────────────────────────────

export async function getBookings(tripId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(bookings)
    .where(eq(bookings.tripId, tripId))
    .orderBy(asc(bookings.checkIn));
}

export async function createBooking(
  data: Omit<Booking, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(bookings).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
}

export async function updateBooking(
  id: number,
  data: Partial<Omit<Booking, "id" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.update(bookings).set(data).where(eq(bookings.id, id));
  return { success: true };
}

export async function deleteBooking(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db.delete(bookings).where(eq(bookings.id, id));
  return { success: true };
}

// ─── Destination Guides ───────────────────────────────────────────────────────

export async function getDestinationGuides() {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(destinationGuides)
    .orderBy(asc(destinationGuides.destination));
}

export async function getDestinationGuideByDestination(destination: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(destinationGuides)
    .where(eq(destinationGuides.destination, destination))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createDestinationGuide(
  data: Omit<DestinationGuide, "id" | "createdAt" | "updatedAt">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(destinationGuides).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
}

export async function updateDestinationGuide(
  id: number,
  data: Partial<Omit<DestinationGuide, "id" | "createdAt" | "updatedAt">>
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(destinationGuides)
    .set(data)
    .where(eq(destinationGuides.id, id));
  return { success: true };
}

// ─── Travel Alerts ────────────────────────────────────────────────────────────

export async function getTravelAlerts(userId: number, tripId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (tripId) {
    return await db
      .select()
      .from(travelAlerts)
      .where(
        and(eq(travelAlerts.userId, userId), eq(travelAlerts.tripId, tripId))
      )
      .orderBy(desc(travelAlerts.createdAt));
  }
  return await db
    .select()
    .from(travelAlerts)
    .where(eq(travelAlerts.userId, userId))
    .orderBy(desc(travelAlerts.createdAt));
}

export async function markAlertRead(id: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(travelAlerts)
    .set({ isRead: true })
    .where(eq(travelAlerts.id, id));
  return { success: true };
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function createNotification(data: InsertNotification) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const result = await db.insert(notifications).values(data);
  return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
}

export async function getNotifications(userId: number, limit = 50) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, userId))
    .orderBy(desc(notifications.createdAt))
    .limit(limit);
}

export async function getUnreadNotificationCount(userId: number) {
  const db = await getDb();
  if (!db) return 0;
  const result = await db
    .select()
    .from(notifications)
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );
  return result.length;
}

export async function markNotificationRead(id: number, userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(and(eq(notifications.id, id), eq(notifications.userId, userId)));
  return { success: true };
}

export async function markAllNotificationsRead(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(eq(notifications.userId, userId), eq(notifications.isRead, false))
    );
  return { success: true };
}

export async function broadcastNotification(
  data: Omit<InsertNotification, "userId">
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const allClients = await db
    .select()
    .from(users)
    .where(eq(users.role, "user"));
  if (allClients.length === 0) return { count: 0 };
  await db
    .insert(notifications)
    .values(allClients.map(u => ({ ...data, userId: u.id })));
  return { count: allClients.length };
}

// ─── Push Subscriptions ───────────────────────────────────────────────────────

export async function savePushSubscription(
  userId: number,
  endpoint: string,
  p256dh: string,
  auth: string,
  userAgent?: string
) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  // Upsert by endpoint
  const existing = await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint))
    .limit(1);
  if (existing.length > 0) {
    await db
      .update(pushSubscriptions)
      .set({ userId, p256dh, auth, userAgent: userAgent ?? null })
      .where(eq(pushSubscriptions.endpoint, endpoint));
  } else {
    await db
      .insert(pushSubscriptions)
      .values({ userId, endpoint, p256dh, auth, userAgent: userAgent ?? null });
  }
  return { success: true };
}

export async function getPushSubscriptionsForUser(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(pushSubscriptions)
    .where(eq(pushSubscriptions.userId, userId));
}

export async function deletePushSubscription(endpoint: string) {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .delete(pushSubscriptions)
    .where(eq(pushSubscriptions.endpoint, endpoint));
  return { success: true };
}

// ─── Admin Stats ──────────────────────────────────────────────────────────────

export async function getAdminStats() {
  const db = await getDb();
  if (!db)
    return {
      totalClients: 0,
      activeTrips: 0,
      totalTrips: 0,
      unreadMessages: 0,
    };

  const [clientCount] = await db
    .select()
    .from(users)
    .where(eq(users.role, "user"));
  const allTrips = await db.select().from(trips);
  const activeTrips = allTrips.filter(
    t => t.status === "active" || t.status === "confirmed"
  );
  const unread = await db
    .select()
    .from(messages)
    .where(eq(messages.isRead, false));

  return {
    totalClients: (await db.select().from(users).where(eq(users.role, "user")))
      .length,
    activeTrips: activeTrips.length,
    totalTrips: allTrips.length,
    unreadMessages: unread.length,
  };
}

// ─── Invite Tokens ────────────────────────────────────────────────────────────
import crypto from "crypto";

export async function createInviteToken(
  email: string,
  name: string | null,
  tripId: number | null,
  createdByUserId: number
): Promise<InviteToken> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  await db.insert(inviteTokens).values({
    token,
    email,
    name: name ?? null,
    tripId: tripId ?? null,
    createdByUserId,
    expiresAt,
  });
  const [created] = await db
    .select()
    .from(inviteTokens)
    .where(eq(inviteTokens.token, token))
    .limit(1);
  return created;
}

export async function getInviteToken(
  token: string
): Promise<InviteToken | null> {
  const db = await getDb();
  if (!db) return null;
  const [row] = await db
    .select()
    .from(inviteTokens)
    .where(eq(inviteTokens.token, token))
    .limit(1);
  return row ?? null;
}

export async function markInviteTokenUsed(
  token: string,
  userId: number
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("DB unavailable");
  await db
    .update(inviteTokens)
    .set({ usedAt: new Date(), usedByUserId: userId })
    .where(eq(inviteTokens.token, token));
}

export async function getInviteTokensCreatedBy(
  adminId: number
): Promise<InviteToken[]> {
  const db = await getDb();
  if (!db) return [];
  return await db
    .select()
    .from(inviteTokens)
    .where(eq(inviteTokens.createdByUserId, adminId))
    .orderBy(desc(inviteTokens.createdAt));
}
