import { Module } from '@nestjs/common';

import { AuthModule } from './module/auth/auth.module';
import { DatabaseModule } from './core/module/database.module';
import { JwtAuthModule } from './core/module/jwt-auth.module';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './core/interceptors/response.interceptor';
import { HttpExceptionFilter } from './core/interceptors/http-exception.filter';
import { UserModule } from './module/user/user.module';
import { NewsPaperModule } from './module/news-paper/news-paper.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from './core/module/cloudinary/cloudinary.module';
import { MarketTypeModule } from './module/market-type/market-type.module';
import { CategoryModule } from './module/category/category.module';
import { AnnouncerModule } from './module/announcer/announcer.module';

@Module({
  imports: [
    DatabaseModule.forRoot('tender'),
    JwtAuthModule.register(),
    AuthModule,
    UserModule,
    NewsPaperModule,
    MarketTypeModule,
    CategoryModule,
    AnnouncerModule,
  ],

  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
  exports: [],
})
export class AppModule { }
