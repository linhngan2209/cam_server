import { prop, getModelForClass, modelOptions, Severity, index } from '@typegoose/typegoose';

class Geometry {
  @prop({ type: String, enum: ['Point'], required: true })
  type: string;

  @prop({ type: () => [Number], required: true })
  coordinates: [number, number];
}

class Properties {
  @prop()
  stationName?: string;

  @prop()
  address?: string;

  @prop()
  bussinessStatus?: string;

  @prop()
  openingHours?: string;

  @prop()
  rating?: number;

  @prop()
  totalUserRating?: number;
}

@modelOptions({ 
  options: { allowMixed: Severity.ALLOW },
  schemaOptions: { 
    collection: 'charging_stations',  
  }
})
@index({ geometry: '2dsphere' })
export class ChargingStation {
  @prop({ required: true })
  type: string;

  @prop({ type: () => Geometry, required: true })
  geometry: Geometry;

  @prop({ type: () => Properties })
  properties?: Properties;
}