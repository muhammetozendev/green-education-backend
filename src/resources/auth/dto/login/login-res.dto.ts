import { Expose, Type } from 'class-transformer';
import { UserDto } from '../user.dto';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResDto {
  @Expose()
  @ApiProperty()
  accessToken: string;

  @Expose()
  @ApiProperty()
  refreshToken: string;
}
