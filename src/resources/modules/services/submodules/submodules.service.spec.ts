import { Test, TestingModule } from '@nestjs/testing';
import { SubmodulesService } from './submodules.service';
import { SubmoduleRepository } from '../../repositories/submodule/submodule.repository';

describe('SubmodulesService', () => {
  let service: SubmodulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubmodulesService,
        {
          provide: SubmoduleRepository,
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<SubmodulesService>(SubmodulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
