import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { RoleEnum } from 'src/resources/auth/enums/role.enum';

export class CreateUserDto {
  @IsString()
  @Length(1, 255)
  name: string;

  @IsString()
  @Length(1, 255)
  lastName: string;

  @IsEmail()
  @Length(1, 255)
  email: string;

  @IsString()
  @Length(8, 60)
  password: string;

  @IsEnum(RoleEnum)
  role: RoleEnum;
}
