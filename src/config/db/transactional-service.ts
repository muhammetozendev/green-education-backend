import { Injectable, Type } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStore } from './types/async-local-store.interface';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';

@Injectable()
export class TransactionalService {
  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
    private readonly als: AsyncLocalStorage<IAsyncLocalStore>,
  ) {}

  async run<T>(cb: () => T): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const entityManager = queryRunner.manager;

    try {
      const result = await this.als.run({ entityManager }, async () => {
        return await cb();
      });
      await queryRunner.commitTransaction();
      return;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }
}
