import { Module } from '@nestjs/common';
import { AuctionService } from './auction.service';
import { AuctionController } from './auction.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { Auction } from 'src/models/auction.entity';
import { CloudinaryModule } from 'src/core/module/cloudinary/cloudinary.module';

@Module({
  imports: [
    DatabaseModule.forFeature([Auction]),
    CloudinaryModule,
  ],
  controllers: [AuctionController],
  providers: [AuctionService],
})
export class AuctionModule { }
