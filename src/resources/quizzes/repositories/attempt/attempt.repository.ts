import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Attempt } from './attempt.entity';

@Injectable()
export class AttemptRepository extends TransactionalRepository(Attempt) {}
