import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Submodule } from './submodule.entity';

@Injectable()
export class SubmoduleRepository extends TransactionalRepository(Submodule) {}
