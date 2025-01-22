import { Module } from '@nestjs/common';
import { TenderResultService } from './tender-result.service';
import { TenderResultController } from './tender-result.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { TenderResult } from 'src/models/tender-result.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([TenderResult])
  ],
  controllers: [TenderResultController],
  providers: [TenderResultService],
})
export class TenderResultModule { }
