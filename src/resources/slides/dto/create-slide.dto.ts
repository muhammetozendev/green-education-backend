import { IsArray, IsNumber, IsString, IsUrl } from 'class-validator';

export class CreateSlideDto {
  @IsArray()
  @IsString({ each: true })
  content: string[];

  @IsUrl()
  imageUrl: string;
}
