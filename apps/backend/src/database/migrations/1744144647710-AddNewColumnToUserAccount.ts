import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddNewColumnToUserAccount1744144647710
  implements MigrationInterface
{
  name = 'AddNewColumnToUserAccount1744144647710';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "temporary_users_accounts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "account_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "FK_7fd8bd853db80b87a963e871ee3" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4e9c647a0544af036456e1d139d" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_users_accounts"("id", "account_id", "user_id") SELECT "id", "account_id", "user_id" FROM "users_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "users_accounts"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_users_accounts" RENAME TO "users_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_audit_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "transaction_id" varchar(255) NOT NULL, "account_id" integer NOT NULL, "entity" varchar(255), "entity_id" integer NOT NULL, "transaction_type" varchar(255) NOT NULL, "json" json NOT NULL, "user_id" integer NOT NULL, "ip_address" varchar(255), "user_agent" varchar(600), "timestamp" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0d25c7d5663afd2b4365caabeb2" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_audit_logs"("id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp") SELECT "id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp" FROM "audit_logs"`,
    );
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_audit_logs" RENAME TO "audit_logs"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_users_accounts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "account_id" integer NOT NULL, "user_id" integer NOT NULL, "role" varchar DEFAULT ('reader'), CONSTRAINT "FK_7fd8bd853db80b87a963e871ee3" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4e9c647a0544af036456e1d139d" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_users_accounts"("id", "account_id", "user_id") SELECT "id", "account_id", "user_id" FROM "users_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "users_accounts"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_users_accounts" RENAME TO "users_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_accounts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "description" text, "domain" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime DEFAULT (datetime('now')), "deleted_at" datetime, CONSTRAINT "UQ_45c846ceb13d7f89584affe3091" UNIQUE ("domain"), CONSTRAINT "UQ_2db43cdbf7bb862e577b5f540c8" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_accounts"("id", "name", "description", "domain", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "description", "domain", "created_at", "updated_at", "deleted_at" FROM "accounts"`,
    );
    await queryRunner.query(`DROP TABLE "accounts"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_accounts" RENAME TO "accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(500) NOT NULL, "profile_image" varchar(500), "status" varchar(20) NOT NULL, "provider_id" varchar(255), "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime DEFAULT (datetime('now')), "deleted_at" datetime, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_users"("id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at" FROM "users"`,
    );
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    await queryRunner.query(
      `CREATE TABLE "temporary_audit_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "transaction_id" varchar(255) NOT NULL, "account_id" integer NOT NULL, "entity" varchar(255), "entity_id" integer NOT NULL, "transaction_type" varchar(255) NOT NULL, "json" json NOT NULL, "user_id" integer NOT NULL, "ip_address" varchar(255), "user_agent" varchar(600), "timestamp" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0d25c7d5663afd2b4365caabeb2" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "temporary_audit_logs"("id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp") SELECT "id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp" FROM "audit_logs"`,
    );
    await queryRunner.query(`DROP TABLE "audit_logs"`);
    await queryRunner.query(
      `ALTER TABLE "temporary_audit_logs" RENAME TO "audit_logs"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "audit_logs" RENAME TO "temporary_audit_logs"`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "transaction_id" varchar(255) NOT NULL, "account_id" integer NOT NULL, "entity" varchar(255), "entity_id" integer NOT NULL, "transaction_type" varchar(255) NOT NULL, "json" json NOT NULL, "user_id" integer NOT NULL, "ip_address" varchar(255), "user_agent" varchar(600), "timestamp" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0d25c7d5663afd2b4365caabeb2" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "audit_logs"("id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp") SELECT "id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp" FROM "temporary_audit_logs"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_audit_logs"`);
    await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(500) NOT NULL, "profile_image" varchar(500), "status" varchar(20), "provider_id" varchar(255), "created_at" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" timestamp, "deleted_at" timestamp, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`,
    );
    await queryRunner.query(
      `INSERT INTO "users"("id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at" FROM "temporary_users"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_users"`);
    await queryRunner.query(
      `ALTER TABLE "accounts" RENAME TO "temporary_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "accounts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "description" text, "domain" varchar(255) NOT NULL, "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime, "deleted_at" datetime, CONSTRAINT "UQ_45c846ceb13d7f89584affe3091" UNIQUE ("domain"), CONSTRAINT "UQ_2db43cdbf7bb862e577b5f540c8" UNIQUE ("name"))`,
    );
    await queryRunner.query(
      `INSERT INTO "accounts"("id", "name", "description", "domain", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "description", "domain", "created_at", "updated_at", "deleted_at" FROM "temporary_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_accounts"`);
    await queryRunner.query(
      `ALTER TABLE "users_accounts" RENAME TO "temporary_users_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_accounts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "account_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "FK_7fd8bd853db80b87a963e871ee3" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4e9c647a0544af036456e1d139d" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "users_accounts"("id", "account_id", "user_id") SELECT "id", "account_id", "user_id" FROM "temporary_users_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_users_accounts"`);
    await queryRunner.query(
      `ALTER TABLE "audit_logs" RENAME TO "temporary_audit_logs"`,
    );
    await queryRunner.query(
      `CREATE TABLE "audit_logs" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "transaction_id" varchar(255) NOT NULL, "account_id" integer NOT NULL, "entity" varchar(255), "entity_id" integer NOT NULL, "transaction_type" varchar(255) NOT NULL, "json" json NOT NULL, "user_id" integer NOT NULL, "ip_address" varchar(255), "user_agent" varchar(600), "timestamp" timestamp NOT NULL DEFAULT (CURRENT_TIMESTAMP), CONSTRAINT "FK_bd2726fd31b35443f2245b93ba0" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_0d25c7d5663afd2b4365caabeb2" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "audit_logs"("id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp") SELECT "id", "transaction_id", "account_id", "entity", "entity_id", "transaction_type", "json", "user_id", "ip_address", "user_agent", "timestamp" FROM "temporary_audit_logs"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_audit_logs"`);
    await queryRunner.query(
      `ALTER TABLE "users_accounts" RENAME TO "temporary_users_accounts"`,
    );
    await queryRunner.query(
      `CREATE TABLE "users_accounts" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "account_id" integer NOT NULL, "user_id" integer NOT NULL, CONSTRAINT "UQ_d7470aa59518c58337362544e44" UNIQUE ("account_id", "user_id"), CONSTRAINT "FK_7fd8bd853db80b87a963e871ee3" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, CONSTRAINT "FK_4e9c647a0544af036456e1d139d" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION)`,
    );
    await queryRunner.query(
      `INSERT INTO "users_accounts"("id", "account_id", "user_id") SELECT "id", "account_id", "user_id" FROM "temporary_users_accounts"`,
    );
    await queryRunner.query(`DROP TABLE "temporary_users_accounts"`);
  }
}
