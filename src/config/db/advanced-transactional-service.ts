import { Injectable, OnModuleInit } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { TransactionManager } from './transaction-manager';

export type TransactionalCallback<T> = () => T;

@Injectable()
export class AdvancedTransactionalService implements OnModuleInit {
  private readonly als: AsyncLocalStorage<TransactionManager> =
    new AsyncLocalStorage();

  constructor(
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  onModuleInit() {}

  /**
   * Gets the transaction manager from the current context. Returns an error if no transaction is running.
   * @returns The transaction manager
   */
  getTransactionManager(): TransactionManager {
    return this.als.getStore();
  }

  /**
   * Runs the given operation in a transaction and makes sure to commit after everything is done.
   * @param cb Callback to execute in transaction
   * @returns The result of the callback
   */
  async run<T>(cb: TransactionalCallback<T>): Promise<T> {
    return await this.runInTransaction(cb, false);
  }

  /**
   * Runs the given operation in a transaction and makes sure to rollback after everything is done.
   * @param cb Callback to execute in transaction
   * @returns The result of the callback
   */
  async runForTest<T>(cb: TransactionalCallback<T>): Promise<T> {
    return await this.runInTransaction(cb, true);
  }

  private async runInTransaction<T>(
    cb: TransactionalCallback<T>,
    forTest: boolean,
  ): Promise<T> {
    let transactionManager = this.als.getStore();
    if (transactionManager) {
      return await cb();
    }

    transactionManager = new TransactionManager(this.dataSource);
    if (forTest) transactionManager.setRollbackOnly();
    await transactionManager.startTransaction();

    try {
      const result = await this.als.run(transactionManager, async () => {
        return await cb();
      });
      await transactionManager.completeTransaction();
      return result;
    } catch (e) {
      await transactionManager.rollbackTransaction();
      throw e;
    } finally {
      await transactionManager.release();
    }
  }
}
