import { Test, TestingModule } from '@nestjs/testing';
import { BcryptHashingService } from './bcrypt-hashing.service';

describe('BcryptHashingService', () => {
  let service: BcryptHashingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BcryptHashingService],
    }).compile();

    service = module.get<BcryptHashingService>(BcryptHashingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should hash a password', async () => {
    const password = 'password';
    const hashedPassword = await service.hash(password);
    expect(hashedPassword).not.toBe(password);
  });

  it('should compare a password to a hash', async () => {
    const password = 'password';
    const hashedPassword = await service.hash(password);
    const isMatch = await service.compare(password, hashedPassword);
    expect(isMatch).toBe(true);
  });
});
