import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/abstract-repository';
import { Organization } from './organization.entity';
import { DataSource } from 'typeorm';
import { AsyncLocalStorage } from 'async_hooks';
import { IAsyncLocalStore } from 'src/config/db/types/async-local-store.interface';

@Injectable()
export class OrganizationRepository extends TransactionalRepository<Organization> {
  constructor(ds: DataSource, als: AsyncLocalStorage<IAsyncLocalStore>) {
    super(ds, als, Organization);
  }
}
