import { Module } from '@nestjs/common';
import { UserRepository } from './repositories/user/user.repository';
import { UserService } from './services/user.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UserRepository, UserService],
  exports: [UserService],
  controllers: [UsersController],
})
export class UsersModule {}
