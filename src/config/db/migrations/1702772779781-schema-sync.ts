import { MigrationInterface, QueryRunner } from "typeorm";

export class SchemaSync1702772779781 implements MigrationInterface {
    name = 'SchemaSync1702772779781'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "module_progress" ("id" SERIAL NOT NULL, "userId" integer, "moduleId" integer, CONSTRAINT "PK_29f00069652b2ea973d36e6db99" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "slide_progress" ("id" SERIAL NOT NULL, "userId" integer, "slideId" integer, CONSTRAINT "PK_a32aedf460c0d8005ec56588c90" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "submodule_progress" ("id" SERIAL NOT NULL, "userId" integer, "submoduleId" integer, CONSTRAINT "PK_e6321e7c2359aea31040a995494" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "module_progress" ADD CONSTRAINT "FK_98f1c5ca34a9ec9061a8becbfc6" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "module_progress" ADD CONSTRAINT "FK_ec5b24ea3c1adaa2e3cebb82fbd" FOREIGN KEY ("moduleId") REFERENCES "module"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "slide_progress" ADD CONSTRAINT "FK_65867a698155127c99ec184896f" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "slide_progress" ADD CONSTRAINT "FK_ef18d1161c49cdb0b7650674273" FOREIGN KEY ("slideId") REFERENCES "slide"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submodule_progress" ADD CONSTRAINT "FK_a6d2b032f32f54489f7f91f2d79" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "submodule_progress" ADD CONSTRAINT "FK_efed38f14924e74209436e28a74" FOREIGN KEY ("submoduleId") REFERENCES "submodule"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "submodule_progress" DROP CONSTRAINT "FK_efed38f14924e74209436e28a74"`);
        await queryRunner.query(`ALTER TABLE "submodule_progress" DROP CONSTRAINT "FK_a6d2b032f32f54489f7f91f2d79"`);
        await queryRunner.query(`ALTER TABLE "slide_progress" DROP CONSTRAINT "FK_ef18d1161c49cdb0b7650674273"`);
        await queryRunner.query(`ALTER TABLE "slide_progress" DROP CONSTRAINT "FK_65867a698155127c99ec184896f"`);
        await queryRunner.query(`ALTER TABLE "module_progress" DROP CONSTRAINT "FK_ec5b24ea3c1adaa2e3cebb82fbd"`);
        await queryRunner.query(`ALTER TABLE "module_progress" DROP CONSTRAINT "FK_98f1c5ca34a9ec9061a8becbfc6"`);
        await queryRunner.query(`DROP TABLE "submodule_progress"`);
        await queryRunner.query(`DROP TABLE "slide_progress"`);
        await queryRunner.query(`DROP TABLE "module_progress"`);
    }

}
