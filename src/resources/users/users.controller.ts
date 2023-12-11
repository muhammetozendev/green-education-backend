import { Controller, Get, Param, Put } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { UserService } from './services/user/user.service';

@Controller('users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('/info')
  getInfo(@ActiveUser() user: UserDto) {
    return user;
  }
}
