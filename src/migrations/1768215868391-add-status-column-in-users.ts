import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusColumnToUsers1768215868391 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'users',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['ACTIVE', 'INACTIVE'], // must match UserStatus enum
        default: `'ACTIVE'`,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('users', 'status');
  }
}
