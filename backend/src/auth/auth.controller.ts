import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
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
  @ApiOperation({ summary: 'Verify user email' })
@Get('verify-email')
verifyEmail(@Query('token') token: string) {
  console.log('TOKEN =', token);
  return this.authService.verifyEmail(token);
}
@ApiOperation({ summary: 'Forgot Password' })
@Post('forgot-password')
forgotPassword(@Body() dto: ForgotPasswordDto) {
  return this.authService.forgotPassword(dto);
}

@ApiOperation({ summary: 'Reset Password' })
@Post('reset-password')
resetPassword(@Body() dto: ResetPasswordDto) {
  return this.authService.resetPassword(dto);
}

  
}