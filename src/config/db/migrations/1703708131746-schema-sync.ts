import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1703708131746 implements MigrationInterface {
    name = 'SchemaSync1703708131746'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "UQ_1947c275d6180c121fe2093682c" UNIQUE ("userId", "questionId")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "UQ_1947c275d6180c121fe2093682c"`);
    }

}
