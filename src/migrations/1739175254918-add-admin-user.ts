import { MigrationInterface, QueryRunner } from "typeorm";
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();
export class AddAdminUser1739175254918 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const username = process.env.ADMIN_USERNAME;
        const email = process.env.ADMIN_EMAIL;
        const plainPassword = process.env.ADMIN_PASSWORD;
        const hashedPassword = await bcrypt.hash(plainPassword, 10);

        const currentTimeUnix = Math.floor(Date.now() / 1000);

        await queryRunner.query(
            `INSERT INTO users (id, email, username, password, created_on) VALUES ($1, $2, $3, $4, $5)`,
            [
                'a87b8ae0-8f0f-4eab-8384-5031d3d9ec6f',
                email,
                username,
                hashedPassword,
                currentTimeUnix,
            ],
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
       await queryRunner.query(`DELETE FROM users WHERE email = $1`, ['admin@admin.com'])
    }

}
