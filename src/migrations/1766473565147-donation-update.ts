import { MigrationInterface, QueryRunner } from 'typeorm';

export class DonationUpdate1766473565147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE donations
      ALTER COLUMN donor_name DROP NOT NULL,
      ALTER COLUMN donor_contact DROP NOT NULL,
      ALTER COLUMN donor_email DROP NOT NULL;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      UPDATE donations
      SET donor_name = 'Unknown'
      WHERE donor_name IS NULL;
    `);

    await queryRunner.query(`
      UPDATE donations
      SET donor_contact = '0000000000'
      WHERE donor_contact IS NULL;
    `);

    await queryRunner.query(`
      UPDATE donations
      SET donor_email = 'unknown@example.com'
      WHERE donor_email IS NULL;
    `);

    await queryRunner.query(`
      ALTER TABLE donations
      ALTER COLUMN donor_name SET NOT NULL,
      ALTER COLUMN donor_contact SET NOT NULL,
      ALTER COLUMN donor_email SET NOT NULL;
    `);
  }
}
