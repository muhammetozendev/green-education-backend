import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1703762882936 implements MigrationInterface {
    name = 'SchemaSync1703762882936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "quiz_progress" ("id" SERIAL NOT NULL, "userId" integer, "quizId" integer, CONSTRAINT "UQ_4b38dbbe0804af831fb5a3b9238" UNIQUE ("userId", "quizId"), CONSTRAINT "PK_9724319be4d6d3b4dbd8507a9d3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "quiz_progress" ADD CONSTRAINT "FK_7185421408da2cce9e0fcf54426" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "quiz_progress" ADD CONSTRAINT "FK_eab3375e3d937bacae2a9fb7c02" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_progress" DROP CONSTRAINT "FK_eab3375e3d937bacae2a9fb7c02"`);
        await queryRunner.query(`ALTER TABLE "quiz_progress" DROP CONSTRAINT "FK_7185421408da2cce9e0fcf54426"`);
        await queryRunner.query(`DROP TABLE "quiz_progress"`);
    }

}
