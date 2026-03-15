import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db module
vi.mock("./db", async importOriginal => {
  const actual = await importOriginal<typeof import("./db")>();
  return {
    ...actual,
    getNotifications: vi.fn().mockResolvedValue([
      {
        id: 1,
        userId: 1,
        tripId: null,
        title: "Test Notification",
        body: "This is a test",
        type: "system",
        channel: "in_app",
        isRead: false,
        actionUrl: null,
        sentAt: new Date(),
        createdAt: new Date(),
      },
    ]),
    getUnreadNotificationCount: vi.fn().mockResolvedValue(1),
    markNotificationRead: vi.fn().mockResolvedValue({ success: true }),
    markAllNotificationsRead: vi.fn().mockResolvedValue({ success: true }),
    createNotification: vi
      .fn()
      .mockResolvedValue({
        id: 2,
        userId: 2,
        title: "Hello",
        body: "World",
        type: "system",
        channel: "in_app",
      }),
    broadcastNotification: vi.fn().mockResolvedValue({ count: 3 }),
    savePushSubscription: vi.fn().mockResolvedValue({ success: true }),
    deletePushSubscription: vi.fn().mockResolvedValue({ success: true }),
    // Keep other db functions from original
    upsertUser: actual.upsertUser,
    getUserByOpenId: actual.getUserByOpenId,
  };
});

function makeUserCtx(role: "user" | "admin" = "user"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      name: "Test User",
      email: "test@example.com",
      loginMethod: "manus",
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("notifications router", () => {
  it("list returns notifications for the current user", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const result = await caller.notifications.list({});
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0]).toHaveProperty("title", "Test Notification");
  });

  it("unreadCount returns a number", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const count = await caller.notifications.unreadCount();
    expect(typeof count).toBe("number");
    expect(count).toBe(1);
  });

  it("markRead succeeds for authenticated user", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const result = await caller.notifications.markRead({ id: 1 });
    expect(result).toEqual({ success: true });
  });

  it("markAllRead succeeds for authenticated user", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const result = await caller.notifications.markAllRead();
    expect(result).toEqual({ success: true });
  });

  it("send requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx("user"));
    await expect(
      caller.notifications.send({ userId: 2, title: "Hi", body: "Hello" })
    ).rejects.toThrow();
  });

  it("admin can send notification to specific user", async () => {
    const caller = appRouter.createCaller(makeUserCtx("admin"));
    const result = await caller.notifications.send({
      userId: 2,
      title: "Hi",
      body: "Hello",
    });
    expect(result).toHaveProperty("id");
  });

  it("broadcast requires admin role", async () => {
    const caller = appRouter.createCaller(makeUserCtx("user"));
    await expect(
      caller.notifications.broadcast({ title: "All", body: "Everyone" })
    ).rejects.toThrow();
  });

  it("admin can broadcast to all clients", async () => {
    const caller = appRouter.createCaller(makeUserCtx("admin"));
    const result = await caller.notifications.broadcast({
      title: "All",
      body: "Everyone",
    });
    expect(result).toHaveProperty("count");
  });
});

describe("push router", () => {
  it("subscribe saves a push subscription", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const result = await caller.push.subscribe({
      endpoint: "https://push.example.com/sub/abc123",
      p256dh:
        "BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlTiESgX776I0w6skurHmImy9dN0lahaf4HEAyXA",
      auth: "tBHItJI5svbpez7KI4CCXg",
      userAgent: "Mozilla/5.0",
    });
    expect(result).toEqual({ success: true });
  });

  it("unsubscribe removes a push subscription", async () => {
    const caller = appRouter.createCaller(makeUserCtx());
    const result = await caller.push.unsubscribe({
      endpoint: "https://push.example.com/sub/abc123",
    });
    expect(result).toEqual({ success: true });
  });
});
