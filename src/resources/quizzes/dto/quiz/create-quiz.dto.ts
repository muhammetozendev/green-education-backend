import { IsArray, IsNotEmpty, IsString, ValidateNested } from 'class-validator';
import { CreateQuestionDto } from '../question/create-question.dto';
import { Type } from 'class-transformer';

export class CreateQuizDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @ValidateNested({ each: true })
  @Type(() => CreateQuestionDto)
  @IsArray()
  questions: CreateQuestionDto[];
}
