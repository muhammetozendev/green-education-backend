import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Slide } from './slide.entity';

@Injectable()
export class SlideRepository extends TransactionalRepository(Slide) {}
