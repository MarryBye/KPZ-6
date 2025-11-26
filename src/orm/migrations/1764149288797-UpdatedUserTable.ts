import {MigrationInterface, QueryRunner} from "typeorm";

export class UpdatedUserTable1764149288797 implements MigrationInterface {
    name = 'UpdatedUserTable1764149288797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "FK_e93de04a3666c58ed6d4e88bd5d"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP CONSTRAINT "REL_e93de04a3666c58ed6d4e88bd5"
        `);
        await queryRunner.query(`
            ALTER TABLE "users" DROP COLUMN "car_id"
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD "car_id" integer
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "REL_e93de04a3666c58ed6d4e88bd5" UNIQUE ("car_id")
        `);
        await queryRunner.query(`
            ALTER TABLE "users"
            ADD CONSTRAINT "FK_e93de04a3666c58ed6d4e88bd5d" FOREIGN KEY ("car_id") REFERENCES "cars"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

}
