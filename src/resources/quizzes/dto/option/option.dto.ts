import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class OptionDto {
  @IsString()
  @IsNotEmpty()
  option: string;

  @IsBoolean()
  isCorrect: boolean;
}
