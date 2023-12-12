import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RoleEnum } from '../enums/role.enum';

export class UserDto {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  lastName: string;

  @Expose()
  @ApiProperty({ enum: RoleEnum })
  role: RoleEnum;
}
