import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';

@ApiTags('Authentication')   // 👈 Controller ke upar
@Controller('auth')
export class AuthController {

  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'Register a new user' })   // 👈 Register API description
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @ApiOperation({ summary: 'Login user' })   // 👈 Login API description
  @Post('login')
  @Throttle({ default: { limit: 5,  ttl: 15 * 60 * 1000 } })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  
}