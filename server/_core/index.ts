import "dotenv/config";
import express from "express";
import { createServer } from "http";
import net from "net";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { registerOAuthRoutes } from "./oauth";
import { appRouter } from "../routers";
import { createContext } from "./context";
import { serveStatic, setupVite } from "./vite";
import { getConnectedCount, registerSSEClient } from "../messageBroker";
import { pingDatabase } from "../db";
import { sdk } from "./sdk";
import { ENV, missingEnvVars } from "./env";
import { requestLogger, errorHandler } from "./logging";
import { getMetricsSnapshot, renderPrometheus } from "./metrics";

function isPortAvailable(port: number): Promise<boolean> {
  return new Promise(resolve => {
    const server = net.createServer();
    server.listen(port, () => {
      server.close(() => resolve(true));
    });
    server.on("error", () => resolve(false));
  });
}

async function findAvailablePort(startPort: number = 3000): Promise<number> {
  for (let port = startPort; port < startPort + 20; port++) {
    if (await isPortAvailable(port)) {
      return port;
    }
  }
  throw new Error(`No available port found starting from ${startPort}`);
}

async function startServer() {
  const app = express();
  const server = createServer(app);
  const startedAt = Date.now();

  const missingEnv = missingEnvVars();
  if (missingEnv.length > 0) {
    console.warn(`[Env] Missing required vars: ${missingEnv.join(", ")}`);
  }
  // Configure body parser with larger size limit for file uploads
  app.use(requestLogger());
  app.use(express.json({ limit: "50mb" }));
  app.use(express.urlencoded({ limit: "50mb", extended: true }));
  // OAuth callback under /api/oauth/callback
  registerOAuthRoutes(app);

  // Real-time messaging SSE endpoint
  app.get("/api/messages/stream", async (req, res) => {
    try {
      const user = await sdk.authenticateRequest(req);
      if (!user) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }

      // Set SSE headers
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache, no-transform");
      res.setHeader("Connection", "keep-alive");
      res.setHeader("X-Accel-Buffering", "no"); // Disable nginx buffering
      res.flushHeaders();

      // Register this connection
      const cleanup = registerSSEClient(user.id, res);

      // Keep-alive ping every 25s to prevent proxy timeouts
      const pingInterval = setInterval(() => {
        try {
          res.write('data: {"type":"ping"}\n\n');
          if (typeof (res as any).flush === "function") (res as any).flush();
        } catch {
          clearInterval(pingInterval);
        }
      }, 25000);

      // Cleanup on disconnect
      req.on("close", () => {
        clearInterval(pingInterval);
        cleanup();
      });

      req.on("error", () => {
        clearInterval(pingInterval);
        cleanup();
      });
    } catch {
      res.status(401).json({ error: "Unauthorized" });
    }
  });

  app.get("/api/health", async (_req, res) => {
    const dbHealthy = await pingDatabase();
    const envIssues = missingEnvVars();
    const status = dbHealthy ? "ok" : "degraded";

    res.status(dbHealthy ? 200 : 503).json({
      status,
      uptimeMs: Date.now() - startedAt,
      db: dbHealthy ? "ok" : "unavailable",
      sseClients: getConnectedCount(),
      env: envIssues,
    });
  });

  app.get("/api/metrics", (_req, res) => {
    if (ENV.metricsToken) {
      const headerToken =
        _req.headers["x-metrics-key"] ??
        _req.headers.authorization?.replace("Bearer ", "");
      if (headerToken !== ENV.metricsToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
    }

    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.json(getMetricsSnapshot());
  });

  app.get("/api/metrics/prom", (_req, res) => {
    if (ENV.metricsToken) {
      const headerToken =
        _req.headers["x-metrics-key"] ??
        _req.headers.authorization?.replace("Bearer ", "");
      if (headerToken !== ENV.metricsToken) {
        res.status(401).json({ error: "Unauthorized" });
        return;
      }
    }

    res.setHeader("Content-Type", "text/plain; version=0.0.4");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.send(renderPrometheus());
  });
  // tRPC API
  app.use(
    "/api/trpc",
    createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );
  // development mode uses Vite, production mode uses static files
  if (process.env.NODE_ENV === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  app.use(errorHandler);

  const preferredPort = parseInt(process.env.PORT || "3000");
  const port = await findAvailablePort(preferredPort);

  if (port !== preferredPort) {
    console.log(`Port ${preferredPort} is busy, using port ${port} instead`);
  }

  server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
