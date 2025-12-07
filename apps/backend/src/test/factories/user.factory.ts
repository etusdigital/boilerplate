import { User } from '../../entities/user.entity';
import { v4 as uuid } from 'uuid';

export interface CreateTestUserOptions {
  id?: string;
  email?: string | null;
  name?: string;
  status?: string;
  providerIds?: string[];
  isSuperAdmin?: boolean;
  profileImage?: string | null;
}

/**
 * Factory for creating test User entities.
 * Use this in tests to create consistent, valid user objects.
 */
export function createTestUser(options: CreateTestUserOptions = {}): User {
  const user = new User();

  user.id = options.id ?? uuid();
  user.email = options.email ?? `test-${uuid().slice(0, 8)}@example.com`;
  user.name = options.name ?? 'Test User';
  user.status = options.status ?? 'accepted';
  user.providerIds = options.providerIds ?? [];
  user.isSuperAdmin = options.isSuperAdmin ?? false;
  user.profileImage = (options.profileImage ?? null) as string;

  return user;
}

/**
 * Create a test user with provider IDs
 */
export function createTestUserWithProvider(
  provider: 'google' | 'auth0',
  providerId: string,
  options: CreateTestUserOptions = {},
): User {
  const fullProviderId = `${provider}|${providerId}`;
  return createTestUser({
    ...options,
    providerIds: [fullProviderId, ...(options.providerIds ?? [])],
  });
}

/**
 * Create a super admin test user
 */
export function createTestSuperAdmin(
  options: CreateTestUserOptions = {},
): User {
  return createTestUser({
    ...options,
    isSuperAdmin: true,
    email: options.email ?? 'admin@example.com',
    name: options.name ?? 'Super Admin',
  });
}

/**
 * Create an invited (pending) test user
 */
export function createTestInvitedUser(
  options: CreateTestUserOptions = {},
): User {
  return createTestUser({
    ...options,
    status: 'invited',
  });
}
