import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableUnique } from "typeorm";

export class CreateAccountsUsersTable1742921564029 implements MigrationInterface {
    private table = new Table({
        name: 'accounts_users',
        columns: [
            {
                name: 'account_id',
                type: 'integer',
                isNullable: false,
            },
            {
                name: 'user_id',
                type: 'integer',
                isNullable: false,
            },
        ],
    });

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(this.table);
        await queryRunner.createForeignKeys(
            'accounts_users',
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
        await queryRunner.createUniqueConstraint('accounts_users', new TableUnique({ columnNames: ['account_id', 'user_id'] }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable(this.table);
    }

}
