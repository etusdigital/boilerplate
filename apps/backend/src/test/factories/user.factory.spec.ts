import {
  createTestUser,
  createTestUserWithProvider,
  createTestSuperAdmin,
  createTestInvitedUser,
  CreateTestUserOptions,
} from './user.factory';

describe('User Factory', () => {
  describe('createTestUser', () => {
    it('should create user with default values', () => {
      const user = createTestUser();

      expect(user.id).toBeDefined();
      expect(user.email).toMatch(/^test-[a-f0-9-]+@example\.com$/);
      expect(user.name).toBe('Test User');
      expect(user.status).toBe('accepted');
      expect(user.providerIds).toEqual([]);
      expect(user.isSuperAdmin).toBe(false);
      expect(user.profileImage).toBeNull();
    });

    it('should accept custom id', () => {
      const user = createTestUser({ id: 'custom-id-123' });

      expect(user.id).toBe('custom-id-123');
    });

    it('should accept custom email', () => {
      const user = createTestUser({ email: 'custom@example.com' });

      expect(user.email).toBe('custom@example.com');
    });

    it('should use default email when null is passed (nullish coalescing behavior)', () => {
      const user = createTestUser({ email: null });

      // Note: nullish coalescing (??) returns default for null
      expect(user.email).toMatch(/^test-[a-f0-9-]+@example\.com$/);
    });

    it('should accept custom name', () => {
      const user = createTestUser({ name: 'John Doe' });

      expect(user.name).toBe('John Doe');
    });

    it('should accept custom status', () => {
      const user = createTestUser({ status: 'pending' });

      expect(user.status).toBe('pending');
    });

    it('should accept custom providerIds', () => {
      const providerIds = ['google|123', 'auth0|456'];
      const user = createTestUser({ providerIds });

      expect(user.providerIds).toEqual(providerIds);
    });

    it('should accept isSuperAdmin flag', () => {
      const user = createTestUser({ isSuperAdmin: true });

      expect(user.isSuperAdmin).toBe(true);
    });

    it('should accept custom profileImage', () => {
      const user = createTestUser({ profileImage: 'https://example.com/photo.jpg' });

      expect(user.profileImage).toBe('https://example.com/photo.jpg');
    });

    it('should accept multiple options at once', () => {
      const options: CreateTestUserOptions = {
        id: 'user-123',
        email: 'test@test.com',
        name: 'Full Name',
        status: 'invited',
        providerIds: ['google|abc'],
        isSuperAdmin: true,
        profileImage: 'image.jpg',
      };

      const user = createTestUser(options);

      expect(user.id).toBe('user-123');
      expect(user.email).toBe('test@test.com');
      expect(user.name).toBe('Full Name');
      expect(user.status).toBe('invited');
      expect(user.providerIds).toEqual(['google|abc']);
      expect(user.isSuperAdmin).toBe(true);
      expect(user.profileImage).toBe('image.jpg');
    });

    it('should create unique IDs for multiple users', () => {
      const user1 = createTestUser();
      const user2 = createTestUser();

      expect(user1.id).not.toBe(user2.id);
    });

    it('should create unique emails for multiple users', () => {
      const user1 = createTestUser();
      const user2 = createTestUser();

      expect(user1.email).not.toBe(user2.email);
    });
  });

  describe('createTestUserWithProvider', () => {
    it('should create user with google provider', () => {
      const user = createTestUserWithProvider('google', '123456789');

      expect(user.providerIds).toContain('google|123456789');
    });

    it('should create user with auth0 provider', () => {
      const user = createTestUserWithProvider('auth0', 'user_abc');

      expect(user.providerIds).toContain('auth0|user_abc');
    });

    it('should preserve additional options', () => {
      const user = createTestUserWithProvider('google', '123', {
        name: 'Custom Name',
        isSuperAdmin: true,
      });

      expect(user.providerIds).toContain('google|123');
      expect(user.name).toBe('Custom Name');
      expect(user.isSuperAdmin).toBe(true);
    });

    it('should prepend new provider to existing providerIds', () => {
      const user = createTestUserWithProvider('google', 'new-id', {
        providerIds: ['auth0|existing'],
      });

      expect(user.providerIds).toHaveLength(2);
      expect(user.providerIds[0]).toBe('google|new-id');
      expect(user.providerIds[1]).toBe('auth0|existing');
    });
  });

  describe('createTestSuperAdmin', () => {
    it('should create user with isSuperAdmin true', () => {
      const admin = createTestSuperAdmin();

      expect(admin.isSuperAdmin).toBe(true);
    });

    it('should use admin@example.com as default email', () => {
      const admin = createTestSuperAdmin();

      expect(admin.email).toBe('admin@example.com');
    });

    it('should use Super Admin as default name', () => {
      const admin = createTestSuperAdmin();

      expect(admin.name).toBe('Super Admin');
    });

    it('should allow overriding email', () => {
      const admin = createTestSuperAdmin({ email: 'custom-admin@example.com' });

      expect(admin.email).toBe('custom-admin@example.com');
    });

    it('should allow overriding name', () => {
      const admin = createTestSuperAdmin({ name: 'Custom Admin' });

      expect(admin.name).toBe('Custom Admin');
    });

    it('should preserve other default values', () => {
      const admin = createTestSuperAdmin();

      expect(admin.status).toBe('accepted');
      expect(admin.providerIds).toEqual([]);
      expect(admin.profileImage).toBeNull();
    });
  });

  describe('createTestInvitedUser', () => {
    it('should create user with status invited', () => {
      const user = createTestInvitedUser();

      expect(user.status).toBe('invited');
    });

    it('should use default values for other fields', () => {
      const user = createTestInvitedUser();

      expect(user.name).toBe('Test User');
      expect(user.isSuperAdmin).toBe(false);
    });

    it('should allow overriding other options', () => {
      const user = createTestInvitedUser({
        name: 'Pending User',
        email: 'pending@example.com',
      });

      expect(user.status).toBe('invited');
      expect(user.name).toBe('Pending User');
      expect(user.email).toBe('pending@example.com');
    });
  });
});
