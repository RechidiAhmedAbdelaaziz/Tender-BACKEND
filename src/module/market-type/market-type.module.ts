import { Module } from '@nestjs/common';
import { MarketTypeService } from './market-type.service';
import { MarketTypeController } from './market-type.controller';
import { DatabaseModule } from 'src/core/module/database.module';
import { MarketType } from 'src/models/market-type.entity';

@Module({
  imports: [
    DatabaseModule.forFeature([MarketType]),
  ],
  controllers: [MarketTypeController],
  providers: [MarketTypeService],
})
export class MarketTypeModule { }
