import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsSuperAdminUsers1744151643097 implements MigrationInterface {
    name = 'AddIsSuperAdminUsers1744151643097'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "temporary_users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(500) NOT NULL, "profile_image" varchar(500), "status" varchar(20) NOT NULL, "provider_id" varchar(255), "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime DEFAULT (datetime('now')), "deleted_at" datetime, "is_super_admin" boolean NOT NULL DEFAULT (0), CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "temporary_users"("id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at" FROM "users"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`ALTER TABLE "temporary_users" RENAME TO "users"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME TO "temporary_users"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar(255) NOT NULL, "email" varchar(500) NOT NULL, "profile_image" varchar(500), "status" varchar(20) NOT NULL, "provider_id" varchar(255), "created_at" datetime NOT NULL DEFAULT (CURRENT_TIMESTAMP), "updated_at" datetime DEFAULT (datetime('now')), "deleted_at" datetime, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"))`);
        await queryRunner.query(`INSERT INTO "users"("id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at") SELECT "id", "name", "email", "profile_image", "status", "provider_id", "created_at", "updated_at", "deleted_at" FROM "temporary_users"`);
        await queryRunner.query(`DROP TABLE "temporary_users"`);
    }

}
