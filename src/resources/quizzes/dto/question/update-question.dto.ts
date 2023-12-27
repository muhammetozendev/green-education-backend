import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { OptionDto } from '../option/option.dto';

export class UpdateQuestionDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  question?: string;

  @ValidateNested({ each: true })
  @Type(() => OptionDto)
  @IsArray()
  @ArrayMinSize(4)
  @ArrayMaxSize(4)
  @IsOptional()
  options?: OptionDto[];
}
