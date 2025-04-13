import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import { ChargingStationService } from './stations.service';
import { ChargingStation } from './stations.model';

@Controller('charging-stations')
export class ChargingStationController {
  constructor(private readonly chargingStationService: ChargingStationService) { }

  @Get('nearest')
  async findNearest(
    @Query('lat') lat: string,
    @Query('lng') lng: string,
  ) {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      throw new BadRequestException('Invalid lat, lng or radiusKm');
    }

    return this.chargingStationService.findNearest(parsedLat, parsedLng);
  }


  @Get('search')
  async getByCarBrand(
    @Query('keyword') keyword: string,
    @Query('lat') lat: string,
    @Query('long') long: string,
  ): Promise<ChargingStation[]> {
    const latitude = parseFloat(lat);
    const longitude = parseFloat(long);
    return this.chargingStationService.findByKeyword(keyword, latitude, longitude);
  }

  @Get('findAll')
  async findAll(
    @Query('lat') lat: string,
    @Query('lng') lng: string,): Promise<ChargingStation[]> {
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);

    if (isNaN(parsedLat) || isNaN(parsedLng)) {
      throw new BadRequestException('Invalid lat, lng or radiusKm');
    }
    return this.chargingStationService.findNearestStations(parsedLat, parsedLng);
  }
}