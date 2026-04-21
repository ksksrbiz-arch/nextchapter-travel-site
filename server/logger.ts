/**
 * Structured Logging Module
 * 
 * Provides consistent, structured logging across the application.
 * Supports different log levels, contextual data, and PII redaction.
 * 
 * In production, logs can be sent to external services like:
 * - CloudWatch, Datadog, New Relic, Sentry, etc.
 */

export enum LogLevel {
  ERROR = 'error',
  WARN = 'warn',
  INFO = 'info',
  DEBUG = 'debug',
}

interface LogContext {
  userId?: string;
  requestId?: string;
  ip?: string;
  userAgent?: string;
  method?: string;
  path?: string;
  statusCode?: number;
  duration?: number;
  error?: Error;
  [key: string]: any;
}

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
}

/**
 * PII (Personally Identifiable Information) patterns to redact
 */
const PII_PATTERNS = {
  email: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  phone: /\b\d{3}[-.]?\d{3}[-.]?\d{4}\b/g,
  ssn: /\b\d{3}-\d{2}-\d{4}\b/g,
  creditCard: /\b\d{4}[-\s]?\d{4}[-\s]?\d{4}[-\s]?\d{4}\b/g,
  passport: /\b[A-Z]{1,2}\d{6,9}\b/g,
};

/**
 * Redact PII from log data
 */
function redactPII(data: any): any {
  if (typeof data === 'string') {
    let redacted = data;
    redacted = redacted.replace(PII_PATTERNS.email, '[EMAIL_REDACTED]');
    redacted = redacted.replace(PII_PATTERNS.phone, '[PHONE_REDACTED]');
    redacted = redacted.replace(PII_PATTERNS.ssn, '[SSN_REDACTED]');
    redacted = redacted.replace(PII_PATTERNS.creditCard, '[CARD_REDACTED]');
    redacted = redacted.replace(PII_PATTERNS.passport, '[PASSPORT_REDACTED]');
    return redacted;
  }

  if (Array.isArray(data)) {
    return data.map(item => redactPII(item));
  }

  if (typeof data === 'object' && data !== null) {
    const redacted: any = {};
    for (const [key, value] of Object.entries(data)) {
      // Redact sensitive field names
      if (['password', 'token', 'secret', 'apiKey', 'creditCard'].includes(key)) {
        redacted[key] = '[REDACTED]';
      } else {
        redacted[key] = redactPII(value);
      }
    }
    return redacted;
  }

  return data;
}

/**
 * Format log entry for output
 */
function formatLogEntry(entry: LogEntry): string {
  const { level, message, timestamp, context } = entry;

  if (process.env.NODE_ENV === 'production') {
    // JSON format for production (easier to parse)
    return JSON.stringify({
      level,
      message,
      timestamp,
      ...context,
    });
  }

  // Human-readable format for development
  const contextStr = context ? ` ${JSON.stringify(context, null, 2)}` : '';
  return `[${timestamp}] ${level.toUpperCase()}: ${message}${contextStr}`;
}

/**
 * Logger class with structured logging methods
 */
class Logger {
  private enablePIIRedaction: boolean;
  private minLevel: LogLevel;

  constructor() {
    this.enablePIIRedaction = process.env.NODE_ENV === 'production';
    this.minLevel = (process.env.LOG_LEVEL as LogLevel) || LogLevel.INFO;
  }

  private shouldLog(level: LogLevel): boolean {
    const levels = [LogLevel.DEBUG, LogLevel.INFO, LogLevel.WARN, LogLevel.ERROR];
    return levels.indexOf(level) >= levels.indexOf(this.minLevel);
  }

  private log(level: LogLevel, message: string, context?: LogContext) {
    if (!this.shouldLog(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message: this.enablePIIRedaction ? redactPII(message) : message,
      timestamp: new Date().toISOString(),
      context: this.enablePIIRedaction && context ? redactPII(context) : context,
    };

    const formatted = formatLogEntry(entry);

    // Output to appropriate stream
    if (level === LogLevel.ERROR) {
      console.error(formatted);
    } else if (level === LogLevel.WARN) {
      console.warn(formatted);
    } else {
      console.log(formatted);
    }

    // In production, send to external logging service here
    // Example: await sendToDatadog(entry);
  }

  error(message: string, context?: LogContext) {
    this.log(LogLevel.ERROR, message, context);
  }

  warn(message: string, context?: LogContext) {
    this.log(LogLevel.WARN, message, context);
  }

  info(message: string, context?: LogContext) {
    this.log(LogLevel.INFO, message, context);
  }

  debug(message: string, context?: LogContext) {
    this.log(LogLevel.DEBUG, message, context);
  }

  /**
   * Log HTTP request
   */
  request(req: any, res: any, duration: number) {
    this.info('HTTP Request', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.get('user-agent'),
      userId: req.user?.id,
    });
  }

  /**
   * Log security event
   */
  security(event: string, context?: LogContext) {
    this.warn(`Security: ${event}`, {
      ...context,
      type: 'security',
    });
  }

  /**
   * Log authentication event
   */
  auth(event: string, context?: LogContext) {
    this.info(`Auth: ${event}`, {
      ...context,
      type: 'auth',
    });
  }

  /**
   * Log database query
   */
  query(query: string, duration: number, context?: LogContext) {
    this.debug('Database Query', {
      query: this.enablePIIRedaction ? '[QUERY_REDACTED]' : query,
      duration,
      ...context,
    });
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Express middleware for request logging
 */
export function requestLogger(req: any, res: any, next: () => void) {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.request(req, res, duration);
  });

  next();
}

/**
 * Error logging middleware
 */
export function errorLogger(err: Error, req: any, res: any, next: () => void) {
  logger.error('Unhandled error', {
    error: err,
    stack: err.stack,
    method: req.method,
    path: req.path,
    userId: req.user?.id,
  });

  next(err);
}
