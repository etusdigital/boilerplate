import { createTestAccount, createTestAccounts } from './account.factory';

describe('Account Factory', () => {
  describe('createTestAccount', () => {
    it('should create account with default values', () => {
      const account = createTestAccount();

      expect(account.id).toBeDefined();
      expect(account.name).toMatch(/^Test Account [a-f0-9-]+$/);
      expect(account.description).toBe('Test account description');
    });

    it('should accept custom id', () => {
      const account = createTestAccount({ id: 'custom-account-id' });

      expect(account.id).toBe('custom-account-id');
    });

    it('should accept custom name', () => {
      const account = createTestAccount({ name: 'My Custom Account' });

      expect(account.name).toBe('My Custom Account');
    });

    it('should accept custom description', () => {
      const account = createTestAccount({ description: 'Custom description' });

      expect(account.description).toBe('Custom description');
    });

    it('should accept all options at once', () => {
      const account = createTestAccount({
        id: 'acc-123',
        name: 'Full Account',
        description: 'Full description',
      });

      expect(account.id).toBe('acc-123');
      expect(account.name).toBe('Full Account');
      expect(account.description).toBe('Full description');
    });

    it('should create unique IDs for multiple accounts', () => {
      const account1 = createTestAccount();
      const account2 = createTestAccount();

      expect(account1.id).not.toBe(account2.id);
    });

    it('should create unique names for multiple accounts', () => {
      const account1 = createTestAccount();
      const account2 = createTestAccount();

      expect(account1.name).not.toBe(account2.name);
    });
  });

  describe('createTestAccounts', () => {
    it('should create specified number of accounts', () => {
      const accounts = createTestAccounts(5);

      expect(accounts).toHaveLength(5);
    });

    it('should create zero accounts when count is 0', () => {
      const accounts = createTestAccounts(0);

      expect(accounts).toHaveLength(0);
    });

    it('should create accounts with sequential names', () => {
      const accounts = createTestAccounts(3);

      expect(accounts[0].name).toBe('Test Account 1');
      expect(accounts[1].name).toBe('Test Account 2');
      expect(accounts[2].name).toBe('Test Account 3');
    });

    it('should create accounts with unique IDs', () => {
      const accounts = createTestAccounts(3);
      const ids = accounts.map((a) => a.id);
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(3);
    });

    it('should create accounts with default description', () => {
      const accounts = createTestAccounts(2);

      accounts.forEach((account) => {
        expect(account.description).toBe('Test account description');
      });
    });

    it('should handle large count', () => {
      const accounts = createTestAccounts(100);

      expect(accounts).toHaveLength(100);
      expect(accounts[99].name).toBe('Test Account 100');
    });
  });
});
