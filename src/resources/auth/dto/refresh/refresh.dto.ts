import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsJWT, IsString } from 'class-validator';

export class RefreshDto {
  @IsJWT()
  refreshToken: string;
}
