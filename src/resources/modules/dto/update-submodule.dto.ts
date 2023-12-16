import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class UpdateSubmoduleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;

  @IsNumber()
  @IsOptional()
  quizId: number;
}
