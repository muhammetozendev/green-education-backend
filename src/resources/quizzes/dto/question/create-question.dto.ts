import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OptionDto } from '../option/option.dto';
import { Type } from 'class-transformer';

export class CreateQuestionDto2 {
  @IsString()
  @IsNotEmpty()
  question: string;

  @IsNumber()
  quizId: number;

  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsArray()
  @ArrayMinSize(2)
  options: OptionDto[];
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question: string;

  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsArray()
  @ArrayMinSize(2)
  options: OptionDto[];
}
