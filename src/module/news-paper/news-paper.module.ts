import { Module } from '@nestjs/common';
import { NewsPaperService } from './news-paper.service';
import { NewsPaperController } from './news-paper.controller';
import { NewsPaper } from 'src/models/news-paper';
import { DatabaseModule } from 'src/core/module/database.module';

@Module({
  imports: [
    DatabaseModule.forFeature([NewsPaper]),
  ],
  controllers: [NewsPaperController],
  providers: [NewsPaperService],
})
export class NewsPaperModule {}
