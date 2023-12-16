import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1702725660871 implements MigrationInterface {
    name = 'SchemaSync1702725660871'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "session" ("id" character varying NOT NULL, "issuedAt" TIMESTAMP WITH TIME ZONE NOT NULL, "isValid" boolean NOT NULL, "refreshToken" character varying(1000) NOT NULL, "userId" integer, CONSTRAINT "PK_f55da76ac1c3ac420f444d2ff11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8d4c5daf230e32347f71ea7bca" ON "session" ("refreshToken") `);
        await queryRunner.query(`CREATE TABLE "slide" ("id" SERIAL NOT NULL, "content" text array NOT NULL, "imageUrl" text NOT NULL, "submoduleId" integer, CONSTRAINT "PK_61701f20afc899f757f86da067b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "answer" ("id" SERIAL NOT NULL, "isCorrect" boolean NOT NULL, "userId" integer, "questionId" integer, "optionId" integer, CONSTRAINT "PK_9232db17b63fb1e94f97e5c224f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "option" ("id" SERIAL NOT NULL, "option" character varying NOT NULL, "isCorrect" boolean NOT NULL, "questionId" integer, CONSTRAINT "PK_e6090c1c6ad8962eea97abdbe63" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question" ("id" SERIAL NOT NULL, "question" character varying NOT NULL, "quizId" integer, CONSTRAINT "PK_21e5786aa0ea704ae185a79b2d5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "quiz" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, CONSTRAINT "PK_422d974e7217414e029b3e641d0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submodule" ("id" SERIAL NOT NULL, "number" integer NOT NULL, "title" character varying NOT NULL, "moduleId" integer, "quizId" integer, CONSTRAINT "REL_ff75d404e8c140be65b6a08e5d" UNIQUE ("quizId"), CONSTRAINT "PK_9425a01f9ef6271d6d0b8758f3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "module" ("id" SERIAL NOT NULL, "title" character varying NOT NULL, "number" integer NOT NULL, "organizationId" integer, CONSTRAINT "PK_0e20d657f968b051e674fbe3117" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "organization" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_472c1f99a32def1b0abb219cd67" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_role_enum" AS ENUM('ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "email" character varying NOT NULL, "name" character varying NOT NULL, "lastName" character varying NOT NULL, "password" character varying(60) NOT NULL, "role" "public"."user_role_enum" NOT NULL, "organizationId" integer, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "session" ADD CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "slide" ADD CONSTRAINT "FK_620c5dbaf13372c340b19c1309c" FOREIGN KEY ("submoduleId") REFERENCES "submodule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_5a26907efcd78a856c8af5829e6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "answer" ADD CONSTRAINT "FK_996935e4981a0cdf304cebc4bf5" FOREIGN KEY ("optionId") REFERENCES "option"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "option" ADD CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "question" ADD CONSTRAINT "FK_4959a4225f25d923111e54c7cd2" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submodule" ADD CONSTRAINT "FK_acef108e405ea8e4e0790649b6f" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submodule" ADD CONSTRAINT "FK_ff75d404e8c140be65b6a08e5d9" FOREIGN KEY ("quizId") REFERENCES "quiz"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module" ADD CONSTRAINT "FK_340bdbc7226ce0039d35a8054aa" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "FK_dfda472c0af7812401e592b6a61" FOREIGN KEY ("organizationId") REFERENCES "organization"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "FK_dfda472c0af7812401e592b6a61"`);
        await queryRunner.query(`ALTER TABLE "module" DROP CONSTRAINT "FK_340bdbc7226ce0039d35a8054aa"`);
        await queryRunner.query(`ALTER TABLE "submodule" DROP CONSTRAINT "FK_ff75d404e8c140be65b6a08e5d9"`);
        await queryRunner.query(`ALTER TABLE "submodule" DROP CONSTRAINT "FK_acef108e405ea8e4e0790649b6f"`);
        await queryRunner.query(`ALTER TABLE "question" DROP CONSTRAINT "FK_4959a4225f25d923111e54c7cd2"`);
        await queryRunner.query(`ALTER TABLE "option" DROP CONSTRAINT "FK_b94517ccffa9c97ebb8eddfcae3"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_996935e4981a0cdf304cebc4bf5"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_a4013f10cd6924793fbd5f0d637"`);
        await queryRunner.query(`ALTER TABLE "answer" DROP CONSTRAINT "FK_5a26907efcd78a856c8af5829e6"`);
        await queryRunner.query(`ALTER TABLE "slide" DROP CONSTRAINT "FK_620c5dbaf13372c340b19c1309c"`);
        await queryRunner.query(`ALTER TABLE "session" DROP CONSTRAINT "FK_3d2f174ef04fb312fdebd0ddc53"`);
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TYPE "public"."user_role_enum"`);
        await queryRunner.query(`DROP TABLE "organization"`);
        await queryRunner.query(`DROP TABLE "module"`);
        await queryRunner.query(`DROP TABLE "submodule"`);
        await queryRunner.query(`DROP TABLE "quiz"`);
        await queryRunner.query(`DROP TABLE "question"`);
        await queryRunner.query(`DROP TABLE "option"`);
        await queryRunner.query(`DROP TABLE "answer"`);
        await queryRunner.query(`DROP TABLE "slide"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8d4c5daf230e32347f71ea7bca"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
