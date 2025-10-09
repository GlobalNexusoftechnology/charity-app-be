import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class FamilyMember1760004938993 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'family_member',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          { name: 'userId', type: 'varchar' },
          { name: 'name', type: 'varchar' },
          { name: 'relation', type: 'varchar' },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('family_member');
  }
}
