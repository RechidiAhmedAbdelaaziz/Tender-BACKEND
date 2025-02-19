import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { AdminUserController, UserController } from './user.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { User } from 'src/models/user.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([User]),
  ],
  controllers: [UserController , AdminUserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule { }
