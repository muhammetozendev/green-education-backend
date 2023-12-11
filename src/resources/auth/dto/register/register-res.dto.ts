import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { RoleEnum } from 'kysely-codegen';

export class RegisterResDto {
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
  @ApiProperty({ enum: ['ADMIN', 'USER'] as RoleEnum[] })
  role: RoleEnum;
}
