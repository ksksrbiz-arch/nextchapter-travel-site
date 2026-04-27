import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  boolean,
  json,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  phone: varchar("phone", { length: 32 }),
  avatarUrl: text("avatarUrl"),
  emergencyContactName: text("emergencyContactName"),
  emergencyContactPhone: varchar("emergencyContactPhone", { length: 32 }),
  emergencyContactRelation: varchar("emergencyContactRelation", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Trips — each client can have multiple trips managed by Jessica
export const trips = mysqlTable("trips", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  destination: varchar("destination", { length: 255 }).notNull(),
  coverImageUrl: text("coverImageUrl"),
  startDate: timestamp("startDate"),
  endDate: timestamp("endDate"),
  status: mysqlEnum("status", ["planning", "confirmed", "active", "completed", "cancelled"]).default("planning").notNull(),
  notes: text("notes"),
  confirmationCode: varchar("confirmationCode", { length: 64 }),
  // AI Trip Genius preferences (travel style, budget tier, group size, model hints)
  aiPreferences: json("aiPreferences"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Trip = typeof trips.$inferSelect;

// Itinerary items — day-by-day schedule for a trip
export const itineraryItems = mysqlTable("itinerary_items", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  dayNumber: int("dayNumber").notNull(),
  date: timestamp("date"),
  time: varchar("time", { length: 10 }),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  location: varchar("location", { length: 255 }),
  category: mysqlEnum("category", ["flight", "hotel", "activity", "dining", "transport", "free_time", "other"]).default("other").notNull(),
  confirmationNumber: varchar("confirmationNumber", { length: 128 }),
  notes: text("notes"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type ItineraryItem = typeof itineraryItems.$inferSelect;

// Documents — passport scans, boarding passes, confirmations
export const documents = mysqlTable("documents", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId"),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  type: mysqlEnum("type", ["passport", "boarding_pass", "hotel_confirmation", "tour_confirmation", "travel_insurance", "visa", "other"]).default("other").notNull(),
  fileUrl: text("fileUrl").notNull(),
  fileKey: text("fileKey").notNull(),
  mimeType: varchar("mimeType", { length: 128 }),
  fileSize: int("fileSize"),
  expiryDate: timestamp("expiryDate"),
  notes: text("notes"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Document = typeof documents.$inferSelect;

// Messages — in-app messaging between client and Jessica
export const messages = mysqlTable("messages", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId"),
  fromUserId: int("fromUserId").notNull(),
  toUserId: int("toUserId").notNull(),
  content: text("content").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  attachmentUrl: text("attachmentUrl"),
  attachmentName: varchar("attachmentName", { length: 255 }),
  attachmentType: varchar("attachmentType", { length: 128 }),
  attachmentSize: int("attachmentSize"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Message = typeof messages.$inferSelect;

// Packing items — checklist per trip
export const packingItems = mysqlTable("packing_items", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  userId: int("userId").notNull(),
  category: varchar("category", { length: 64 }).default("General"),
  item: varchar("item", { length: 255 }).notNull(),
  isPacked: boolean("isPacked").default(false).notNull(),
  quantity: int("quantity").default(1),
  notes: text("notes"),
  sortOrder: int("sortOrder").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PackingItem = typeof packingItems.$inferSelect;

// Bookings — flight, hotel, tour booking status tracker
export const bookings = mysqlTable("bookings", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  userId: int("userId").notNull(),
  type: mysqlEnum("type", ["flight", "hotel", "cruise", "tour", "car_rental", "transfer", "other"]).default("other").notNull(),
  vendor: varchar("vendor", { length: 255 }),
  confirmationNumber: varchar("confirmationNumber", { length: 128 }),
  status: mysqlEnum("status", ["pending", "confirmed", "cancelled", "waitlisted"]).default("pending").notNull(),
  checkIn: timestamp("checkIn"),
  checkOut: timestamp("checkOut"),
  amount: int("amount"),
  currency: varchar("currency", { length: 8 }).default("USD"),
  notes: text("notes"),
  documentUrl: text("documentUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Booking = typeof bookings.$inferSelect;

// Destination guides — curated tips per destination
export const destinationGuides = mysqlTable("destination_guides", {
  id: int("id").autoincrement().primaryKey(),
  destination: varchar("destination", { length: 255 }).notNull(),
  country: varchar("country", { length: 128 }),
  heroImageUrl: text("heroImageUrl"),
  overview: text("overview"),
  currency: varchar("currency", { length: 32 }),
  language: varchar("language", { length: 64 }),
  timezone: varchar("timezone", { length: 64 }),
  bestTimeToVisit: text("bestTimeToVisit"),
  weatherInfo: text("weatherInfo"),
  tipsJson: json("tipsJson"),
  emergencyNumbers: json("emergencyNumbers"),
  // Social-inspired trending tags (Instagram reel ids, TikTok trends, etc.)
  trendingTags: json("trendingTags"),
  // Optional 360 / Matterport tour URL for VR previews
  vrTourUrl: text("vrTourUrl"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DestinationGuide = typeof destinationGuides.$inferSelect;

// Alerts — travel alerts and notifications per trip
export const travelAlerts = mysqlTable("travel_alerts", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId"),
  userId: int("userId"),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content").notNull(),
  severity: mysqlEnum("severity", ["info", "warning", "urgent"]).default("info").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type TravelAlert = typeof travelAlerts.$inferSelect;

// Notifications — multi-channel notification system
export const notifications = mysqlTable("notifications", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  tripId: int("tripId"),
  title: varchar("title", { length: 255 }).notNull(),
  body: text("body").notNull(),
  type: mysqlEnum("type", ["message", "itinerary", "document", "alert", "booking", "system"]).default("system").notNull(),
  channel: mysqlEnum("channel", ["in_app", "email", "push", "all"]).default("in_app").notNull(),
  isRead: boolean("isRead").default(false).notNull(),
  actionUrl: varchar("actionUrl", { length: 512 }),
  sentAt: timestamp("sentAt").defaultNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;

// Push subscriptions — browser push notification endpoints
export const pushSubscriptions = mysqlTable("push_subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  endpoint: text("endpoint").notNull(),
  p256dh: text("p256dh").notNull(),
  auth: text("auth").notNull(),
  userAgent: text("userAgent"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PushSubscription = typeof pushSubscriptions.$inferSelect;

// Client invite tokens — magic links for onboarding new clients
export const inviteTokens = mysqlTable("invite_tokens", {
  id: int("id").autoincrement().primaryKey(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  tripId: int("tripId"),
  createdByUserId: int("createdByUserId").notNull(),
  usedAt: timestamp("usedAt"),
  usedByUserId: int("usedByUserId"),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type InviteToken = typeof inviteTokens.$inferSelect;
export type InsertInviteToken = typeof inviteTokens.$inferInsert;

// Identity wallet — verified credentials & payment-method tokens (never raw PANs)
export const identityWallet = mysqlTable("identity_wallet", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  documentType: mysqlEnum("documentType", [
    "passport",
    "id_card",
    "drivers_license",
    "tsa_precheck",
    "global_entry",
    "loyalty_number",
    "payment_token",
    "other",
  ]).default("other").notNull(),
  label: varchar("label", { length: 255 }).notNull(),
  // Token / encrypted reference; we never store raw card numbers
  tokenRef: text("tokenRef"),
  // Last 4 digits / public-safe hint (e.g. "•••• 4242", "P 1234")
  maskedHint: varchar("maskedHint", { length: 64 }),
  expiryDate: timestamp("expiryDate"),
  verifiedAt: timestamp("verifiedAt"),
  metadata: json("metadata"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});
export type IdentityWalletEntry = typeof identityWallet.$inferSelect;
export type InsertIdentityWalletEntry = typeof identityWallet.$inferInsert;

// Accessibility profiles — mobility, neurodivergent, medical needs per traveler
export const accessibilityProfiles = mysqlTable("accessibility_profiles", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull().unique(),
  mobilityNeeds: json("mobilityNeeds"),
  neurodivergentNeeds: json("neurodivergentNeeds"),
  medicalNeeds: json("medicalNeeds"),
  dietaryRestrictions: json("dietaryRestrictions"),
  serviceAnimal: boolean("serviceAnimal").default(false).notNull(),
  notes: text("notes"),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type AccessibilityProfile = typeof accessibilityProfiles.$inferSelect;
export type InsertAccessibilityProfile = typeof accessibilityProfiles.$inferInsert;

// Client events — behavior-driven recommendation telemetry
export const clientEvents = mysqlTable("client_events", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("userId").notNull(),
  eventType: varchar("eventType", { length: 64 }).notNull(),
  // Free-form payload: route visited, search terms, filters, etc.
  payload: json("payload"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type ClientEvent = typeof clientEvents.$inferSelect;
export type InsertClientEvent = typeof clientEvents.$inferInsert;

// Collaborators — tour operators / DMCs invited to co-edit a trip
export const collaborators = mysqlTable("collaborators", {
  id: int("id").autoincrement().primaryKey(),
  tripId: int("tripId").notNull(),
  email: varchar("email", { length: 320 }).notNull(),
  name: varchar("name", { length: 255 }),
  role: mysqlEnum("role", ["viewer", "editor"]).default("viewer").notNull(),
  token: varchar("token", { length: 128 }).notNull().unique(),
  acceptedAt: timestamp("acceptedAt"),
  acceptedByUserId: int("acceptedByUserId"),
  expiresAt: timestamp("expiresAt").notNull(),
  invitedByUserId: int("invitedByUserId").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});
export type Collaborator = typeof collaborators.$inferSelect;
export type InsertCollaborator = typeof collaborators.$inferInsert;
