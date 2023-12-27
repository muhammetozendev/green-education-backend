import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Question } from './question.entity';

@Injectable()
export class QuestionRepository extends TransactionalRepository(Question) {}
