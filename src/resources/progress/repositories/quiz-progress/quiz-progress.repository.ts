import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { QuizProgress } from './quiz-progress.entity';

@Injectable()
export class QuizProgressRepository extends TransactionalRepository(
  QuizProgress,
) {}
