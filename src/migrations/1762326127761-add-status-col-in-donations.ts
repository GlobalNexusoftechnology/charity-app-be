import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddStatusColumnToDonations1762326127761
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'donations',
      new TableColumn({
        name: 'status',
        type: 'enum',
        enum: ['PENDING', 'SUCCESS', 'FAILED', 'CANCELLED'],
        default: `'PENDING'`,
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('donations', 'status');
  }
}
