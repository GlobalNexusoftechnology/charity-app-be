import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddFrequencyColumnToUpdates1762359466132
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'updates',
      new TableColumn({
        name: 'frequency',
        type: 'enum',
        enum: ['none', 'daily', 'weekly', 'biweekly', 'monthly', 'quarterly'],
        default: `'none'`,
        isNullable: false,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('updates', 'frequency');
  }
}
