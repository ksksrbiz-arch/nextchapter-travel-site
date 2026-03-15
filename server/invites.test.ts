import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "jessica@nextchaptertravel.com",
    name: "Jessica Seiders",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

function createClientContext(): { ctx: TrpcContext } {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "client-user",
    email: "traveler@example.com",
    name: "Jane Traveler",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };
  const ctx: TrpcContext = {
    user,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

function createPublicContext(): { ctx: TrpcContext } {
  const ctx: TrpcContext = {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: () => {} } as TrpcContext["res"],
  };
  return { ctx };
}

describe("invites.create (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const { ctx } = createClientContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.invites.create({
        email: "test@example.com",
        origin: "https://example.com",
      })
    ).rejects.toThrow("Admin access required");
  });

  it("throws FORBIDDEN for unauthenticated users", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.invites.create({
        email: "test@example.com",
        origin: "https://example.com",
      })
    ).rejects.toThrow();
  });
});

describe("invites.validate (public)", () => {
  it("returns invalid for a non-existent token", async () => {
    const { ctx } = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.invites.validate({
      token: "nonexistent-token-xyz",
    });
    expect(result.valid).toBe(false);
    expect(result.reason).toBe("Token not found");
  });
});

describe("invites.list (admin only)", () => {
  it("throws FORBIDDEN for non-admin users", async () => {
    const { ctx } = createClientContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.invites.list()).rejects.toThrow(
      "Admin access required"
    );
  });
});

describe("invites.accept (protected)", () => {
  it("throws NOT_FOUND for a non-existent token", async () => {
    const { ctx } = createClientContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.invites.accept({ token: "nonexistent-token-abc" })
    ).rejects.toThrow();
  });
});
