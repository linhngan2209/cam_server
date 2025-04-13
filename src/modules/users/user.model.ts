import { prop, modelOptions } from '@typegoose/typegoose';

@modelOptions({
  schemaOptions: {
    timestamps: true,
  },
})
export class User {
  @prop({ required: true })
  name: string;

  @prop({ required: true, unique: true })
  email: string;

  @prop({ required: true })
  phone: string;

  @prop({
    required: true,
    default: 'user',
  }) 
  role: string;

  @prop({ required: true })
  password: string;
}
