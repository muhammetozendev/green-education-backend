import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Submodule } from './submodule.entity';
import { CreateSubmoduleDto } from '../../dto/create-submodule.dto';

@Injectable()
export class SubmoduleRepository extends TransactionalRepository(Submodule) {
  async fixSubmoduleNumbersForInsertion(moduleId: number, number: number) {
    await this.createQueryBuilder()
      .update(Submodule)
      .set({
        number: () => 'number + 1',
      })
      .where('moduleId = :moduleId', { moduleId })
      .andWhere('number >= :number', { number })
      .execute();
  }

  async fixSubmoduleNumbersForDeletion(moduleId: number, number: number) {
    await this.createQueryBuilder()
      .update(Submodule)
      .set({
        number: () => 'number - 1',
      })
      .where('moduleId = :moduleId', { moduleId })
      .andWhere('number > :number', { number })
      .execute();
  }

  async createAndReturn(data: CreateSubmoduleDto): Promise<Submodule> {
    const result = await this.createQueryBuilder()
      .insert()
      .into(Submodule)
      .values({
        number: data.number,
        title: data.title,
        module: { id: data.moduleId },
        ...(data.quizId && { quiz: { id: data.quizId } }),
      })
      .returning('*')
      .execute();

    return result.raw[0];
  }
}
