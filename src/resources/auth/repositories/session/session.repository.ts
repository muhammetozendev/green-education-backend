import { Injectable, NotFoundException } from '@nestjs/common';
import { IRepository } from 'src/common/types/repository.interface';
import { Session } from './session.entity';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStore } from 'src/config/db/types/async-local-store.interface';
import { DataSource } from 'typeorm';
import { TransactionalRepository } from 'src/config/db/abstract-repository';

@Injectable()
export class SessionRepository extends TransactionalRepository<Session> {
  constructor(ds: DataSource, als: AsyncLocalStorage<IAsyncLocalStore>) {
    super(ds, als, Session);
  }

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
