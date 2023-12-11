import { Test, TestingModule } from '@nestjs/testing';
import { TokenService } from './token.service';
import jwtConfig from 'src/config/env/jwt-config';

describe('TokenService', () => {
  let service: TokenService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TokenService,
        {
          provide: jwtConfig.KEY,
          useValue: {
            accessTokenExpiry: 1000,
            refreshTokenExpiry: 1000,
            secret: 'secret',
          },
        },
      ],
    }).compile();

    service = module.get<TokenService>(TokenService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should sign a token', async () => {
    const token = await service.signToken(1000, { id: 1 });
    expect(token).toBeDefined();

    const decoded = await service.verifyToken<{ id: number }>(token);
    expect(decoded).toBeDefined();

    expect(decoded.id).toBe(1);
  });
});
