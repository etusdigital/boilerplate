import { DataSource } from 'typeorm';
import { INestApplication } from '@nestjs/common';

/**
 * Database helper utilities for testing.
 * Provides setup, teardown, and cleanup operations for test databases.
 */

/**
 * Create a test-specific DataSource configuration
 */
export function createTestDataSource(): DataSource {
  return new DataSource({
    type: 'sqlite',
    database: ':memory:',
    synchronize: true,
    dropSchema: true,
    entities: ['src/**/*.entity.ts'],
    logging: false,
  });
}

/**
 * Setup test database connection
 */
export async function setupTestDatabase(dataSource: DataSource): Promise<void> {
  if (!dataSource.isInitialized) {
    await dataSource.initialize();
  }
}

/**
 * Teardown test database connection
 */
export async function teardownTestDatabase(
  dataSource: DataSource,
): Promise<void> {
  if (dataSource.isInitialized) {
    await dataSource.destroy();
  }
}

/**
 * Clear all data from specified tables
 */
export async function clearTables(
  dataSource: DataSource,
  tables: string[],
): Promise<void> {
  const queryRunner = dataSource.createQueryRunner();

  try {
    await queryRunner.connect();
    await queryRunner.startTransaction();

    // Disable foreign key checks for SQLite
    await queryRunner.query('PRAGMA foreign_keys = OFF');

    for (const table of tables) {
      await queryRunner.query(`DELETE FROM "${table}"`);
    }

    // Re-enable foreign key checks
    await queryRunner.query('PRAGMA foreign_keys = ON');

    await queryRunner.commitTransaction();
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}

/**
 * Clear all tables in the database
 */
export async function clearAllTables(dataSource: DataSource): Promise<void> {
  const entities = dataSource.entityMetadatas;
  const tableNames = entities.map((entity) => entity.tableName);
  await clearTables(dataSource, tableNames);
}

/**
 * Get DataSource from NestJS application
 */
export function getDataSourceFromApp(app: INestApplication): DataSource {
  return app.get(DataSource);
}

/**
 * Reset database to clean state (useful between tests)
 */
export async function resetDatabase(dataSource: DataSource): Promise<void> {
  await clearAllTables(dataSource);
}
