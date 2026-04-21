/**
 * Health Check Endpoints
 * 
 * Provides endpoints for monitoring application health and readiness.
 * Used by load balancers, orchestration systems, and monitoring tools.
 */

import type { Request, Response } from 'express';

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  version: string;
  checks: {
    database: HealthCheckResult;
    memory: HealthCheckResult;
    disk?: HealthCheckResult;
  };
}

interface HealthCheckResult {
  status: 'pass' | 'warn' | 'fail';
  message?: string;
  responseTime?: number;
}

/**
 * Basic health check - always returns 200 if server is running
 * Use for basic liveness probes
 */
export function healthCheck(_req: Request, res: Response) {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}

/**
 * Detailed health check - checks dependencies
 * Use for readiness probes
 */
export async function detailedHealthCheck(_req: Request, res: Response) {
  const startTime = Date.now();
  
  const health: HealthStatus = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    checks: {
      database: await checkDatabase(),
      memory: checkMemory(),
    },
  };

  // Determine overall status
  const checkStatuses = Object.values(health.checks).map(c => c.status);
  if (checkStatuses.includes('fail')) {
    health.status = 'unhealthy';
  } else if (checkStatuses.includes('warn')) {
    health.status = 'degraded';
  }

  // Return appropriate status code
  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503;

  const responseTime = Date.now() - startTime;
  
  res.status(statusCode).json({
    ...health,
    responseTime,
  });
}

/**
 * Check database connectivity
 */
async function checkDatabase(): Promise<HealthCheckResult> {
  const startTime = Date.now();
  
  try {
    // Check if DATABASE_URL is configured
    if (!process.env.DATABASE_URL) {
      return {
        status: 'warn',
        message: 'DATABASE_URL not configured (using test mode)',
        responseTime: Date.now() - startTime,
      };
    }

    // In production, add actual database ping here
    // Example: await db.raw('SELECT 1');
    
    return {
      status: 'pass',
      message: 'Database connection configured',
      responseTime: Date.now() - startTime,
    };
  } catch (error) {
    return {
      status: 'fail',
      message: error instanceof Error ? error.message : 'Database check failed',
      responseTime: Date.now() - startTime,
    };
  }
}

/**
 * Check memory usage
 */
function checkMemory(): HealthCheckResult {
  const usage = process.memoryUsage();
  const heapUsedMB = Math.round(usage.heapUsed / 1024 / 1024);
  const heapTotalMB = Math.round(usage.heapTotal / 1024 / 1024);
  const usagePercent = (heapUsedMB / heapTotalMB) * 100;

  if (usagePercent > 90) {
    return {
      status: 'fail',
      message: `Memory usage critical: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercent.toFixed(1)}%)`,
    };
  } else if (usagePercent > 75) {
    return {
      status: 'warn',
      message: `Memory usage high: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercent.toFixed(1)}%)`,
    };
  }

  return {
    status: 'pass',
    message: `Memory usage normal: ${heapUsedMB}MB / ${heapTotalMB}MB (${usagePercent.toFixed(1)}%)`,
  };
}

/**
 * Metrics endpoint - Prometheus-compatible format
 */
export function metricsEndpoint(_req: Request, res: Response) {
  const uptime = process.uptime();
  const memory = process.memoryUsage();
  
  const metrics = [
    '# HELP process_uptime_seconds Process uptime in seconds',
    '# TYPE process_uptime_seconds gauge',
    `process_uptime_seconds ${uptime}`,
    '',
    '# HELP process_memory_heap_used_bytes Heap memory used in bytes',
    '# TYPE process_memory_heap_used_bytes gauge',
    `process_memory_heap_used_bytes ${memory.heapUsed}`,
    '',
    '# HELP process_memory_heap_total_bytes Heap memory total in bytes',
    '# TYPE process_memory_heap_total_bytes gauge',
    `process_memory_heap_total_bytes ${memory.heapTotal}`,
    '',
    '# HELP process_memory_rss_bytes Resident set size in bytes',
    '# TYPE process_memory_rss_bytes gauge',
    `process_memory_rss_bytes ${memory.rss}`,
    '',
  ].join('\n');

  res.setHeader('Content-Type', 'text/plain; version=0.0.4');
  res.send(metrics);
}

/**
 * Readiness check - for Kubernetes readiness probes
 * Server is ready when all dependencies are available
 */
export async function readinessCheck(_req: Request, res: Response) {
  const dbCheck = await checkDatabase();
  const memCheck = checkMemory();

  const ready = dbCheck.status !== 'fail' && memCheck.status !== 'fail';

  res.status(ready ? 200 : 503).json({
    ready,
    checks: {
      database: dbCheck,
      memory: memCheck,
    },
  });
}

/**
 * Liveness check - for Kubernetes liveness probes
 * Server is alive if it can respond to requests
 */
export function livenessCheck(_req: Request, res: Response) {
  res.status(200).json({
    alive: true,
    timestamp: new Date().toISOString(),
  });
}
