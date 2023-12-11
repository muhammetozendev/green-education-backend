import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RefreshTokenPayloadDto {
  @Expose()
  @ApiProperty()
  sessionId: string;

  @Expose()
  @ApiProperty()
  userId: number;
}
