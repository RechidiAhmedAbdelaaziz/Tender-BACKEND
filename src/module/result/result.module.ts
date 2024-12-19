import { Module } from '@nestjs/common';
import { ResultService } from './result.service';
import { ResultController } from './result.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Result } from 'src/models/result.entity';
import { CloudinaryModule } from 'src/core/module/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Result]),
    CloudinaryModule,
  ],
  controllers: [ResultController],
  providers: [ResultService],
})
export class ResultModule { }
