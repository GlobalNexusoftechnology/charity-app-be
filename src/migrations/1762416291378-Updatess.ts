import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Updatess1762416291378 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'updates',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            generationStrategy: 'uuid',
            isGenerated: true,
          },
          {
            name: 'title',
            type: 'varchar',
            length: '255',
          },
          {
            name: 'description',
            type: 'text',
          },
          {
            name: 'type',
            type: 'enum',
            enum: [
              'announcement',
              'maintenance',
              'feature',
              'bug_fix',
              'general',
            ],
            default: "'general'",
          },
          {
            name: 'priority',
            type: 'enum',
            enum: ['low', 'medium', 'high', 'urgent'],
            default: "'medium'",
          },
          {
            name: 'isActive',
            type: 'boolean',
            default: true,
          },
          {
            name: 'linkUrl',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'publishedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'expiresAt',
            type: 'timestamp',
            isNullable: true,
          },
          {
            name: 'createdAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updatedAt',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            onUpdate: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'frequency',
            type: 'enum',
            enum: ['none', 'daily', 'weekly', 'monthly'], // add the values you expect
            default: "'none'",
          },
          {
            name: 'scheduledPushAt',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'frequency',
            type: 'enum',
            enum: [
              'none',
              'daily',
              'weekly',
              'biweekly',
              'monthly',
              'quarterly',
            ],
            default: `'none'`,
            isNullable: false,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('updates');
  }
}
