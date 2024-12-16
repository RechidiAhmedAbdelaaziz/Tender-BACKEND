import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { User } from 'src/models/user.entity';
import { AccountVerificationOtp, RefreshToken, RestPasswordOtp } from 'src/models/auth.entity';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule.forFeature([User, RefreshToken, RestPasswordOtp, AccountVerificationOtp]),
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
