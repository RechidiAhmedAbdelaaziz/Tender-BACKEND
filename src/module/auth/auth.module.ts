import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { User } from 'src/models/user.entity';
import { RefreshToken, RestPasswordOtp } from 'src/models/auth.entity';

@Module({
  imports: [DatabaseModule.forFeature([User, RefreshToken, RestPasswordOtp])],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule { }
