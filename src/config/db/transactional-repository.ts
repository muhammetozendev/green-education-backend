import { AsyncLocalStorage } from 'async_hooks';
import {
  ObjectId,
  ObjectLiteral,
  DataSource,
  EntityManager,
  Repository,
  QueryRunner,
  FindManyOptions,
  FindOptionsWhere,
  FindOneOptions,
  DeepPartial,
  SaveOptions,
} from 'typeorm';
import { PickKeysByType } from 'typeorm/common/PickKeysByType';
import { UpsertOptions } from 'typeorm/repository/UpsertOptions';
import { IAsyncLocalStore } from './types/async-local-store.interface';
import { IPagination } from './types/pagination.interface';
import { Injectable, Type } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';

type IdType =
  | number
  | string
  | ObjectId
  | Date
  | number[]
  | string[]
  | ObjectId[]
  | Date[];

export function TransactionalRepository<T extends ObjectLiteral>(
  EntityClass: Type<T>,
) {
  @Injectable()
  class TransactionalRepositoryClass {
    constructor(
      @InjectDataSource()
      public dataSource: DataSource,
      public als: AsyncLocalStorage<IAsyncLocalStore>,
    ) {}

    /** Retrieve the transactional entity manager optionally specifying a connection name. If no connection name is specified, the default connection's entity manager is returned */
    getEntityManager(): EntityManager {
      return this.als.getStore()?.entityManager ?? this.dataSource.manager;
    }

    /** Get native typeorm repository */
    getTypeOrmRepository(): Repository<T> {
      let manager = this.getEntityManager();
      return manager.getRepository(EntityClass);
    }

    /** Create query builder */
    createQueryBuilder(alias?: string, queryRunner?: QueryRunner) {
      return this.getTypeOrmRepository().createQueryBuilder(alias, queryRunner);
    }

    /** Return multiple records */
    async find(options?: FindManyOptions<T>) {
      return await this.getTypeOrmRepository()
        .createQueryBuilder()
        .setFindOptions(options ?? {})
        .getMany();
    }

    /** Return multiple records */
    async findBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
      return await this.find({
        where,
      });
    }

    /** Return multiple records with pagination */
    async findWithPagination(
      limit: number,
      page: number,
      options?: FindManyOptions<T>,
    ): Promise<IPagination<T>> {
      const data = await this.getTypeOrmRepository()
        .createQueryBuilder()
        .setFindOptions(options ?? {})
        .skip((page - 1) * limit)
        .take(limit)
        .getMany();

      const count = await this.getTypeOrmRepository()
        .createQueryBuilder()
        .setFindOptions(options ?? {})
        .getCount();

      return {
        count,
        pageCount: Math.ceil(count / limit),
        currentPage: page,
        limit,
        data,
      };
    }

    /** Find one record */
    async findOne(options: FindOneOptions<T>) {
      return await this.getTypeOrmRepository()
        .createQueryBuilder()
        .setFindOptions(options)
        .getOne();
    }

    /** Find one record or fail */
    async findOneOrFail(options: FindOneOptions<T>, error: Error) {
      const entity = await this.getTypeOrmRepository()
        .createQueryBuilder()
        .setFindOptions(options)
        .getOne();

      if (!entity) {
        throw error;
      }
      return entity;
    }

    /** Find one record */
    async findOneBy(where: FindOptionsWhere<T> | FindOptionsWhere<T>[]) {
      return await this.findOne({
        where,
      });
    }

    /** Find one record or fail */
    async findOneByOrFail(
      where: FindOptionsWhere<T> | FindOptionsWhere<T>[],
      error: Error,
    ) {
      return await this.findOneOrFail(
        {
          where,
        },
        error,
      );
    }

    /** Preload an entity using typeorm preload method */
    async preload(entity: DeepPartial<T>): Promise<T> {
      return await this.getTypeOrmRepository().preload(entity);
    }

    /** Insert record(s). Unlike save, it attempts to insert without checking if entity exists and ingores cascades */
    async insert(entity: DeepPartial<T>): Promise<T>;
    async insert(entity: DeepPartial<T>[]): Promise<T[]>;
    async insert(
      entity: DeepPartial<T> | Array<DeepPartial<T>>,
    ): Promise<T | T[]> {
      if (entity instanceof Array) {
        await this.getTypeOrmRepository().insert(entity);
        return entity as T[];
      } else {
        await this.getTypeOrmRepository().insert(entity);
        return entity as T;
      }
    }

    /** Creates entity/entities without saving them in DB */
    create(entity: DeepPartial<T>): T;
    create(entity: DeepPartial<T>[]): T[];
    create(entity: DeepPartial<T> | DeepPartial<T>[]): T | T[] {
      if (entity instanceof Array) {
        return this.getTypeOrmRepository().create(entity);
      } else {
        return this.getTypeOrmRepository().create(entity);
      }
    }

    /** Calls TypeOrm save() method */
    async save(
      entity: DeepPartial<T>[],
      saveOptions?: SaveOptions,
    ): Promise<T[]>;
    async save(entity: DeepPartial<T>, saveOptions?: SaveOptions): Promise<T>;
    async save(
      entity: DeepPartial<T> | Array<DeepPartial<T>>,
      saveOptions?: SaveOptions,
    ) {
      if (!saveOptions) {
        saveOptions = { transaction: false };
      } else {
        saveOptions.transaction = false;
      }
      if (entity instanceof Array) {
        return await this.getTypeOrmRepository().save(entity, saveOptions);
      } else {
        return await this.getTypeOrmRepository().save(entity, saveOptions);
      }
    }

    /** Updates given entity/entities */
    async update(
      id: IdType | FindOptionsWhere<T>,
      entity: DeepPartial<T>,
      error?: Error,
    ) {
      const res = await this.getTypeOrmRepository().update(id, entity);
      if (res.affected === 0 && error) {
        throw error;
      }
    }

    /** Upserts record(s) */
    async upsert(
      entity: DeepPartial<T> | DeepPartial<T>[],
      conflictPaths: string[] | UpsertOptions<T>,
    ) {
      await this.getTypeOrmRepository().upsert(entity, conflictPaths);
    }

    /** Deletes record(s) */
    async delete(id: IdType | FindOptionsWhere<T>, error?: Error) {
      const deleteResult = await this.getTypeOrmRepository().delete(id);
      if (deleteResult.affected === 0 && error) {
        throw error;
      }
    }

    /** Count entities */
    async count(options?: FindManyOptions<T>): Promise<number> {
      return await this.getTypeOrmRepository().count(options);
    }

    /** Get the average of a culumn */
    async average(
      columnName: PickKeysByType<T, number>,
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): Promise<number> {
      return await this.getTypeOrmRepository().average(columnName, where);
    }

    /** Get the sum of a column */
    async sum(
      columnName: PickKeysByType<T, number>,
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): Promise<number> {
      return await this.getTypeOrmRepository().sum(columnName, where);
    }

    /** Get the max value of a column */
    async max(
      columnName: PickKeysByType<T, number>,
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): Promise<number> {
      return await this.getTypeOrmRepository().maximum(columnName, where);
    }

    /** Get the min value of a column */
    async min(
      columnName: PickKeysByType<T, number>,
      where?: FindOptionsWhere<T> | FindOptionsWhere<T>[],
    ): Promise<number> {
      return await this.getTypeOrmRepository().minimum(columnName, where);
    }

    /** Merge multiple entity like objects into a single entity */
    merge(mergeIntoEntity: T, ...entityLikes: DeepPartial<T>[]): T {
      return this.getTypeOrmRepository().merge(mergeIntoEntity, ...entityLikes);
    }
  }

  return TransactionalRepositoryClass;
}
