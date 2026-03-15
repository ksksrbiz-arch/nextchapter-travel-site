import type { NextFunction, Request, Response } from "express";
import { nanoid } from "nanoid";
import { recordRequest } from "./metrics";

type LogLevel = "info" | "warn" | "error";

type LogMeta = Record<string, unknown>;

function log(level: LogLevel, message: string, meta: LogMeta = {}): void {
  const payload = {
    level,
    message,
    timestamp: new Date().toISOString(),
    ...meta,
  };

  if (level === "error") {
    console.error(JSON.stringify(payload));
  } else if (level === "warn") {
    console.warn(JSON.stringify(payload));
  } else {
    console.log(JSON.stringify(payload));
  }
}

export function requestLogger() {
  return (req: Request, res: Response, next: NextFunction) => {
    const incomingId = req.headers["x-request-id"];
    const requestId = typeof incomingId === "string" ? incomingId : nanoid(12);
    const start = Date.now();

    (req as any).requestId = requestId;
    res.setHeader("X-Request-Id", requestId);

    log("info", "req.start", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      ip: req.ip,
    });

    res.on("finish", () => {
      const durationMs = Date.now() - start;
      log("info", "req.finish", {
        requestId,
        method: req.method,
        path: req.originalUrl,
        status: res.statusCode,
        durationMs,
        contentLength: res.getHeader("content-length") ?? null,
      });

      recordRequest(res.statusCode, durationMs);
    });

    res.on("close", () => {
      if (!res.writableEnded) {
        log("warn", "req.aborted", {
          requestId,
          method: req.method,
          path: req.originalUrl,
          durationMs: Date.now() - start,
        });
      }
    });

    next();
  };
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (res.headersSent) {
    return next(err);
  }

  const requestId = (req as any).requestId as string | undefined;
  const message = err instanceof Error ? err.message : String(err);
  const stack = err instanceof Error ? err.stack : undefined;

  log("error", "req.error", {
    requestId,
    method: req.method,
    path: req.originalUrl,
    status: 500,
    error: message,
    stack,
  });

  res.status(500).json({ error: "Internal Server Error", requestId });
}
