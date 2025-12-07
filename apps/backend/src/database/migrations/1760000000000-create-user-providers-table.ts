import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUserProvidersTable1760000000000
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the user_providers table
    await queryRunner.query(`
      CREATE TABLE "user_providers" (
        "id" varchar PRIMARY KEY NOT NULL,
        "user_id" varchar NOT NULL,
        "provider_name" varchar(50) NOT NULL,
        "provider_user_id" varchar(255) NOT NULL,
        "created_at" datetime NOT NULL DEFAULT (datetime('now')),
        CONSTRAINT "FK_user_providers_user" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE CASCADE
      )
    `);

    // Create indexes
    await queryRunner.query(`
      CREATE UNIQUE INDEX "idx_user_providers_lookup" ON "user_providers" ("provider_name", "provider_user_id")
    `);

    await queryRunner.query(`
      CREATE INDEX "idx_user_providers_user_id" ON "user_providers" ("user_id")
    `);

    // Migrate existing provider_ids data to the new table
    // This reads the comma-separated provider_ids and inserts them into user_providers
    const users = await queryRunner.query(`
      SELECT id, provider_ids FROM users WHERE provider_ids IS NOT NULL AND provider_ids != ''
    `);

    for (const user of users) {
      const providerIds = user.provider_ids
        .split(',')
        .filter((id: string) => id.trim());

      for (const providerId of providerIds) {
        const trimmed = providerId.trim();
        const separatorIndex = trimmed.indexOf('|');

        let providerName: string;
        let providerUserId: string;

        if (separatorIndex === -1) {
          providerName = 'unknown';
          providerUserId = trimmed;
        } else {
          providerName = trimmed.substring(0, separatorIndex);
          providerUserId = trimmed.substring(separatorIndex + 1);
        }

        // Generate a UUID for the new record
        const uuid = this.generateUUID();

        await queryRunner.query(
          `
          INSERT OR IGNORE INTO "user_providers" ("id", "user_id", "provider_name", "provider_user_id")
          VALUES (?, ?, ?, ?)
        `,
          [uuid, user.id, providerName, providerUserId],
        );
      }
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX IF EXISTS "idx_user_providers_lookup"`);
    await queryRunner.query(
      `DROP INDEX IF EXISTS "idx_user_providers_user_id"`,
    );

    // Drop table
    await queryRunner.query(`DROP TABLE IF EXISTS "user_providers"`);
  }

  private generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      },
    );
  }
}
