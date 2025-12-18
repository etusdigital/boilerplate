import { Account } from '../../entities/account.entity';
import { v4 as uuid } from 'uuid';

export interface CreateTestAccountOptions {
  id?: string;
  name?: string;
  description?: string;
}

/**
 * Factory for creating test Account entities.
 */
export function createTestAccount(
  options: CreateTestAccountOptions = {},
): Account {
  const account = new Account();

  account.id = options.id ?? uuid();
  account.name = options.name ?? `Test Account ${uuid().slice(0, 8)}`;
  account.description = options.description ?? 'Test account description';

  return account;
}

/**
 * Create multiple test accounts
 */
export function createTestAccounts(count: number): Account[] {
  return Array.from({ length: count }, (_, index) =>
    createTestAccount({
      name: `Test Account ${index + 1}`,
    }),
  );
}
