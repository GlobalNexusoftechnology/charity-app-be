import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPermissionColumnToRoles1739773078155 implements MigrationInterface {
    name = 'AddPermissionColumnToRoles1739773078155'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.addColumn(
            "roles",
            new TableColumn({
                name: "permissions",
                type: "text",
                isArray: true,
                isNullable: false,
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn("roles", "new_permission");
    }
}