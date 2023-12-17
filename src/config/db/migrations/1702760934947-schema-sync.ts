import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1702760934947 implements MigrationInterface {
    name = 'SchemaSync1702760934947'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submodule" DROP CONSTRAINT "FK_ff75d404e8c140be65b6a08e5d9"`);
        await queryRunner.query(`ALTER TABLE "submodule" ADD CONSTRAINT "FK_ff75d404e8c140be65b6a08e5d9" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submodule" DROP CONSTRAINT "FK_ff75d404e8c140be65b6a08e5d9"`);
        await queryRunner.query(`ALTER TABLE "submodule" ADD CONSTRAINT "FK_ff75d404e8c140be65b6a08e5d9" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

}
