import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Submodule } from 'src/resources/modules/repositories/submodule/submodule.entity';

@Injectable()
export class SubmoduleRepository extends TransactionalRepository(Submodule) {}
