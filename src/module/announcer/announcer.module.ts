import { Module } from '@nestjs/common';
import { AnnouncerService } from './announcer.service';
import { AnnouncerController } from './announcer.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Announcer } from 'src/models/announcer.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([Announcer]),
  ],
  controllers: [AnnouncerController],
  providers: [AnnouncerService],
})
export class AnnouncerModule { }
