import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Answer } from './answer.entity';

@Injectable()
export class AnswerRepository extends TransactionalRepository(Answer) {}
