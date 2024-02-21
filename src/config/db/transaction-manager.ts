import { DataSource, QueryRunner } from 'typeorm';

export class TransactionManager {
  private queryRunner: QueryRunner;
  private isRunning = false;
  private rollbackOnly = false;

  constructor(private dataSource: DataSource) {}

  public async startTransaction() {
    this.queryRunner = this.dataSource.createQueryRunner();
    await this.queryRunner.connect();
    await this.queryRunner.startTransaction();
    this.isRunning = true;
  }

  public async completeTransaction() {
    if (this.rollbackOnly) {
      await this.queryRunner.rollbackTransaction();
    } else {
      await this.queryRunner.commitTransaction();
    }
    this.isRunning = false;
  }

  public async commitTransaction() {
    if (!this.isRunning) {
      throw new Error('No transaction running');
    }
    await this.queryRunner.commitTransaction();
    this.isRunning = false;
  }

  public async rollbackTransaction() {
    if (!this.isRunning) {
      throw new Error('No transaction running');
    }
    await this.queryRunner.rollbackTransaction();
    this.isRunning = false;
  }

  public async release() {
    await this.queryRunner.release();
  }

  public setRollbackOnly() {
    this.rollbackOnly = true;
  }

  public isRollbackOnly() {
    return this.rollbackOnly;
  }

  public getQueryRunner() {
    return this.queryRunner;
  }

  public getRepository<T>(entity: new () => T) {
    return this.queryRunner.manager.getRepository(entity);
  }
}
