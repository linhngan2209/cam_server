import { Module } from '@nestjs/common';
import { TypegooseModule } from 'nestjs-typegoose';
import { ChargingStation } from './stations.model';
import { ChargingStationService } from './stations.service';
import { ChargingStationController } from './stations.controller';

@Module({
  imports: [TypegooseModule.forFeature([ChargingStation]),
  
],
  providers: [ChargingStationService],
  controllers: [ChargingStationController],
})
export class ChargingStationModule {}