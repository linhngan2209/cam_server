import { Injectable, Logger } from '@nestjs/common';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { ChargingStation } from './stations.model';
import { InjectModel } from 'nestjs-typegoose';

@Injectable()
export class ChargingStationService {
  private readonly logger = new Logger(ChargingStationService.name);
  private readonly DEFAULT_LIMIT = 20;

  constructor(
    @InjectModel(ChargingStation)
    private readonly chargingStationModel: ModelType<ChargingStation>,
  ) { }
  async findNearest(
    lat: number,
    lng: number,
    
  ): Promise<ChargingStation[]> {
    try {
      return await this.chargingStationModel.aggregate([
        {
          $geoNear: {
            near: { type: 'Point', coordinates: [lng, lat] },
            distanceField: 'distance',
            spherical: true,
            key: 'geometry'
          }
        },
       
        {
          $addFields: {
            'properties.distance': '$distance'
          }
        },
        {
          $project: {
            distance: 0
          }
        }
      ]).exec();
    } catch (error) {
      this.logger.error(`Failed to find nearest stations`, error.stack);
      throw new Error('Unable to find nearby charging stations');
    }
  }
  async findByKeyword(
    keyword: string,
    lat?: number,
    lng?: number,
    maxDistance?: number
  ): Promise<ChargingStation[]> {
    try {
      const sanitized = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const keywordRegex = new RegExp(sanitized, 'i');
  
      const queryCondition = {
        $or: [
          { 'properties.stationName': keywordRegex },
          { 'properties.formatted_address': keywordRegex }
        ]
      };
  
      const pipeline: any[] = [];
  
      if (lat && lng && maxDistance) {
        pipeline.push({
          $geoNear: {
            near: { type: 'Point', coordinates: [lng, lat] },
            distanceField: 'distance',
            spherical: true,
            maxDistance,
            query: queryCondition
          }
        });
      } else {
        pipeline.push({ $match: queryCondition });
      }
  
      pipeline.push(
        { $limit: this.DEFAULT_LIMIT },
        {
          $addFields: {
            'properties.distance': '$distance'
          }
        },
        {
          $project: {
            distance: 0
          }
        }
      );
  
      return await this.chargingStationModel.aggregate(pipeline).exec();
    } catch (error) {
      this.logger.error(` Search failed for keyword "${keyword}"`, error.stack);
      throw new Error('Station search failed');
    }
  }
  

  async findNearestStations( lat: number,lng: number ): Promise<ChargingStation[]> {
    try {
      return await this.chargingStationModel
        .aggregate([
          {
            $geoNear: {
              near: {
                type: 'Point',
                coordinates: [lng, lat]
              },
              distanceField: 'distance',
            spherical: true,
            key: 'geometry'
            }
          },
          { $limit: 50 }, 
          
          { $addFields: { 'properties.distance': '$distance' }} 
        ])
        .exec();
    } catch (error) {
      this.logger.error('Failed to retrieve nearest stations', error.stack);
      throw new Error('Failed to retrieve nearest charging stations');
    }
  }
}