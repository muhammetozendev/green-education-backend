import { IsNotEmpty, IsNumber, IsString, Length, Min } from 'class-validator';

export class CreateModuleDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 255)
  title: string;

  @IsNumber()
  @Min(1)
  number: number;

  @IsNumber()
  organizationId: number;
}
