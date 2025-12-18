import * as jwt from 'jsonwebtoken';
import {
  createTestJwt,
  createAuthHeader,
  createUserAuthHeader,
  createAdminJwt,
  createSuperAdminJwt,
  decodeTestJwt,
  getTestJwtSecret,
} from './auth.helper';
import { createTestUser } from '../factories/user.factory';

describe('Auth Helper', () => {
  describe('createTestJwt', () => {
    it('should create valid JWT token', () => {
      const token = createTestJwt({});

      expect(token).toBeDefined();
      expect(token.split('.')).toHaveLength(3);
    });

    it('should include default claims', () => {
      const token = createTestJwt({});
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.sub).toBe('test-user-id');
      expect(decoded.email).toBe('test@example.com');
      expect(decoded.roles).toEqual(['user']);
      expect(decoded.iss).toBe('https://test-issuer.example.com/');
      expect(decoded.aud).toEqual(['test-audience']);
    });

    it('should include iat and exp claims', () => {
      const before = Math.floor(Date.now() / 1000);
      const token = createTestJwt({});
      const decoded = jwt.decode(token) as Record<string, any>;
      const after = Math.floor(Date.now() / 1000);

      expect(decoded.iat).toBeGreaterThanOrEqual(before);
      expect(decoded.iat).toBeLessThanOrEqual(after);
      expect(decoded.exp).toBe(decoded.iat + 3600);
    });

    it('should allow overriding sub claim', () => {
      const token = createTestJwt({ sub: 'custom-user-123' });
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.sub).toBe('custom-user-123');
    });

    it('should allow overriding email claim', () => {
      const token = createTestJwt({ email: 'custom@example.com' });
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.email).toBe('custom@example.com');
    });

    it('should allow overriding roles', () => {
      const token = createTestJwt({ roles: ['admin', 'manager'] });
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.roles).toEqual(['admin', 'manager']);
    });

    it('should allow setting custom accountId', () => {
      const token = createTestJwt({ accountId: 'account-456' });
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.accountId).toBe('account-456');
    });

    it('should include https://bri.us/roles claim', () => {
      const token = createTestJwt({});
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded['https://bri.us/roles']).toEqual(['user']);
    });

    it('should be verifiable with test secret', () => {
      const token = createTestJwt({});

      expect(() =>
        jwt.verify(token, getTestJwtSecret()),
      ).not.toThrow();
    });
  });

  describe('createAuthHeader', () => {
    it('should create Bearer token format', () => {
      const header = createAuthHeader('my-token');

      expect(header).toBe('Bearer my-token');
    });

    it('should work with actual JWT token', () => {
      const token = createTestJwt({});
      const header = createAuthHeader(token);

      expect(header).toMatch(/^Bearer [a-zA-Z0-9._-]+$/);
    });
  });

  describe('createUserAuthHeader', () => {
    it('should create auth header for user', () => {
      const user = createTestUser({
        id: 'user-123',
        email: 'user@test.com',
      });

      const header = createUserAuthHeader(user);

      expect(header).toMatch(/^Bearer /);

      const token = header.replace('Bearer ', '');
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.sub).toBe('user-123');
      expect(decoded.email).toBe('user@test.com');
    });

    it('should use user email even when null was passed to factory (factory uses default)', () => {
      // Note: createTestUser uses nullish coalescing, so null becomes default email
      const user = createTestUser({ email: null });
      const header = createUserAuthHeader(user);

      const token = header.replace('Bearer ', '');
      const decoded = jwt.decode(token) as Record<string, any>;

      // The factory converts null to default email, which then gets used here
      expect(decoded.email).toMatch(/^test-[a-f0-9-]+@example\.com$/);
    });

    it('should include custom roles', () => {
      const user = createTestUser();
      const header = createUserAuthHeader(user, { roles: ['admin', 'editor'] });

      const token = header.replace('Bearer ', '');
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.roles).toEqual(['admin', 'editor']);
      expect(decoded['https://bri.us/roles']).toEqual(['admin', 'editor']);
    });

    it('should include custom permissions', () => {
      const user = createTestUser();
      const header = createUserAuthHeader(user, {
        permissions: ['read:users', 'write:users'],
      });

      const token = header.replace('Bearer ', '');
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.permissions).toEqual(['read:users', 'write:users']);
    });
  });

  describe('createAdminJwt', () => {
    it('should create token with admin role', () => {
      const token = createAdminJwt();
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.roles).toEqual(['admin']);
      expect(decoded['https://bri.us/roles']).toEqual(['admin']);
    });

    it('should allow additional claims', () => {
      const token = createAdminJwt({
        sub: 'admin-user-123',
        email: 'admin@company.com',
      });
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.sub).toBe('admin-user-123');
      expect(decoded.email).toBe('admin@company.com');
      expect(decoded.roles).toEqual(['admin']);
    });
  });

  describe('createSuperAdminJwt', () => {
    it('should create token with super_admin role', () => {
      const token = createSuperAdminJwt();
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.roles).toEqual(['super_admin']);
      expect(decoded['https://bri.us/roles']).toEqual(['super_admin']);
    });

    it('should allow additional claims', () => {
      const token = createSuperAdminJwt({
        sub: 'super-admin-123',
      });
      const decoded = jwt.decode(token) as Record<string, any>;

      expect(decoded.sub).toBe('super-admin-123');
      expect(decoded.roles).toEqual(['super_admin']);
    });
  });

  describe('decodeTestJwt', () => {
    it('should decode JWT payload', () => {
      const token = createTestJwt({
        sub: 'decode-test',
        email: 'decode@test.com',
      });

      const decoded = decodeTestJwt(token);

      expect(decoded.sub).toBe('decode-test');
      expect(decoded.email).toBe('decode@test.com');
    });

    it('should return all payload claims', () => {
      const token = createTestJwt({
        roles: ['viewer'],
        permissions: ['read'],
      });

      const decoded = decodeTestJwt(token);

      expect(decoded.roles).toEqual(['viewer']);
      expect(decoded.permissions).toEqual(['read']);
    });
  });

  describe('getTestJwtSecret', () => {
    it('should return test secret', () => {
      const secret = getTestJwtSecret();

      expect(secret).toBeDefined();
      expect(typeof secret).toBe('string');
      expect(secret.length).toBeGreaterThan(0);
    });

    it('should return consistent secret', () => {
      const secret1 = getTestJwtSecret();
      const secret2 = getTestJwtSecret();

      expect(secret1).toBe(secret2);
    });
  });
});
