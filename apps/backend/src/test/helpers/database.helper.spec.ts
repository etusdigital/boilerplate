import { DataSource, QueryRunner } from 'typeorm';
import {
  createTestDataSource,
  setupTestDatabase,
  teardownTestDatabase,
  clearTables,
  clearAllTables,
  getDataSourceFromApp,
  resetDatabase,
} from './database.helper';
import { INestApplication } from '@nestjs/common';

describe('Database Helper', () => {
  describe('createTestDataSource', () => {
    it('should create SQLite in-memory data source', () => {
      const dataSource = createTestDataSource();

      expect(dataSource).toBeInstanceOf(DataSource);
      expect(dataSource.options.type).toBe('sqlite');
      expect(dataSource.options.database).toBe(':memory:');
    });

    it('should enable synchronize for test database', () => {
      const dataSource = createTestDataSource();

      expect(dataSource.options.synchronize).toBe(true);
    });

    it('should enable dropSchema for test database', () => {
      const dataSource = createTestDataSource();

      expect(dataSource.options.dropSchema).toBe(true);
    });

    it('should disable logging by default', () => {
      const dataSource = createTestDataSource();

      expect(dataSource.options.logging).toBe(false);
    });

    it('should include entity paths', () => {
      const dataSource = createTestDataSource();

      expect(dataSource.options.entities).toContain('src/**/*.entity.ts');
    });

    it('should create unique data source instances', () => {
      const ds1 = createTestDataSource();
      const ds2 = createTestDataSource();

      expect(ds1).not.toBe(ds2);
    });
  });

  describe('setupTestDatabase', () => {
    it('should initialize uninitialized data source', async () => {
      const mockDataSource = {
        isInitialized: false,
        initialize: jest.fn().mockResolvedValue(undefined),
      } as unknown as DataSource;

      await setupTestDatabase(mockDataSource);

      expect(mockDataSource.initialize).toHaveBeenCalled();
    });

    it('should not initialize already initialized data source', async () => {
      const mockDataSource = {
        isInitialized: true,
        initialize: jest.fn(),
      } as unknown as DataSource;

      await setupTestDatabase(mockDataSource);

      expect(mockDataSource.initialize).not.toHaveBeenCalled();
    });
  });

  describe('teardownTestDatabase', () => {
    it('should destroy initialized data source', async () => {
      const mockDataSource = {
        isInitialized: true,
        destroy: jest.fn().mockResolvedValue(undefined),
      } as unknown as DataSource;

      await teardownTestDatabase(mockDataSource);

      expect(mockDataSource.destroy).toHaveBeenCalled();
    });

    it('should not destroy uninitialized data source', async () => {
      const mockDataSource = {
        isInitialized: false,
        destroy: jest.fn(),
      } as unknown as DataSource;

      await teardownTestDatabase(mockDataSource);

      expect(mockDataSource.destroy).not.toHaveBeenCalled();
    });
  });

  describe('clearTables', () => {
    it('should execute DELETE queries for specified tables', async () => {
      const mockQueryRunner: Partial<QueryRunner> = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        query: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        rollbackTransaction: jest.fn(),
        release: jest.fn().mockResolvedValue(undefined),
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      } as unknown as DataSource;

      await clearTables(mockDataSource, ['users', 'accounts']);

      expect(mockQueryRunner.query).toHaveBeenCalledWith('PRAGMA foreign_keys = OFF');
      expect(mockQueryRunner.query).toHaveBeenCalledWith('DELETE FROM "users"');
      expect(mockQueryRunner.query).toHaveBeenCalledWith('DELETE FROM "accounts"');
      expect(mockQueryRunner.query).toHaveBeenCalledWith('PRAGMA foreign_keys = ON');
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      const mockQueryRunner: Partial<QueryRunner> = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        query: jest.fn().mockRejectedValue(new Error('DB error')),
        commitTransaction: jest.fn(),
        rollbackTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      } as unknown as DataSource;

      await expect(clearTables(mockDataSource, ['users'])).rejects.toThrow('DB error');
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should handle empty table list', async () => {
      const mockQueryRunner: Partial<QueryRunner> = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        query: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
      } as unknown as DataSource;

      await clearTables(mockDataSource, []);

      // Should still disable/enable foreign keys but no DELETE queries
      expect(mockQueryRunner.query).toHaveBeenCalledWith('PRAGMA foreign_keys = OFF');
      expect(mockQueryRunner.query).toHaveBeenCalledWith('PRAGMA foreign_keys = ON');
      expect(mockQueryRunner.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('clearAllTables', () => {
    it('should clear all entity tables', async () => {
      const mockQueryRunner: Partial<QueryRunner> = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        query: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
        entityMetadatas: [
          { tableName: 'users' },
          { tableName: 'accounts' },
          { tableName: 'audit_logs' },
        ],
      } as unknown as DataSource;

      await clearAllTables(mockDataSource);

      expect(mockQueryRunner.query).toHaveBeenCalledWith('DELETE FROM "users"');
      expect(mockQueryRunner.query).toHaveBeenCalledWith('DELETE FROM "accounts"');
      expect(mockQueryRunner.query).toHaveBeenCalledWith('DELETE FROM "audit_logs"');
    });

    it('should handle empty entity list', async () => {
      const mockQueryRunner: Partial<QueryRunner> = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        query: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
        entityMetadatas: [],
      } as unknown as DataSource;

      await clearAllTables(mockDataSource);

      // Should only have foreign key toggle calls
      expect(mockQueryRunner.query).toHaveBeenCalledTimes(2);
    });
  });

  describe('getDataSourceFromApp', () => {
    it('should get DataSource from app', () => {
      const mockDataSource = {} as DataSource;
      const mockApp = {
        get: jest.fn().mockReturnValue(mockDataSource),
      } as unknown as INestApplication;

      const result = getDataSourceFromApp(mockApp);

      expect(mockApp.get).toHaveBeenCalledWith(DataSource);
      expect(result).toBe(mockDataSource);
    });
  });

  describe('resetDatabase', () => {
    it('should call clearAllTables', async () => {
      const mockQueryRunner: Partial<QueryRunner> = {
        connect: jest.fn().mockResolvedValue(undefined),
        startTransaction: jest.fn().mockResolvedValue(undefined),
        query: jest.fn().mockResolvedValue(undefined),
        commitTransaction: jest.fn().mockResolvedValue(undefined),
        release: jest.fn().mockResolvedValue(undefined),
      };

      const mockDataSource = {
        createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
        entityMetadatas: [{ tableName: 'test' }],
      } as unknown as DataSource;

      await resetDatabase(mockDataSource);

      expect(mockQueryRunner.query).toHaveBeenCalledWith('DELETE FROM "test"');
    });
  });
});
