import { Injectable } from '@nestjs/common';
import { Session } from './session.entity';
import { TransactionalRepository } from 'src/config/db/transactional-repository';

@Injectable()
export class SessionRepository extends TransactionalRepository(Session) {
  async terminateSession(id: string): Promise<void> {
    await this.getTypeOrmRepository().update(id, { isValid: false });
  }
}
