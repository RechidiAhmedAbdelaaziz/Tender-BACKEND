import { Module } from '@nestjs/common';
import { TenderService } from './tender.service';
import { TenderController } from './tender.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Tender } from 'src/models/tender.entity';
import { CloudinaryModule } from 'src/core/module/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Tender]),
    CloudinaryModule,
  ],
  controllers: [TenderController],
  providers: [TenderService],
})
export class TenderModule { }
