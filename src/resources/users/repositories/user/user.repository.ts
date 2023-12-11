import { Injectable } from '@nestjs/common';
import { User } from './user.entity';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { DeepPartial } from 'typeorm';

@Injectable()
export class UserRepository extends TransactionalRepository(User) {
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
