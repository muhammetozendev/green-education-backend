import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateQuizDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;
}
