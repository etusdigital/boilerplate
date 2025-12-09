/**
 * CORS configuration utilities.
 *
 * Provides testable functions for CORS origin validation.
 */

export type CorsOrigins = string[] | '*';

/**
 * Parse CORS origins from environment variable.
 * Returns '*' for wildcard, or array of trimmed origins.
 */
export function getCorsOrigins(envValue?: string): CorsOrigins {
  const originsEnv = envValue ?? process.env.ALLOWED_ORIGINS ?? '*';
  if (originsEnv === '*') return '*';
  return originsEnv.split(',').map((origin) => origin.trim());
}

/**
 * CORS origin callback for use with NestJS app.enableCors()
 */
export function createCorsOriginCallback(allowedOrigins: CorsOrigins) {
  return (
    origin: string | undefined,
    callback: (err: Error | null, allow?: boolean) => void,
  ) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      callback(null, true);
      return;
    }

    // Allow all if wildcard
    if (allowedOrigins === '*') {
      callback(null, true);
      return;
    }

    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  };
}

/**
 * Default CORS options for production use
 */
export const corsOptions = {
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'account-id', 'X-Request-ID'],
  exposedHeaders: ['X-Request-ID'],
  maxAge: 86400, // 24 hours
};
