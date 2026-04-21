/**
 * Rate Limiting Middleware for API endpoints
 * 
 * This module provides configurable rate limiting to protect against:
 * - Brute force attacks on authentication
 * - DOS attacks via excessive requests
 * - API abuse
 * 
 * Uses in-memory storage for rate limit tracking.
 * For production with multiple servers, consider using Redis.
 */

interface RateLimitConfig {
  windowMs: number;  // Time window in milliseconds
  max: number;       // Max requests per window
  message?: string;  // Error message when limit exceeded
  skipSuccessfulRequests?: boolean;  // Don't count successful requests
  skipFailedRequests?: boolean;      // Don't count failed requests
}

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting
// In production with multiple servers, replace with Redis
const rateLimitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (entry.resetTime < now) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Create a rate limiter middleware
 */
export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    max,
    message = 'Too many requests, please try again later',
    skipSuccessfulRequests = false,
    skipFailedRequests = false,
  } = config;

  return function rateLimitMiddleware(
    req: any,
    res: any,
    next: () => void
  ) {
    // Get client identifier (IP address or user ID)
    const clientId = req.user?.id || req.ip || req.connection?.remoteAddress;
    if (!clientId) {
      return next();
    }

    const key = `${req.path}:${clientId}`;
    const now = Date.now();

    // Get or create rate limit entry
    let entry = rateLimitStore.get(key);
    
    if (!entry || entry.resetTime < now) {
      // Create new entry
      entry = {
        count: 0,
        resetTime: now + windowMs,
      };
      rateLimitStore.set(key, entry);
    }

    // Increment counter
    entry.count++;

    // Set rate limit headers
    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - entry.count));
    res.setHeader('X-RateLimit-Reset', new Date(entry.resetTime).toISOString());

    // Check if limit exceeded
    if (entry.count > max) {
      res.setHeader('Retry-After', Math.ceil((entry.resetTime - now) / 1000));
      return res.status(429).json({
        error: message,
        retryAfter: Math.ceil((entry.resetTime - now) / 1000),
      });
    }

    // Handle response to potentially skip counting
    if (skipSuccessfulRequests || skipFailedRequests) {
      const originalSend = res.send;
      res.send = function(data: any) {
        const statusCode = res.statusCode;
        const shouldSkip = 
          (skipSuccessfulRequests && statusCode >= 200 && statusCode < 400) ||
          (skipFailedRequests && statusCode >= 400);
        
        if (shouldSkip && entry) {
          entry.count--;
        }
        
        return originalSend.call(this, data);
      };
    }

    next();
  };
}

/**
 * Predefined rate limiters for common use cases
 */

// Strict limit for authentication endpoints (5 requests per 15 minutes)
export const authRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: 'Too many login attempts. Please try again in 15 minutes.',
  skipSuccessfulRequests: true, // Only count failed login attempts
});

// Moderate limit for API endpoints (100 requests per 15 minutes)
export const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many API requests. Please slow down.',
});

// Strict limit for file uploads (10 uploads per hour)
export const uploadRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10,
  message: 'Too many file uploads. Please try again later.',
});

// Very strict limit for password reset (3 attempts per hour)
export const passwordResetRateLimiter = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: 'Too many password reset attempts. Please try again in 1 hour.',
});

/**
 * Helper to clear rate limit for a specific client (e.g., after successful login)
 */
export function clearRateLimit(path: string, clientId: string) {
  const key = `${path}:${clientId}`;
  rateLimitStore.delete(key);
}

/**
 * Get current rate limit status for a client
 */
export function getRateLimitStatus(path: string, clientId: string): {
  remaining: number;
  resetTime: number;
  limited: boolean;
} {
  const key = `${path}:${clientId}`;
  const entry = rateLimitStore.get(key);
  const now = Date.now();

  if (!entry || entry.resetTime < now) {
    return {
      remaining: 100, // Default max
      resetTime: now + (15 * 60 * 1000),
      limited: false,
    };
  }

  return {
    remaining: Math.max(0, 100 - entry.count),
    resetTime: entry.resetTime,
    limited: entry.count > 100,
  };
}

/**
 * Export the store for testing purposes
 */
export { rateLimitStore };
