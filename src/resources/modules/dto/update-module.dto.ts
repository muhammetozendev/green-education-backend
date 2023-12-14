import { Optional } from '@nestjs/common';
import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class UpdateModuleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  @Optional()
  title?: string;
}
