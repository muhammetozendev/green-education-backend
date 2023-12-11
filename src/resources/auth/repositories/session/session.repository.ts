import { Injectable, NotFoundException } from '@nestjs/common';
import { Session } from './session.entity';
import { TransactionalRepository } from 'src/config/db/transactional-repository';

@Injectable()
export class SessionRepository extends TransactionalRepository(Session) {
  async terminateSession(id: string): Promise<void> {
    await this.getTypeOrmRepository().update(id, { isValid: false });
  }

  async test() {
    const result = await this.getTypeOrmRepository()
      .createQueryBuilder()
      .update(Session)
      .set({})
      .where('id = :id', { id: 1 })
      .returning('*')
      .execute();
  }
}
