import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateAccountsTable1742919331481 implements MigrationInterface {
    private table = new Table({
        name: 'accounts',
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
                isUnique: true,
                isNullable: false,
            },
            {
                name: 'description',
                type: 'text',
                isNullable: true,
            },
            {
                name: 'domain',
                type: 'varchar',
                length: '255',
                isUnique: true,
                isNullable: false,
            },
            {
                name: 'created_at',
                type: 'datetime',
                isNullable: false,
                default: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'updated_at',
                type: 'datetime',
                isNullable: true,
                onUpdate: 'CURRENT_TIMESTAMP',
            },
            {
                name: 'deleted_at',
                type: 'datetime',
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
