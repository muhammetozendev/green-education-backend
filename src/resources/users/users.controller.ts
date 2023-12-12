import { Body, Controller, Get, Param, Patch, Put } from '@nestjs/common';
import { ActiveUser } from '../auth/decorators/active-user.decorator';
import { UserDto } from '../auth/dto/user.dto';
import { UserService } from './services/user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { Role } from '../auth/decorators/role.decorator';
import { RoleEnum } from '../auth/enums/role.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('Users')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('/info')
  getInfo(@ActiveUser() user: UserDto) {
    return user;
  }

  @Patch(':id')
  @Role(RoleEnum.ADMIN)
  async update(@Param('id') id: number, @Body() body: UpdateUserDto) {
    return await this.userService.update(id, body);
  }
}
