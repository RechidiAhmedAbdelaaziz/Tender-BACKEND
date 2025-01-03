import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginBodyDto } from './dto/login.dto';
import { ApiResult } from 'src/core/types/api-response';
import { RegisterBodyDto } from './dto/register.dto';
import { RefreshTokenQueryDto } from './dto/refresh-token.dto';
import { CheckResetCodeBodyDto, ForgotPassBodyDto, ResetPassBodyDto } from './dto/reset-password.dto';
import { HttpAuthGuard, Role, UnCheckVerified } from './guards/auth.guard';
import { UserRoles } from 'src/core/enums/user-roles.enum';
import { VerifyAccountBodyDto } from './dto/verify-account.dto';
import { CurrentUser } from './decorators/auth.decorator';
import { Types } from 'mongoose';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post('login')
  async login(
    @Body() body: LoginBodyDto
  ) {
    const { login, password } = body;

    const tokens = await this.authService.login({ login, password });

    return ApiResult.success({ tokens });
  }

  @Post('register')
  async register(
    @Body() body: RegisterBodyDto
  ) {
    const { email, phone, password, name } = body;

    const tokens = await this.authService.register({ email, phone, password, name });

    return ApiResult.success({ tokens });
  }

  @Get('refresh-token')
  async refreshToken(
    @Body() body: RefreshTokenQueryDto
  ) {
    const { refreshToken } = body;

    const tokens = await this.authService.refreshToken(refreshToken);

    return ApiResult.success({ tokens });
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body() body: ForgotPassBodyDto
  ) {
    const { email } = body;

    await this.authService.forgotPassword(email);

    return ApiResult.success({ message: 'Reset code sent successfully' });
  }

  @Post('check-reset-code')
  async checkResetCode(
    @Body() body: CheckResetCodeBodyDto
  ) {
    const { email, otp } = body;

    await this.authService.verifyRestPasswordOtp(email, otp);

    return ApiResult.success({ message: 'Reset code is correct' });
  }

  @Post('reset-password')
  async resetPassword(
    @Body() body: ResetPassBodyDto
  ) {
    const { email, otp, password } = body;

    const tokens = await this.authService.resetPassword(email, otp, password);

    return ApiResult.success({ tokens });
  }

  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  @UnCheckVerified()
  @Post('resend-verification')
  async resendVerification(
    @CurrentUser() userId: Types.ObjectId
  ) {
    await this.authService.generateAccountVerificationOtp(userId);

    return ApiResult.success({ message: 'Verification code sent successfully' });
  }

  @ApiBearerAuth()
  @UseGuards(HttpAuthGuard)
  @UnCheckVerified()
  @Post('verify-account')
  async verifyAccount(
    @Body() body: VerifyAccountBodyDto,
    @CurrentUser() userId: Types.ObjectId
  ) {
    const { otp } = body;

    const tokens = await this.authService.verifyAccount(userId, otp);

    return ApiResult.success({ tokens });
  }








}
