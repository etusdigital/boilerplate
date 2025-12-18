import { ClsService } from 'nestjs-cls';
import { RequestContext } from './request-context';
import { User } from '../../entities/user.entity';

describe('RequestContext', () => {
  const createMockUser = (overrides: Partial<User> = {}): User => {
    const user = new User();
    user.id = overrides.id ?? 'user-123';
    user.email = overrides.email ?? 'test@example.com';
    user.name = overrides.name ?? 'Test User';
    user.isSuperAdmin = overrides.isSuperAdmin ?? false;
    user.status = 'accepted';
    user.providerIds = [];
    return user;
  };

  describe('constructor', () => {
    it('should set all required properties', () => {
      const user = createMockUser();
      const context = new RequestContext({
        accountId: 'account-456',
        user,
      });

      expect(context.accountId).toBe('account-456');
      expect(context.user).toBe(user);
    });

    it('should set optional properties when provided', () => {
      const user = createMockUser();
      const context = new RequestContext({
        accountId: 'account-456',
        user,
        transactionId: 'tx-789',
        ip: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
      });

      expect(context.transactionId).toBe('tx-789');
      expect(context.ip).toBe('192.168.1.1');
      expect(context.userAgent).toBe('Mozilla/5.0');
    });

    it('should default optional properties to empty strings', () => {
      const user = createMockUser();
      const context = new RequestContext({
        accountId: 'account-456',
        user,
      });

      expect(context.transactionId).toBe('');
      expect(context.ip).toBe('');
      expect(context.userAgent).toBe('');
    });
  });

  describe('fromCls', () => {
    it('should create context from CLS with all values', () => {
      const user = createMockUser();
      const mockCls = {
        get: jest.fn().mockImplementation((key: string) => {
          const values: Record<string, unknown> = {
            accountId: 'account-123',
            user,
            transactionId: 'tx-456',
            ip: '10.0.0.1',
            userAgent: 'TestAgent',
          };
          return values[key];
        }),
      } as unknown as ClsService;

      const context = RequestContext.fromCls(mockCls);

      expect(context.accountId).toBe('account-123');
      expect(context.user).toBe(user);
      expect(context.transactionId).toBe('tx-456');
      expect(context.ip).toBe('10.0.0.1');
      expect(context.userAgent).toBe('TestAgent');
    });

    it('should throw when accountId is missing', () => {
      const mockCls = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'user') return createMockUser();
          return undefined;
        }),
      } as unknown as ClsService;

      expect(() => RequestContext.fromCls(mockCls)).toThrow(
        'RequestContext: accountId not found in CLS',
      );
    });

    it('should throw when user is missing', () => {
      const mockCls = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return 'account-123';
          return undefined;
        }),
      } as unknown as ClsService;

      expect(() => RequestContext.fromCls(mockCls)).toThrow(
        'RequestContext: user not found in CLS',
      );
    });

    it('should throw descriptive error for missing accountId', () => {
      const mockCls = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ClsService;

      expect(() => RequestContext.fromCls(mockCls)).toThrow(
        /accountId not found/,
      );
    });
  });

  describe('tryFromCls', () => {
    it('should return context when CLS has all required values', () => {
      const user = createMockUser();
      const mockCls = {
        get: jest.fn().mockImplementation((key: string) => {
          const values: Record<string, unknown> = {
            accountId: 'account-123',
            user,
          };
          return values[key];
        }),
      } as unknown as ClsService;

      const context = RequestContext.tryFromCls(mockCls);

      expect(context).not.toBeNull();
      expect(context?.accountId).toBe('account-123');
    });

    it('should return null when accountId is missing', () => {
      const mockCls = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ClsService;

      const context = RequestContext.tryFromCls(mockCls);

      expect(context).toBeNull();
    });

    it('should return null when user is missing', () => {
      const mockCls = {
        get: jest.fn().mockImplementation((key: string) => {
          if (key === 'accountId') return 'account-123';
          return undefined;
        }),
      } as unknown as ClsService;

      const context = RequestContext.tryFromCls(mockCls);

      expect(context).toBeNull();
    });

    it('should not throw on failure', () => {
      const mockCls = {
        get: jest.fn().mockReturnValue(undefined),
      } as unknown as ClsService;

      expect(() => RequestContext.tryFromCls(mockCls)).not.toThrow();
    });
  });

  describe('isSuperAdmin', () => {
    it('should return true when user is super admin', () => {
      const user = createMockUser({ isSuperAdmin: true });
      const context = new RequestContext({
        accountId: 'account-123',
        user,
      });

      expect(context.isSuperAdmin).toBe(true);
    });

    it('should return false when user is not super admin', () => {
      const user = createMockUser({ isSuperAdmin: false });
      const context = new RequestContext({
        accountId: 'account-123',
        user,
      });

      expect(context.isSuperAdmin).toBe(false);
    });

    it('should return false when user has no isSuperAdmin property', () => {
      const user = createMockUser();
      delete (user as any).isSuperAdmin;
      const context = new RequestContext({
        accountId: 'account-123',
        user,
      });

      expect(context.isSuperAdmin).toBe(false);
    });
  });

  describe('userId', () => {
    it('should return user id', () => {
      const user = createMockUser({ id: 'specific-user-id' });
      const context = new RequestContext({
        accountId: 'account-123',
        user,
      });

      expect(context.userId).toBe('specific-user-id');
    });
  });

  describe('userEmail', () => {
    it('should return user email', () => {
      const user = createMockUser({ email: 'user@company.com' });
      const context = new RequestContext({
        accountId: 'account-123',
        user,
      });

      expect(context.userEmail).toBe('user@company.com');
    });

    it('should return null when user has no email', () => {
      const user = createMockUser();
      user.email = null as any;
      const context = new RequestContext({
        accountId: 'account-123',
        user,
      });

      expect(context.userEmail).toBeNull();
    });
  });

  describe('with', () => {
    it('should create copy with updated accountId', () => {
      const user = createMockUser();
      const original = new RequestContext({
        accountId: 'account-123',
        user,
        ip: '10.0.0.1',
      });

      const updated = original.with({ accountId: 'new-account' });

      expect(updated.accountId).toBe('new-account');
      expect(updated.user).toBe(user);
      expect(updated.ip).toBe('10.0.0.1');
    });

    it('should create copy with updated user', () => {
      const originalUser = createMockUser({ id: 'user-1' });
      const newUser = createMockUser({ id: 'user-2' });
      const original = new RequestContext({
        accountId: 'account-123',
        user: originalUser,
      });

      const updated = original.with({ user: newUser });

      expect(updated.user.id).toBe('user-2');
      expect(updated.accountId).toBe('account-123');
    });

    it('should create copy with multiple updates', () => {
      const user = createMockUser();
      const original = new RequestContext({
        accountId: 'account-123',
        user,
        ip: '10.0.0.1',
        userAgent: 'OldAgent',
      });

      const updated = original.with({
        accountId: 'new-account',
        ip: '192.168.1.1',
        userAgent: 'NewAgent',
      });

      expect(updated.accountId).toBe('new-account');
      expect(updated.ip).toBe('192.168.1.1');
      expect(updated.userAgent).toBe('NewAgent');
      expect(updated.user).toBe(user);
    });

    it('should not modify original context', () => {
      const user = createMockUser();
      const original = new RequestContext({
        accountId: 'account-123',
        user,
      });

      original.with({ accountId: 'new-account' });

      expect(original.accountId).toBe('account-123');
    });
  });

  describe('toJSON', () => {
    it('should serialize to plain object', () => {
      const user = createMockUser({
        id: 'user-123',
        email: 'test@example.com',
      });
      const context = new RequestContext({
        accountId: 'account-456',
        user,
        transactionId: 'tx-789',
        ip: '10.0.0.1',
        userAgent: 'Mozilla/5.0',
      });

      const json = context.toJSON();

      expect(json).toEqual({
        accountId: 'account-456',
        userId: 'user-123',
        userEmail: 'test@example.com',
        transactionId: 'tx-789',
        ip: '10.0.0.1',
        userAgent: 'Mozilla/5.0',
      });
    });

    it('should handle null email in JSON output', () => {
      const user = createMockUser();
      user.email = null as any;
      const context = new RequestContext({
        accountId: 'account-456',
        user,
      });

      const json = context.toJSON();

      expect(json.userEmail).toBeNull();
    });

    it('should not include user object directly', () => {
      const user = createMockUser();
      const context = new RequestContext({
        accountId: 'account-456',
        user,
      });

      const json = context.toJSON();

      expect(json).not.toHaveProperty('user');
      expect(json).toHaveProperty('userId');
    });
  });
});
