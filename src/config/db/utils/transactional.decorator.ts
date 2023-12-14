import { UseInterceptors } from '@nestjs/common';
import { TransactionalInterceptor } from './transactional.interceptor';

export const Transactional = () => UseInterceptors(TransactionalInterceptor);
