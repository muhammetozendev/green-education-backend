import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Module } from './module.entity';
import { CreateModuleDto } from '../../dto/create-module.dto';

@Injectable()
export class ModuleRepository extends TransactionalRepository(Module) {
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
