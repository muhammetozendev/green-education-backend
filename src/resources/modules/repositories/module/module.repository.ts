import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Module } from './module.entity';
import { CreateModuleDto } from '../../dto/create-module.dto';
import { ModuleWithProgress } from './module.types';

@Injectable()
export class ModuleRepository extends TransactionalRepository(Module) {
  async findModulesAndProgressByOrganization(
    userId: number,
    organizationId: number,
  ): Promise<ModuleWithProgress[]> {
    return await this.getEntityManager().query(
      `
        SELECT 
            "module".*, 
            ("module"."id" in (SELECT "moduleId" FROM "module_progress" where "userId" = $1)) AS "completed" 
        FROM "module" "module" 
        WHERE "module"."organizationId" = $2
        ORDER BY "module"."number" ASC;
      `,
      [userId, organizationId],
    );
  }

  async createAndReturn(data: CreateModuleDto): Promise<Module> {
    const result = await this.createQueryBuilder()
      .insert()
      .into(Module)
      .values({
        number: data.number,
        title: data.title,
        organization: { id: data.organizationId },
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }

  async fixModuleNumbersForInsertion(
    number: number,
    organizationId: number,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(Module)
      .set({ number: () => 'number + 1' })
      .where('organizationId = :organizationId', { organizationId })
      .andWhere('number >= :number', { number })
      .execute();
  }

  async fixModuleNumbersForDeletion(
    number: number,
    organizationId: number,
  ): Promise<void> {
    await this.createQueryBuilder()
      .update(Module)
      .set({ number: () => 'number - 1' })
      .where('organizationId = :organizationId', { organizationId })
      .andWhere('number > :number', { number })
      .execute();
  }
}
