import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Quiz } from './quiz.entity';

@Injectable()
export class QuizRepository extends TransactionalRepository(Quiz) {}
