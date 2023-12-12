import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { RefreshDto } from './dto/refresh/refresh.dto';
import { LoginDto } from './dto/login/login.dto';
import { AuthenticationService } from './services/authentication/authentication.service';
import { Auth } from './decorators/auth.decorator';
import { AuthType } from './enums/auth-type.enum';
import { ApiTags } from '@nestjs/swagger';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthenticationService) {}

  @Post('login')
  @Auth(AuthType.NONE)
  async login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Post('register')
  @Auth(AuthType.NONE)
  async register(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @Post('refresh')
  @Auth(AuthType.NONE)
  async refresh(@Body() body: RefreshDto) {
    return this.authService.refresh(body.refreshToken);
  }

  //   @Get('sessions')
  //   async sessions() {
  //     return this.authService.getSessions();
  //   }
}
