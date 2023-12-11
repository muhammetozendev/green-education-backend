import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { TransactionalRepository } from 'src/config/db/abstract-repository';
import { DataSource, DeepPartial } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStore } from 'src/config/db/types/async-local-store.interface';

@Injectable()
export class UserRepository extends TransactionalRepository<User> {
  constructor(ds: DataSource, als: AsyncLocalStorage<IAsyncLocalStore>) {
    super(ds, als, User);
  }

  async updateAndReturn(id: number, data: DeepPartial<User>): Promise<User> {
    const result = await this.getTypeOrmRepository()
      .createQueryBuilder()
      .update(User)
      .set(data)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    return result.raw[0];
  }
}
