import { Test, TestingModule } from '@nestjs/testing';
import { ModulesService } from './modules.service';
import { ModuleRepository } from '../../repositories/module/module.repository';
import { Provider } from '@nestjs/common';
import Module from 'module';

describe('ModulesService', () => {
  let service: ModulesService;

  let repository: Partial<ModuleRepository> = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ModulesService,
        {
          provide: ModuleRepository,
          useValue: repository,
        },
      ],
    }).compile();

    service = module.get<ModulesService>(ModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return true if module number is 1 and there are no modules', async () => {
    jest.spyOn(repository, 'find').mockResolvedValue([]);
    const result = await service.validateModuleNumber(1, 1);
    expect(result).toBe(true);
  });

  it('should validate if module number is between 1 and length of the module array', async () => {
    const modules = [];
    for (let i = 0; i < 5; i++) {
      modules.push({} as Module);
    }

    jest.spyOn(repository, 'find').mockResolvedValue(modules);

    let result = await service.validateModuleNumber(1, 1);
    expect(result).toBe(true);

    result = await service.validateModuleNumber(5, 1);
    expect(result).toBe(true);

    result = await service.validateModuleNumber(0, 1);
    expect(result).toBe(false);

    result = await service.validateModuleNumber(6, 1);
    expect(result).toBe(true);

    result = await service.validateModuleNumber(7, 1);
    expect(result).toBe(false);
  });
});
