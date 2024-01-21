import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1705863802973 implements MigrationInterface {
    name = 'SchemaSync1705863802973'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" ADD "quizId" integer`);
        await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "UQ_3ad47c4164123fd4c07021cfa9d" UNIQUE ("quizId")`);
        await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "FK_3ad47c4164123fd4c07021cfa9d" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "FK_3ad47c4164123fd4c07021cfa9d"`);
        await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "UQ_3ad47c4164123fd4c07021cfa9d"`);
        await queryRunner.query(`ALTER TABLE "module" DROP COLUMN "quizId"`);
    }

}
