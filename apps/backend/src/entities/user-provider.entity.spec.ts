import { UserProvider } from './user-provider.entity';

describe('UserProvider', () => {
  describe('parseProviderId', () => {
    it('should parse google provider ID correctly', () => {
      const result = UserProvider.parseProviderId('google|123456789');

      expect(result).toEqual({
        providerName: 'google',
        providerUserId: '123456789',
      });
    });

    it('should parse auth0 provider ID correctly', () => {
      const result = UserProvider.parseProviderId('auth0|user_abc123');

      expect(result).toEqual({
        providerName: 'auth0',
        providerUserId: 'user_abc123',
      });
    });

    it('should parse github provider ID correctly', () => {
      const result = UserProvider.parseProviderId('github|99887766');

      expect(result).toEqual({
        providerName: 'github',
        providerUserId: '99887766',
      });
    });

    it('should handle provider ID with multiple pipe characters', () => {
      // Only first pipe is the separator
      const result = UserProvider.parseProviderId('google|id|with|pipes');

      expect(result).toEqual({
        providerName: 'google',
        providerUserId: 'id|with|pipes',
      });
    });

    it('should return "unknown" provider for legacy format without separator', () => {
      const result = UserProvider.parseProviderId('legacy_user_id_123');

      expect(result).toEqual({
        providerName: 'unknown',
        providerUserId: 'legacy_user_id_123',
      });
    });

    it('should handle empty provider name (pipe at start)', () => {
      const result = UserProvider.parseProviderId('|user123');

      expect(result).toEqual({
        providerName: '',
        providerUserId: 'user123',
      });
    });

    it('should handle empty user ID (pipe at end)', () => {
      const result = UserProvider.parseProviderId('google|');

      expect(result).toEqual({
        providerName: 'google',
        providerUserId: '',
      });
    });

    it('should handle just a pipe character', () => {
      const result = UserProvider.parseProviderId('|');

      expect(result).toEqual({
        providerName: '',
        providerUserId: '',
      });
    });

    it('should parse provider ID with special characters in user ID', () => {
      const result = UserProvider.parseProviderId(
        'google-oauth2|1234567890.apps.googleusercontent.com',
      );

      expect(result).toEqual({
        providerName: 'google-oauth2',
        providerUserId: '1234567890.apps.googleusercontent.com',
      });
    });
  });

  describe('toProviderId', () => {
    it('should create provider ID from google name and user ID', () => {
      const result = UserProvider.toProviderId('google', '123456789');

      expect(result).toBe('google|123456789');
    });

    it('should create provider ID from auth0 name and user ID', () => {
      const result = UserProvider.toProviderId('auth0', 'user_abc123');

      expect(result).toBe('auth0|user_abc123');
    });

    it('should handle empty strings', () => {
      const result = UserProvider.toProviderId('', '');

      expect(result).toBe('|');
    });

    it('should handle special characters in user ID', () => {
      const result = UserProvider.toProviderId(
        'google-oauth2',
        '1234567890.apps.googleusercontent.com',
      );

      expect(result).toBe('google-oauth2|1234567890.apps.googleusercontent.com');
    });
  });

  describe('parseProviderId and toProviderId roundtrip', () => {
    it('should roundtrip standard provider IDs', () => {
      const original = 'google|123456789';
      const parsed = UserProvider.parseProviderId(original);
      const reconstructed = UserProvider.toProviderId(
        parsed.providerName,
        parsed.providerUserId,
      );

      expect(reconstructed).toBe(original);
    });

    it('should roundtrip auth0 provider IDs', () => {
      const original = 'auth0|user_12345';
      const parsed = UserProvider.parseProviderId(original);
      const reconstructed = UserProvider.toProviderId(
        parsed.providerName,
        parsed.providerUserId,
      );

      expect(reconstructed).toBe(original);
    });

    it('should roundtrip complex provider IDs', () => {
      const original = 'google-oauth2|id|with|multiple|pipes';
      const parsed = UserProvider.parseProviderId(original);
      const reconstructed = UserProvider.toProviderId(
        parsed.providerName,
        parsed.providerUserId,
      );

      expect(reconstructed).toBe(original);
    });
  });

  describe('entity structure', () => {
    it('should create entity instance with all fields', () => {
      const provider = new UserProvider();
      provider.id = 'test-uuid';
      provider.userId = 'user-123';
      provider.providerName = 'google';
      provider.providerUserId = '12345';
      provider.createdAt = new Date('2024-01-01');

      expect(provider.id).toBe('test-uuid');
      expect(provider.userId).toBe('user-123');
      expect(provider.providerName).toBe('google');
      expect(provider.providerUserId).toBe('12345');
      expect(provider.createdAt).toEqual(new Date('2024-01-01'));
    });

    it('should have user relation defined', () => {
      const provider = new UserProvider();
      // User relation should be undefined initially
      expect(provider.user).toBeUndefined();
    });
  });
});
