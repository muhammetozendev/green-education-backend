import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Option } from './option.entity';

@Injectable()
export class OptionRepository extends TransactionalRepository(Option) {}
