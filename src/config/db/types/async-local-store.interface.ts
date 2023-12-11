import { EntityManager } from 'typeorm';

export interface IAsyncLocalStore {
  entityManager: EntityManager;
}
