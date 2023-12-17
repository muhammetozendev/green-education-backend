import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { SlideProgress } from './slide-progress.entity';

@Injectable()
export class SlideProgressRepository extends TransactionalRepository(
  SlideProgress,
) {}
