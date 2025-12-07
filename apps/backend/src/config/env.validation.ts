import { z } from 'zod';

export const envSchema = z.object({
  // Application
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().default(3000),

  // Database
  DATABASE_URL: z.string().optional(),
  TYPEORM_LOGGING: z
    .string()
    .default('false')
    .transform((val) => val === 'true'),

  // Auth0 (Identity Provider)
  JWKS_URI: z.string().url(),
  IDP_ISSUER: z.string().url(),
  IDP_AUDIENCE: z.string(),
  AUTH0_DOMAIN: z.string().min(1),
  AUTH0_CLIENT_ID: z.string().min(1),
  AUTH0_CLIENT_SECRET: z.string().min(1),
  AUTH0_ROLES_NAME: z.string().optional(),
  AUTH0_CONNECTION_ID: z.string().optional(),
  AUTH0_CONNECTION_TYPE: z.string().default('Username-Password-Authentication'),

  // Service Account (JSON string)
  SERVICE_ACCOUNT: z.string().optional(),

  // Frontend URL (for invitations, emails, etc.)
  FRONTEND_URL: z.string().url().optional(),

  // CORS - will be used in feature/cors-security branch
  ALLOWED_ORIGINS: z
    .string()
    .default('*')
    .transform((s) => s.split(',').map((origin) => origin.trim())),

  // Google OAuth - will be used in feature/auth-provider-abstraction branch
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Self-issued JWT (RS256) - will be used in feature/auth-provider-abstraction branch
  JWT_ISSUER: z.string().url().optional(),
  JWT_PRIVATE_KEY_PATH: z.string().optional(),
  JWT_PUBLIC_KEY_PATH: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default('1h'),

  // Redis - will be used in feature/infrastructure-essentials branch
  REDIS_URL: z.string().optional(),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

export function validateEnv(
  config: Record<string, unknown>,
): Record<string, unknown> {
  const result = envSchema.safeParse(config);

  if (!result.success) {
    const errors = result.error.issues
      .map((issue) => {
        const path = issue.path.join('.');
        return `  - ${path}: ${issue.message}`;
      })
      .join('\n');

    throw new Error(`\n\nEnvironment validation failed:\n${errors}\n`);
  }

  return result.data;
}
