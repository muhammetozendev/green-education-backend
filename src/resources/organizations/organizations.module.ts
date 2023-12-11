import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './organizations.service';
import { OrganizationRepository } from './repositories/organization/organization.repository';

@Module({
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationRepository],
})
export class OrganizationsModule {}
