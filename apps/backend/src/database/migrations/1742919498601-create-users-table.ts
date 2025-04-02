import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateUsersTable1742919498601 implements MigrationInterface {
    private table = new Table({
        name: 'users',
        columns: [
            {
                name: 'id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            },
            {
                name: 'name',
                type: 'varchar',
                length: '255',
                isNullable: false,
            },
            {
                name: 'email',
                type: 'varchar',
                length: '500',
                isUnique: true,
                isNullable: false,
            },
            {
                name: 'profile_image',
                type: 'varchar',
                length: '500',
                isNullable: true,
            },
            {
                name: 'status',
                type: 'varchar',
                length: '20',
                isNullable: true,
            },
            {
                name: 'provider_id',
                type: 'varchar',
                length: '255',
                isNullable: true,
            },
            {
                name: 'created_at',
                type: 'TIMESTAMP',
                isNullable: false,
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updated_at',
                type: 'TIMESTAMP',
                isNullable: true,
                onUpdate: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'deleted_at',
                type: 'TIMESTAMP',
                isNullable: true,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }

}
