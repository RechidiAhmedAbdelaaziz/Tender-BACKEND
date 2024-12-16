import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login.dto';
import { ApiResponse } from 'src/core/types/api-response';
import { RegisterBodyDto } from './dto/register.dto';
import { RefreshTokenQueryDto } from './dto/refresh-token.dto';
import { CheckResetCodeBodyDto, ForgotPassBodyDto, ResetPassBodyDto } from './dto/reset-password.dto';
import { SetRole } from './guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  
  @Post('login')
  async login(
    @Body() body: LoginBodyDto
  ) {
    const { login, password } = body;

    const tokens = await this.authService.login({ login, password });

    return ApiResponse.success({ tokens });
  }

  @Post('register')
  async register(
    @Body() body: RegisterBodyDto
  ) {
    const { email, phone, password, name } = body;

    const tokens = await this.authService.register({ email, phone, password, name });

    return ApiResponse.success({ tokens });
  }

  @Get('refresh-token')
  async refreshToken(
    @Body() body: RefreshTokenQueryDto
  ) {
    const { refreshToken } = body;

    const tokens = await this.authService.refreshToken(refreshToken);

    return ApiResponse.success({ tokens });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPassBodyDto
  ) {
    const { email } = body;

    await this.authService.forgotPassword(email);

    return ApiResponse.success({ message: 'Reset code sent successfully' });
  }

  @Post('check-reset-code')
  async checkResetCode(
    @Body() body: CheckResetCodeBodyDto
  ) {
    const { email, otp } = body;

    await this.authService.verifyRestPasswordOtp(email, otp);

    return ApiResponse.success({ message: 'Reset code is correct' });
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPassBodyDto
  ) {
    const { email, otp, password } = body;

    const tokens = await this.authService.resetPassword(email, otp, password);

    return ApiResponse.success({ tokens });
  }





}
