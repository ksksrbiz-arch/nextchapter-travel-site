import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  getTrips,
  getTripById,
  createTrip,
  updateTrip,
  deleteTrip,
  getItineraryItems,
  createItineraryItem,
  updateItineraryItem,
  deleteItineraryItem,
  getDocuments,
  createDocument,
  deleteDocument,
  getMessages,
  createMessage,
  markMessagesRead,
  getMessageThreads,
  getPackingItems,
  createPackingItem,
  updatePackingItem,
  deletePackingItem,
  getBookings,
  createBooking,
  updateBooking,
  deleteBooking,
  getDestinationGuides,
  getDestinationGuideByDestination,
  createDestinationGuide,
  updateDestinationGuide,
  getTravelAlerts,
  markAlertRead,
  createTravelAlert,
  getAllUsers,
  getUserById,
  updateUserProfile,
  getAdminStats,
  createNotification,
  getNotifications,
  getUnreadNotificationCount,
  markNotificationRead,
  markAllNotificationsRead,
  broadcastNotification,
  savePushSubscription,
  deletePushSubscription,
  createInviteToken,
  getInviteToken,
  markInviteTokenUsed,
  getInviteTokensCreatedBy,
  getIdentityWalletEntries,
  createIdentityWalletEntry,
  deleteIdentityWalletEntry,
  markIdentityWalletEntryVerified,
  getAccessibilityProfile,
  upsertAccessibilityProfile,
  recordClientEvent,
  getRecentClientEvents,
  createCollaborator,
  listCollaboratorsForTrip,
  getCollaboratorByToken,
  acceptCollaboratorInvite,
  revokeCollaborator,
} from "./db";
import {
  broadcastMessage,
  broadcastTyping,
  broadcastRead,
  broadcastFlightAlert,
} from "./messageBroker";
import { storagePut } from "./storage";
import { sendInviteEmail, notifyOwnerOfInquiry } from "./email";
import {
  generateItinerary,
  parseItineraryFromText,
  getPersonalizedSuggestions,
  chatbotQuery,
} from "./ai";
import { searchFlights, searchHotels, bookOffer } from "./gds";
import { nanoid } from "nanoid";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Admin access required",
    });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().optional(),
          phone: z.string().optional(),
          emergencyContactName: z.string().optional(),
          emergencyContactPhone: z.string().optional(),
          emergencyContactRelation: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await updateUserProfile(ctx.user.id, input);
      }),
  }),

  trips: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role === "admin") {
        return await getTrips(undefined); // admin sees all
      }
      return await getTrips(ctx.user.id);
    }),
    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const trip = await getTripById(input.id);
        if (!trip) throw new TRPCError({ code: "NOT_FOUND" });
        if (ctx.user.role !== "admin" && trip.userId !== ctx.user.id) {
          throw new TRPCError({ code: "FORBIDDEN" });
        }
        return trip;
      }),
    create: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          title: z.string(),
          destination: z.string(),
          coverImageUrl: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          status: z
            .enum(["planning", "confirmed", "active", "completed", "cancelled"])
            .optional(),
          notes: z.string().optional(),
          confirmationCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createTrip({
          userId: input.userId,
          title: input.title,
          destination: input.destination,
          coverImageUrl: input.coverImageUrl ?? null,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          status: input.status ?? "planning",
          notes: input.notes ?? null,
          confirmationCode: input.confirmationCode ?? null,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          title: z.string().optional(),
          destination: z.string().optional(),
          coverImageUrl: z.string().optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          status: z
            .enum(["planning", "confirmed", "active", "completed", "cancelled"])
            .optional(),
          notes: z.string().optional(),
          confirmationCode: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateTrip(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteTrip(input.id);
      }),
  }),

  itinerary: router({
    list: protectedProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ input }) => {
        return await getItineraryItems(input.tripId);
      }),
    create: adminProcedure
      .input(
        z.object({
          tripId: z.number(),
          dayNumber: z.number(),
          date: z.date().optional(),
          time: z.string().optional(),
          title: z.string(),
          description: z.string().optional(),
          location: z.string().optional(),
          category: z
            .enum([
              "flight",
              "hotel",
              "activity",
              "dining",
              "transport",
              "free_time",
              "other",
            ])
            .optional(),
          confirmationNumber: z.string().optional(),
          notes: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createItineraryItem({
          tripId: input.tripId,
          dayNumber: input.dayNumber,
          date: input.date ?? null,
          time: input.time ?? null,
          title: input.title,
          description: input.description ?? null,
          location: input.location ?? null,
          category: input.category ?? "other",
          confirmationNumber: input.confirmationNumber ?? null,
          notes: input.notes ?? null,
          sortOrder: input.sortOrder ?? 0,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          time: z.string().optional(),
          title: z.string().optional(),
          description: z.string().optional(),
          location: z.string().optional(),
          category: z
            .enum([
              "flight",
              "hotel",
              "activity",
              "dining",
              "transport",
              "free_time",
              "other",
            ])
            .optional(),
          confirmationNumber: z.string().optional(),
          notes: z.string().optional(),
          sortOrder: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateItineraryItem(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteItineraryItem(input.id);
      }),
  }),

  documents: router({
    list: protectedProcedure
      .input(z.object({ tripId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        const userId = ctx.user.role === "admin" ? undefined : ctx.user.id;
        return await getDocuments(userId, input.tripId);
      }),
    create: protectedProcedure
      .input(
        z.object({
          tripId: z.number().optional(),
          name: z.string(),
          type: z.enum([
            "passport",
            "boarding_pass",
            "hotel_confirmation",
            "tour_confirmation",
            "travel_insurance",
            "visa",
            "other",
          ]),
          fileUrl: z.string(),
          fileKey: z.string(),
          mimeType: z.string().optional(),
          fileSize: z.number().optional(),
          expiryDate: z.date().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createDocument({
          userId: ctx.user.id,
          tripId: input.tripId ?? null,
          name: input.name,
          type: input.type,
          fileUrl: input.fileUrl,
          fileKey: input.fileKey,
          mimeType: input.mimeType ?? null,
          fileSize: input.fileSize ?? null,
          expiryDate: input.expiryDate ?? null,
          notes: input.notes ?? null,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await deleteDocument(
          input.id,
          ctx.user.id,
          ctx.user.role === "admin"
        );
      }),
  }),

  messages: router({
    uploadAttachment: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          mimeType: z.string(),
          base64Data: z.string(), // base64-encoded file content
          fileSize: z
            .number()
            .max(16 * 1024 * 1024, "File too large (max 16MB)"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const allowedTypes = [
          "image/jpeg",
          "image/png",
          "image/gif",
          "image/webp",
          "image/heic",
          "application/pdf",
          "application/msword",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "text/plain",
        ];
        if (!allowedTypes.includes(input.mimeType)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "File type not allowed",
          });
        }
        const suffix = Math.random().toString(36).slice(2, 8);
        const safeFileName = input.fileName.replace(/[^a-zA-Z0-9._-]/g, "_");
        const key = `chat-attachments/${ctx.user.id}/${Date.now()}-${suffix}-${safeFileName}`;
        const buffer = Buffer.from(input.base64Data, "base64");
        const { url } = await storagePut(key, buffer, input.mimeType);
        return {
          url,
          key,
          fileName: input.fileName,
          mimeType: input.mimeType,
          fileSize: input.fileSize,
        };
      }),
    list: protectedProcedure
      .input(
        z.object({
          otherUserId: z.number().optional(),
          tripId: z.number().optional(),
        })
      )
      .query(async ({ ctx, input }) => {
        return await getMessages(ctx.user.id, input.otherUserId, input.tripId);
      }),
    send: protectedProcedure
      .input(
        z.object({
          toUserId: z.number(),
          tripId: z.number().optional(),
          content: z.string().min(1).max(4000),
          attachmentUrl: z.string().optional(),
          attachmentName: z.string().optional(),
          attachmentType: z.string().optional(),
          attachmentSize: z.number().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const msg = await createMessage({
          fromUserId: ctx.user.id,
          toUserId: input.toUserId,
          content: input.content,
          tripId: input.tripId ?? null,
          attachmentUrl: input.attachmentUrl ?? null,
          attachmentName: input.attachmentName ?? null,
          attachmentType: input.attachmentType ?? null,
          attachmentSize: input.attachmentSize ?? null,
        });
        // Broadcast to both sender and receiver via SSE
        broadcastMessage({
          id: msg.id,
          fromUserId: ctx.user.id,
          toUserId: input.toUserId,
          content: input.content,
          tripId: input.tripId ?? null,
          attachmentUrl: input.attachmentUrl ?? null,
          attachmentName: input.attachmentName ?? null,
          attachmentType: input.attachmentType ?? null,
          attachmentSize: input.attachmentSize ?? null,
          isRead: false,
          createdAt: (msg as any).createdAt ?? new Date(),
        });
        return msg;
      }),
    markRead: protectedProcedure
      .input(z.object({ fromUserId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const result = await markMessagesRead(ctx.user.id, input.fromUserId);
        // Notify the original sender that their messages were read
        broadcastRead({ byUserId: ctx.user.id, fromUserId: input.fromUserId });
        return result;
      }),
    typing: protectedProcedure
      .input(
        z.object({
          toUserId: z.number(),
          isTyping: z.boolean(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        broadcastTyping({
          fromUserId: ctx.user.id,
          toUserId: input.toUserId,
          isTyping: input.isTyping,
        });
        return { ok: true };
      }),
    threads: protectedProcedure.query(async ({ ctx }) => {
      // Admin: get all unique conversation threads
      // Client: get their thread with Jessica (admin)
      return await getMessageThreads(ctx.user.id, ctx.user.role === "admin");
    }),
  }),

  packing: router({
    list: protectedProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ ctx, input }) => {
        return await getPackingItems(input.tripId, ctx.user.id);
      }),
    create: protectedProcedure
      .input(
        z.object({
          tripId: z.number(),
          category: z.string().optional(),
          item: z.string(),
          quantity: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await createPackingItem({
          tripId: input.tripId,
          userId: ctx.user.id,
          category: input.category ?? null,
          item: input.item,
          quantity: input.quantity ?? 1,
          notes: input.notes ?? null,
          sortOrder: 0,
        });
      }),
    toggle: protectedProcedure
      .input(z.object({ id: z.number(), isPacked: z.boolean() }))
      .mutation(async ({ input }) => {
        return await updatePackingItem(input.id, { isPacked: input.isPacked });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deletePackingItem(input.id);
      }),
  }),

  bookings: router({
    list: protectedProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ input }) => {
        return await getBookings(input.tripId);
      }),
    create: adminProcedure
      .input(
        z.object({
          tripId: z.number(),
          userId: z.number(),
          type: z.enum([
            "flight",
            "hotel",
            "cruise",
            "tour",
            "car_rental",
            "transfer",
            "other",
          ]),
          vendor: z.string().optional(),
          confirmationNumber: z.string().optional(),
          status: z
            .enum(["pending", "confirmed", "cancelled", "waitlisted"])
            .optional(),
          checkIn: z.date().optional(),
          checkOut: z.date().optional(),
          amount: z.number().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createBooking({
          tripId: input.tripId,
          userId: input.userId,
          type: input.type,
          vendor: input.vendor ?? null,
          confirmationNumber: input.confirmationNumber ?? null,
          status: input.status ?? "pending",
          checkIn: input.checkIn ?? null,
          checkOut: input.checkOut ?? null,
          amount: input.amount ?? null,
          currency: "USD",
          notes: input.notes ?? null,
          documentUrl: null,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          status: z
            .enum(["pending", "confirmed", "cancelled", "waitlisted"])
            .optional(),
          confirmationNumber: z.string().optional(),
          notes: z.string().optional(),
          amount: z.number().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateBooking(id, data);
      }),
    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await deleteBooking(input.id);
      }),
  }),

  guides: router({
    list: publicProcedure.query(async () => {
      return await getDestinationGuides();
    }),
    getByDestination: publicProcedure
      .input(z.object({ destination: z.string() }))
      .query(async ({ input }) => {
        return await getDestinationGuideByDestination(input.destination);
      }),
    create: adminProcedure
      .input(
        z.object({
          destination: z.string(),
          country: z.string().optional(),
          heroImageUrl: z.string().optional(),
          overview: z.string().optional(),
          currency: z.string().optional(),
          language: z.string().optional(),
          timezone: z.string().optional(),
          bestTimeToVisit: z.string().optional(),
          weatherInfo: z.string().optional(),
          tipsJson: z.any().optional(),
          emergencyNumbers: z.any().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createDestinationGuide({
          destination: input.destination,
          country: input.country ?? null,
          heroImageUrl: input.heroImageUrl ?? null,
          overview: input.overview ?? null,
          currency: input.currency ?? null,
          language: input.language ?? null,
          timezone: input.timezone ?? null,
          bestTimeToVisit: input.bestTimeToVisit ?? null,
          weatherInfo: input.weatherInfo ?? null,
          tipsJson: input.tipsJson ?? null,
          emergencyNumbers: input.emergencyNumbers ?? null,
        });
      }),
    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          overview: z.string().optional(),
          currency: z.string().optional(),
          language: z.string().optional(),
          timezone: z.string().optional(),
          bestTimeToVisit: z.string().optional(),
          weatherInfo: z.string().optional(),
          tipsJson: z.any().optional(),
          emergencyNumbers: z.any().optional(),
          heroImageUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        return await updateDestinationGuide(id, data);
      }),
  }),

  alerts: router({
    list: protectedProcedure
      .input(z.object({ tripId: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await getTravelAlerts(ctx.user.id, input.tripId);
      }),
    markRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await markAlertRead(input.id);
      }),
    create: adminProcedure
      .input(
        z.object({
          tripId: z.number().optional(),
          userId: z.number().optional(),
          title: z.string(),
          content: z.string(),
          severity: z.enum(["info", "warning", "urgent"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { getDb } = await import("./db");
        const { travelAlerts } = await import("../drizzle/schema");
        const db = await getDb();
        if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });
        await db.insert(travelAlerts).values(input);
        return { success: true };
      }),
  }),

  notifications: router({
    list: protectedProcedure
      .input(z.object({ limit: z.number().optional() }))
      .query(async ({ ctx, input }) => {
        return await getNotifications(ctx.user.id, input.limit ?? 50);
      }),
    unreadCount: protectedProcedure.query(async ({ ctx }) => {
      return await getUnreadNotificationCount(ctx.user.id);
    }),
    markRead: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await markNotificationRead(input.id, ctx.user.id);
      }),
    markAllRead: protectedProcedure.mutation(async ({ ctx }) => {
      return await markAllNotificationsRead(ctx.user.id);
    }),
    // Admin: send to a specific user
    send: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          tripId: z.number().optional(),
          title: z.string(),
          body: z.string(),
          type: z
            .enum([
              "message",
              "itinerary",
              "document",
              "alert",
              "booking",
              "system",
            ])
            .optional(),
          channel: z.enum(["in_app", "email", "push", "all"]).optional(),
          actionUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await createNotification({
          userId: input.userId,
          tripId: input.tripId ?? null,
          title: input.title,
          body: input.body,
          type: input.type ?? "system",
          channel: input.channel ?? "in_app",
          actionUrl: input.actionUrl ?? null,
        });
      }),
    // Admin: broadcast to all clients
    broadcast: adminProcedure
      .input(
        z.object({
          title: z.string(),
          body: z.string(),
          type: z
            .enum([
              "message",
              "itinerary",
              "document",
              "alert",
              "booking",
              "system",
            ])
            .optional(),
          channel: z.enum(["in_app", "email", "push", "all"]).optional(),
          tripId: z.number().optional(),
          actionUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await broadcastNotification({
          tripId: input.tripId ?? null,
          title: input.title,
          body: input.body,
          type: input.type ?? "system",
          channel: input.channel ?? "in_app",
          actionUrl: input.actionUrl ?? null,
        });
      }),
  }),

  push: router({
    subscribe: protectedProcedure
      .input(
        z.object({
          endpoint: z.string(),
          p256dh: z.string(),
          auth: z.string(),
          userAgent: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await savePushSubscription(
          ctx.user.id,
          input.endpoint,
          input.p256dh,
          input.auth,
          input.userAgent
        );
      }),
    unsubscribe: protectedProcedure
      .input(z.object({ endpoint: z.string() }))
      .mutation(async ({ input }) => {
        return await deletePushSubscription(input.endpoint);
      }),
  }),

  admin: router({
    stats: adminProcedure.query(async () => {
      return await getAdminStats();
    }),
    clients: adminProcedure.query(async () => {
      return await getAllUsers();
    }),
    getClient: adminProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getUserById(input.id);
      }),
    getClientTrips: adminProcedure
      .input(z.object({ userId: z.number() }))
      .query(async ({ input }) => {
        return await getTrips(input.userId);
      }),
  }),
  invites: router({
    // Admin: create an invite link for a new client
    create: adminProcedure
      .input(
        z.object({
          email: z.string().email(),
          name: z.string().optional(),
          tripId: z.number().optional(),
          origin: z.string().url(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const invite = await createInviteToken(
          input.email,
          input.name ?? null,
          input.tripId ?? null,
          ctx.user.id
        );
        const inviteUrl = `${input.origin}/join?token=${invite.token}`;
        // Send branded invite email automatically
        let emailSent = false;
        let emailError: string | undefined;
        try {
          const emailResult = await sendInviteEmail({
            to: input.email,
            clientName: input.name ?? input.email,
            inviteUrl,
            expiresInDays: 7,
          });
          emailSent = emailResult.success;
          if (!emailResult.success)
            emailError = (emailResult as { error: string }).error;
        } catch (e) {
          emailError = e instanceof Error ? e.message : String(e);
        }
        return { invite, inviteUrl, emailSent, emailError };
      }),
    // Admin: list all invites they created
    list: adminProcedure.query(async ({ ctx }) => {
      return await getInviteTokensCreatedBy(ctx.user.id);
    }),
    // Public: validate a token (used on the join page)
    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const invite = await getInviteToken(input.token);
        if (!invite) return { valid: false, reason: "Token not found" };
        if (invite.usedAt)
          return { valid: false, reason: "This invite has already been used" };
        if (new Date() > invite.expiresAt)
          return { valid: false, reason: "This invite has expired" };
        return {
          valid: true,
          invite: {
            email: invite.email,
            name: invite.name,
            tripId: invite.tripId,
          },
        };
      }),
    // Protected: mark token as used after the user signs in
    accept: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const invite = await getInviteToken(input.token);
        if (!invite)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Invite not found",
          });
        if (invite.usedAt)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invite already used",
          });
        if (new Date() > invite.expiresAt)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Invite expired",
          });
        await markInviteTokenUsed(input.token, ctx.user.id);
        return { success: true };
      }),
  }),

  webhooks: router({
    // TravelJoy form submission webhook
    traveljoyInquiry: publicProcedure
      .input(
        z.object({
          name: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          destination: z.string().optional(),
          tripType: z.string().optional(),
          message: z.string().optional(),
          inquiryUrl: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await notifyOwnerOfInquiry({
            inquiryData: input,
            inquiryUrl: input.inquiryUrl,
          });
          return {
            success: result.success,
            id: result.success ? result.id : undefined,
          };
        } catch (err) {
          console.error("[webhooks.traveljoyInquiry] Error:", err);
          return {
            success: false,
            error: err instanceof Error ? err.message : "Unknown error",
          };
        }
      }),
  }),

  // ─── AI: Trip Genius, Import Wizard, Recommendations, Chatbot ────────────
  ai: router({
    generateItinerary: adminProcedure
      .input(
        z.object({
          destination: z.string().min(2),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          travelStyle: z.string().optional(),
          budgetTier: z.enum(["budget", "mid", "luxury"]).optional(),
          groupSize: z.number().int().positive().optional(),
          groupType: z.string().optional(),
          interests: z.array(z.string()).optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await generateItinerary({
          destination: input.destination,
          startDate: input.startDate ?? null,
          endDate: input.endDate ?? null,
          travelStyle: input.travelStyle,
          budgetTier: input.budgetTier,
          groupSize: input.groupSize,
          groupType: input.groupType,
          interests: input.interests,
          notes: input.notes,
        });
      }),
    parseItineraryFromText: adminProcedure
      .input(z.object({ text: z.string().min(1).max(60000) }))
      .mutation(async ({ input }) => {
        return await parseItineraryFromText(input.text);
      }),
    getPersonalizedSuggestions: protectedProcedure
      .input(
        z
          .object({
            destination: z.string().optional(),
            daysUntilTrip: z.number().int().nullable().optional(),
          })
          .optional()
      )
      .query(async ({ ctx, input }) => {
        const events = await getRecentClientEvents(ctx.user.id, 25);
        return await getPersonalizedSuggestions(
          events.map(e => ({ eventType: e.eventType, payload: e.payload })),
          {
            destination: input?.destination,
            daysUntilTrip: input?.daysUntilTrip ?? null,
          }
        );
      }),
    chatbot: protectedProcedure
      .input(
        z.object({
          question: z.string().min(1).max(2000),
          history: z
            .array(
              z.object({
                role: z.enum(["user", "assistant"]),
                content: z.string(),
              })
            )
            .optional(),
        })
      )
      .mutation(async ({ input }) => {
        return await chatbotQuery(input.question, input.history ?? []);
      }),
  }),

  // ─── Direct GDS (Sabre) integration — mock-backed for demo ────────────────
  gds: router({
    searchFlights: adminProcedure
      .input(
        z.object({
          origin: z.string().min(2).max(8),
          destination: z.string().min(2).max(8),
          departureDate: z.string(),
          returnDate: z.string().optional(),
          passengers: z.number().int().positive().optional(),
          cabin: z.enum(["economy", "premium", "business", "first"]).optional(),
        })
      )
      .query(async ({ input }) => {
        return await searchFlights(input);
      }),
    searchHotels: adminProcedure
      .input(
        z.object({
          city: z.string().min(2),
          checkIn: z.string(),
          checkOut: z.string(),
          guests: z.number().int().positive().optional(),
          ecoOnly: z.boolean().optional(),
        })
      )
      .query(async ({ input }) => {
        return await searchHotels(input);
      }),
    bookFlight: adminProcedure
      .input(
        z.object({
          offerId: z.string(),
          passengers: z.number().int().positive(),
        })
      )
      .mutation(async ({ input }) => {
        return await bookOffer({
          kind: "flight",
          offerId: input.offerId,
          passengers: input.passengers,
        });
      }),
    bookHotel: adminProcedure
      .input(
        z.object({
          offerId: z.string(),
          guests: z.number().int().positive(),
        })
      )
      .mutation(async ({ input }) => {
        return await bookOffer({
          kind: "hotel",
          offerId: input.offerId,
          guests: input.guests,
        });
      }),
  }),

  // ─── Identity Wallet (verified credentials & payment tokens) ─────────────
  identityWallet: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return await getIdentityWalletEntries(ctx.user.id);
    }),
    create: protectedProcedure
      .input(
        z.object({
          documentType: z.enum([
            "passport",
            "id_card",
            "drivers_license",
            "tsa_precheck",
            "global_entry",
            "loyalty_number",
            "payment_token",
            "other",
          ]),
          label: z.string().min(1).max(255),
          // Public-safe hint only — never raw card numbers
          maskedHint: z.string().max(64).optional(),
          // Token reference from a PCI-compliant vault (e.g. Stripe pm_…)
          tokenRef: z.string().max(512).optional(),
          expiryDate: z.date().optional(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        // Reject anything that looks like a raw PAN
        if (input.tokenRef && /\b\d{12,19}\b/.test(input.tokenRef)) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message:
              "Raw card numbers are not allowed. Provide a tokenized reference instead.",
          });
        }
        return await createIdentityWalletEntry({
          userId: ctx.user.id,
          documentType: input.documentType,
          label: input.label,
          maskedHint: input.maskedHint ?? null,
          tokenRef: input.tokenRef ?? null,
          expiryDate: input.expiryDate ?? null,
          metadata: input.metadata ?? null,
        });
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await deleteIdentityWalletEntry(input.id, ctx.user.id);
      }),
    markVerified: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return await markIdentityWalletEntryVerified(input.id, ctx.user.id);
      }),
  }),

  // ─── Accessibility profile ───────────────────────────────────────────────
  accessibility: router({
    get: protectedProcedure
      .input(z.object({ userId: z.number().optional() }).optional())
      .query(async ({ ctx, input }) => {
        // Admins can fetch any profile; clients can only fetch their own
        const targetId =
          ctx.user.role === "admin" && input?.userId
            ? input.userId
            : ctx.user.id;
        return await getAccessibilityProfile(targetId);
      }),
    upsert: protectedProcedure
      .input(
        z.object({
          mobilityNeeds: z.array(z.string()).optional(),
          neurodivergentNeeds: z.array(z.string()).optional(),
          medicalNeeds: z.array(z.string()).optional(),
          dietaryRestrictions: z.array(z.string()).optional(),
          serviceAnimal: z.boolean().optional(),
          notes: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await upsertAccessibilityProfile({
          userId: ctx.user.id,
          mobilityNeeds: input.mobilityNeeds ?? null,
          neurodivergentNeeds: input.neurodivergentNeeds ?? null,
          medicalNeeds: input.medicalNeeds ?? null,
          dietaryRestrictions: input.dietaryRestrictions ?? null,
          serviceAnimal: input.serviceAnimal ?? false,
          notes: input.notes ?? null,
        });
      }),
  }),

  // ─── Behavior-tracking events ────────────────────────────────────────────
  events: router({
    record: protectedProcedure
      .input(
        z.object({
          eventType: z.string().min(1).max(64),
          payload: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return await recordClientEvent({
          userId: ctx.user.id,
          eventType: input.eventType,
          payload: input.payload ?? null,
        });
      }),
    listMine: protectedProcedure
      .input(z.object({ limit: z.number().int().positive().max(200).optional() }).optional())
      .query(async ({ ctx, input }) => {
        return await getRecentClientEvents(ctx.user.id, input?.limit ?? 50);
      }),
  }),

  // ─── Collaborator network (tour operators co-editing trips) ──────────────
  collaborators: router({
    invite: adminProcedure
      .input(
        z.object({
          tripId: z.number(),
          email: z.string().email(),
          name: z.string().optional(),
          role: z.enum(["viewer", "editor"]).optional(),
          expiresInDays: z.number().int().positive().max(60).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const expiresAt = new Date(
          Date.now() + (input.expiresInDays ?? 14) * 24 * 60 * 60 * 1000
        );
        const token = nanoid(32);
        const created = await createCollaborator({
          tripId: input.tripId,
          email: input.email,
          name: input.name ?? null,
          role: input.role ?? "viewer",
          token,
          expiresAt,
          invitedByUserId: ctx.user.id,
        });
        return created;
      }),
    list: adminProcedure
      .input(z.object({ tripId: z.number() }))
      .query(async ({ input }) => {
        return await listCollaboratorsForTrip(input.tripId);
      }),
    validate: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const c = await getCollaboratorByToken(input.token);
        if (!c) return { valid: false, reason: "Token not found" };
        if (new Date() > c.expiresAt)
          return { valid: false, reason: "This invite has expired" };
        return {
          valid: true,
          collaborator: {
            tripId: c.tripId,
            email: c.email,
            name: c.name,
            role: c.role,
            acceptedAt: c.acceptedAt,
          },
        };
      }),
    accept: protectedProcedure
      .input(z.object({ token: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const c = await getCollaboratorByToken(input.token);
        if (!c)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Collaborator invite not found",
          });
        if (new Date() > c.expiresAt)
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Collaborator invite expired",
          });
        await acceptCollaboratorInvite(input.token, ctx.user.id);
        return { success: true, tripId: c.tripId, role: c.role };
      }),
    revoke: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        return await revokeCollaborator(input.id);
      }),
  }),

  // ─── Real-time flight alerts (extends alerts router via SSE) ─────────────
  flightAlerts: router({
    sendUpdate: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          tripId: z.number().nullable().optional(),
          flightNumber: z.string().min(2).max(16),
          status: z.enum([
            "on_time",
            "delayed",
            "cancelled",
            "boarding",
            "departed",
            "arrived",
            "gate_change",
          ]),
          newDepartureIso: z.string().optional(),
          newArrivalIso: z.string().optional(),
          newGate: z.string().optional(),
          message: z.string().min(1).max(500),
          severity: z.enum(["info", "warning", "urgent"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        const severity = input.severity ?? "info";
        // Persist as a travel alert with a structured title
        const alert = await createTravelAlert({
          tripId: input.tripId ?? null,
          userId: input.userId,
          title: `Flight ${input.flightNumber}: ${input.status.replace("_", " ")}`,
          content: input.message,
          severity,
        });
        // Push via SSE
        broadcastFlightAlert({
          alertId: alert.id,
          userId: input.userId,
          tripId: input.tripId ?? null,
          flightNumber: input.flightNumber,
          status: input.status,
          newDepartureIso: input.newDepartureIso ?? null,
          newArrivalIso: input.newArrivalIso ?? null,
          newGate: input.newGate ?? null,
          message: input.message,
          severity,
          createdAt: new Date(),
        });
        return alert;
      }),
  }),
});

export type AppRouter = typeof appRouter;
