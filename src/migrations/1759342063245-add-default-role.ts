import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class AddDefaultRole1759342063245 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Insert default roles
    await queryRunner.query(`
      INSERT INTO roles (id, name, permissions, created_on, deleted)
      VALUES
      (gen_random_uuid(), 'admin', ARRAY['all'], extract(epoch from now())::bigint, false),
      (gen_random_uuid(), 'subscriber', ARRAY['read'], extract(epoch from now())::bigint, false);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('roles');
  }
}
