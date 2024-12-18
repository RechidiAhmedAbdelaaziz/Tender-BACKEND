import { Module } from '@nestjs/common';
import { AnnouncerService } from './announcer.service';
import { AnnouncerController } from './announcer.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Announcer } from 'src/models/announcer.entity';
import { CloudinaryModule } from 'src/core/module/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Announcer]),
    CloudinaryModule,
  ],
  controllers: [AnnouncerController],
  providers: [AnnouncerService],
})
export class AnnouncerModule { }
