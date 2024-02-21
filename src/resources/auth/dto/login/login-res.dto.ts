import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class LoginResDto {
  @Expose()
  @ApiProperty()
  accessToken: string;
}
