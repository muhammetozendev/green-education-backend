import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { TokenService } from './services/token/token.service';
import { BcryptHashingService } from './services/hashing/bcrypt-hashing.service';
import { AuthorizationService } from './services/authorization/authorization.service';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationService } from './services/authentication/authentication.service';
import jwtConfig from 'src/config/env/jwt-config';
import { SessionRepository } from './repositories/session/session.repository';
import { UsersModule } from '../users/users.module';
import { AbstractHashingService } from './services/hashing/abstract-hashing-service';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { RoleGuard } from './guards/role.guard';

@Module({
  imports: [ConfigModule.forFeature(jwtConfig), UsersModule],
  providers: [
    TokenService,
    AuthorizationService,
    AuthenticationService,
    SessionRepository,
    {
      provide: AbstractHashingService,
      useClass: BcryptHashingService,
    },
    JwtAccessTokenGuard,
    RoleGuard,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RoleGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
