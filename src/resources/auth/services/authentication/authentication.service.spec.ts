import { Test, TestingModule } from '@nestjs/testing';
import { AuthenticationService } from './authentication.service';
import { SessionRepository } from '../../repositories/session/session.repository';
import { AbstractHashingService } from '../hashing/abstract-hashing-service';
import { TokenService } from '../token/token.service';
import { UserService } from 'src/resources/users/services/user.service';

describe('AuthenticationService', () => {
  let service: AuthenticationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationService,
        { provide: UserService, useValue: {} },
        { provide: SessionRepository, useValue: {} },
        { provide: AbstractHashingService, useValue: {} },
        { provide: TokenService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthenticationService>(AuthenticationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
