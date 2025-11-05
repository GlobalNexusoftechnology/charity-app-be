import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddScheduledPushAtToUpdates1762355870690
  implements MigrationInterface
{
  name = 'AddScheduledPushAtToUpdates1762355870690';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      'updates',
      new TableColumn({
        name: 'scheduledPushAt',
        type: 'timestamptz',
        isNullable: true,
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('updates', 'scheduledPushAt');
  }
}
