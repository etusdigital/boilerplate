import * as jwt from 'jsonwebtoken';
import { User } from '../../entities/user.entity';

/**
 * Auth helper utilities for testing.
 * Provides JWT token creation and auth header generation.
 */

export interface TestJwtPayload {
  sub: string;
  email: string;
  roles?: string[];
  permissions?: string[];
  identities?: string[];
  accountId?: string;
  iss?: string;
  aud?: string | string[];
  'https://bri.us/roles'?: string[];
}

// Test secret for JWT signing (only for tests)
const TEST_JWT_SECRET = 'test-jwt-secret-key-for-testing-only';

/**
 * Create a test JWT token with custom claims
 */
export function createTestJwt(claims: Partial<TestJwtPayload>): string {
  const defaultClaims: TestJwtPayload = {
    sub: 'test-user-id',
    email: 'test@example.com',
    roles: ['user'],
    permissions: [],
    identities: [],
    iss: 'https://test-issuer.example.com/',
    aud: ['test-audience'],
    'https://bri.us/roles': ['user'],
  };

  const payload = {
    ...defaultClaims,
    ...claims,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour expiry
  };

  return jwt.sign(payload, TEST_JWT_SECRET);
}

/**
 * Create an Authorization header value from a JWT token
 */
export function createAuthHeader(token: string): string {
  return `Bearer ${token}`;
}

/**
 * Create a test JWT and Authorization header for a user
 */
export function createUserAuthHeader(
  user: User,
  options: { roles?: string[]; permissions?: string[]; accountId?: string } = {},
): string {
  const token = createTestJwt({
    sub: user.id,
    email: user.email || 'test@example.com',
    roles: options.roles ?? ['user'],
    permissions: options.permissions ?? [],
    'https://bri.us/roles': options.roles ?? ['user'],
  });

  return createAuthHeader(token);
}

/**
 * Create a test JWT for an admin user
 */
export function createAdminJwt(claims: Partial<TestJwtPayload> = {}): string {
  return createTestJwt({
    roles: ['admin'],
    'https://bri.us/roles': ['admin'],
    ...claims,
  });
}

/**
 * Create a test JWT for a super admin user
 */
export function createSuperAdminJwt(
  claims: Partial<TestJwtPayload> = {},
): string {
  return createTestJwt({
    roles: ['super_admin'],
    'https://bri.us/roles': ['super_admin'],
    ...claims,
  });
}

/**
 * Decode a JWT token without verification (for testing assertions)
 */
export function decodeTestJwt(token: string): TestJwtPayload {
  return jwt.decode(token) as TestJwtPayload;
}

/**
 * Get the test JWT secret (for configuring test modules)
 */
export function getTestJwtSecret(): string {
  return TEST_JWT_SECRET;
}
