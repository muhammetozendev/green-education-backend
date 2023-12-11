import { Optional } from '@nestjs/common';
import { IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(1, 255)
  @Optional()
  name?: string;

  @IsString()
  @Length(1, 255)
  @Optional()
  lastName?: string;
}
