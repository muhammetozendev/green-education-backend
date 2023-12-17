import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { SubmoduleProgress } from './submodule-progress.entity';

@Injectable()
export class SubmoduleProgressRepository extends TransactionalRepository(
  SubmoduleProgress,
) {}
