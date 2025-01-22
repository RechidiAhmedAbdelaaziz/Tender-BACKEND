import { Module } from '@nestjs/common';
import { TenderService } from './tender.service';
import { TenderController } from './tender.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Tender } from 'src/models/tender.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([Tender]),
  ],
  controllers: [TenderController],
  providers: [TenderService],
})
export class TenderModule { }
