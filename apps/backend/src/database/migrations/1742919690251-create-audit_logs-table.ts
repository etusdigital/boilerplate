import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateAuditLogsTable1742919690251 implements MigrationInterface {
    private table = new Table({
        name: 'audit_logs',
        columns: [
            {
                name: 'id',
                type: 'integer',
                isPrimary: true,
                isGenerated: true,
                generationStrategy: 'increment',
            },
            {
                name: 'transaction_id',
                type: 'varchar',
                length: '255',
                isNullable: false,
            },
            {
                name: 'account_id',
                type: 'integer',
                isNullable: false,
            },
            {
                name: 'entity',
                type: 'varchar',
                length: '255',
                isNullable: true,
            },
            {
                name: 'entity_id',
                type: 'integer',
                isNullable: false,
            },
            {
                name: 'transaction_type',
                type: 'varchar',
                length: '255',
                isNullable: false,
            },
            {
                name: 'json',
                type: 'json',
                isNullable: false,
            },
            {
                name: 'user_id',
                type: 'integer',
                isNullable: false,
            },
            {
                name: 'ip_address',
                type: 'varchar',
                length: '255',
                isNullable: true,
            },
            {
                name: 'user_agent',
                type: 'varchar',
                length: '600',
                isNullable: true,
            },
            {
                name: 'timestamp',
                type: 'TIMESTAMP',
                isNullable: false,
                default: 'CURRENT_TIMESTAMP',
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
        await queryRunner.createForeignKeys(
            'audit_logs',
            [
                new TableForeignKey({
                    columnNames: ['account_id'],
                    referencedTableName: 'accounts',
                    referencedColumnNames: ['id']
                }),
                new TableForeignKey({
                    columnNames: ['user_id'],
                    referencedTableName: 'users',
                    referencedColumnNames: ['id']
                })
            ]
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }

}
