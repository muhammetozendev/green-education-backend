import { Injectable } from '@nestjs/common';
import { TransactionalRepository } from 'src/config/db/transactional-repository';
import { Organization } from './organization.entity';

@Injectable()
export class OrganizationRepository extends TransactionalRepository(
  Organization,
) {
  async abc() {}
}
