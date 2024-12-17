import { Module } from '@nestjs/common';
import { NewsPaperService } from './news-paper.service';
import { NewsPaperController } from './news-paper.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { NewsPaper } from 'src/models/news-paper.entity';
import { CloudinaryModule } from 'src/core/module/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.forFeature([NewsPaper]),
    CloudinaryModule
  ],
  controllers: [NewsPaperController],
  providers: [NewsPaperService]
})
export class NewsPaperModule { }
