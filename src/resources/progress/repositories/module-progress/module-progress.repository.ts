import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { ModuleProgress } from './module-progress.entity';

@Injectable()
export class ModuleProgressRepository extends TransactionalRepository(
  ModuleProgress,
) {}
