import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Submodule } from './submodule.entity';
import { CreateSubmoduleDto } from '../../dto/create-submodule.dto';
import { SubmoduleWithProgress } from './submodules.types';

@Injectable()
export class SubmoduleRepository extends TransactionalRepository(Submodule) {
  async findSubmodulesWithProgress(moduleId: number, userId: number) {
    return this.executeRawQuery<SubmoduleWithProgress[]>(
      `
        SELECT
            "s".*,
            ("s"."id" IN (SELECT "submoduleId" FROM "submodule_progress" WHERE "userId" = $1)) as "completed"
        FROM "submodule" "s"
        WHERE "s"."moduleId" = $2
    `,
      [userId, moduleId],
    );
  }

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
