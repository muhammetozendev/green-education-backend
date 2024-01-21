import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1703724143448 implements MigrationInterface {
    name = 'SchemaSync1703724143448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP COLUMN "createdAt"`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD "createdAt" TIMESTAMP NOT NULL DEFAULT now()`);
    }

}
