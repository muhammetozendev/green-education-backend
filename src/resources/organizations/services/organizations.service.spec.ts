import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from './organizations.service';
import { UsersModule } from 'src/resources/users/users.module';
import { UserService } from 'src/resources/users/services/user.service';
import { ModulesService } from 'src/resources/modules/services/modules/modules.service';
import { OrganizationRepository } from '../repositories/organization/organization.repository';

describe('OrganizationsService', () => {
  let service: OrganizationsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: UserService,
          useValue: {},
        },
        {
          provide: ModulesService,
          useValue: {},
        },
        {
          provide: OrganizationRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
