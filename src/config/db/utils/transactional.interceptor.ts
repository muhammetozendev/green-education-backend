import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable, catchError, concatMap, finalize } from 'rxjs';
import { DataSource } from 'typeorm';
import { IAsyncLocalStore } from '../types/async-local-store.interface';

@Injectable()
export class TransactionalInterceptor implements NestInterceptor {
  constructor(
    private dataSource: DataSource,
    private als: AsyncLocalStorage<IAsyncLocalStore>,
  ) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Promise<Observable<any>> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    const store: IAsyncLocalStore = {
      entityManager: queryRunner.manager,
    };

    return this.als.run(store, () => {
      return next.handle().pipe(
        concatMap(async (data) => {
          await queryRunner.commitTransaction();
          return data;
        }),
        catchError(async (e) => {
          await queryRunner.rollbackTransaction();
          throw e;
        }),
        finalize(async () => {
          await queryRunner.release();
        }),
      );
    });
  }
}
