import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateSubmoduleDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  number: number;

  @IsNumber()
  moduleId: number;

  @IsNumber()
  @IsOptional()
  quizId: number;
}
