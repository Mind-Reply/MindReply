import winston from 'winston';
import * as Sentry from '@sentry/node';

const isDevelopment = process.env.NODE_ENV === 'development';
const logLevel = process.env.LOG_LEVEL || 'info';

// Initialize Sentry
if (process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    tracesSampleRate: isDevelopment ? 1.0 : 0.1,
  });
}

/**
 * Structured logger with Winston + Sentry integration
 */
export const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'mindreply-backend' },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),

    // File: All logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 10485760, // 10MB
      maxFiles: 10,
    }),

    // File: Errors only
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 10485760,
      maxFiles: 5,
    }),
  ],
});

/**
 * Request logging middleware
 */
export const requestLogger = (req: any, res: any, next: any) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logger.info('HTTP Request', {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      userId: req.user?.id,
      agencyId: req.user?.agencyId,
      ip: req.ip,
    });

    if (res.statusCode >= 400) {
      Sentry.captureMessage(
        `HTTP ${res.statusCode}: ${req.method} ${req.path}`,
        res.statusCode >= 500 ? 'error' : 'warning'
      );
    }
  });

  next();
};

/**
 * Error logger
 */
export const errorHandler = (err: any, req: any, res: any, next: any) => {
  logger.error('Unhandled Error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    userId: req.user?.id,
  });

  Sentry.captureException(err, {
    tags: {
      endpoint: req.path,
      method: req.method,
    },
    extra: {
      userId: req.user?.id,
      agencyId: req.user?.agencyId,
    },
  });

  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    error: {
      message: isDevelopment ? err.message : 'Internal server error',
      code: err.code,
    },
  });
};
