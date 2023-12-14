import { Module } from '@nestjs/common';
import { OrganizationsController } from './organizations.controller';
import { OrganizationsService } from './services/organizations.service';
import { OrganizationRepository } from './repositories/organization/organization.repository';
import { UsersModule } from '../users/users.module';
import { ModulesModule } from '../modules/modules.module';

@Module({
  imports: [UsersModule, ModulesModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService, OrganizationRepository],
})
export class OrganizationsModule {}
