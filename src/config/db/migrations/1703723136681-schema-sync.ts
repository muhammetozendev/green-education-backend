import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1703723136681 implements MigrationInterface {
    name = 'SchemaSync1703723136681'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "attempt" ("id" SERIAL NOT NULL, "total" integer NOT NULL, "correct" integer NOT NULL, "incorrect" integer NOT NULL, "skipped" integer NOT NULL, "score" integer NOT NULL, "userId" integer, "quizId" integer, CONSTRAINT "PK_5f822b29b3128d1c65d3d6c193d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_dd8844876037b478f5bb859512e" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "attempt" ADD CONSTRAINT "FK_cd743cd09c8f87b23da1c770531" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_cd743cd09c8f87b23da1c770531"`);
        await queryRunner.query(`ALTER TABLE "attempt" DROP CONSTRAINT "FK_dd8844876037b478f5bb859512e"`);
        await queryRunner.query(`DROP TABLE "attempt"`);
    }

}
