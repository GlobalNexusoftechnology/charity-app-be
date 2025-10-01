import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class Donations1758104762595 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'donations',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'donor_name',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'donor_email',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'donor_contact',
            type: 'varchar',
            length: '15',
            isNullable: false,
          },
          {
            name: 'amount',
            type: 'int',
            isNullable: false,
          },
          {
            name: 'currency',
            type: 'varchar',
            length: '3',
            isNullable: false,
            default: "'INR'",
          },
          {
            name: 'user_id',
            type: 'uuid',
            isNullable: true,
          },
          {
            name: 'razorpay_payment_id',
            type: 'varchar',
            length: '100',
            isNullable: true,
          },
          {
            name: 'razorpay_order_id',
            type: 'varchar',
            length: '100',
            isNullable: false,
          },
          {
            name: 'razorpay_signature',
            type: 'varchar',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'CURRENT_TIMESTAMP',
            isNullable: false,
          },
        ],
        foreignKeys: [
          {
            columnNames: ['user_id'],
            referencedTableName: 'users',
            referencedColumnNames: ['id'],
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
          },
        ],
      }),
      true,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('donations');
  }
}
