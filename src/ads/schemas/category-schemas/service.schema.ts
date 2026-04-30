import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ServiceDocument = Service & Document;

@Schema({ _id: false, timestamps: false })
export class Service {

  @Prop({ required: true })
  serviceCategory: string;

  @Prop()
  experience: string;

  @Prop()
  serviceArea: string;

  @Prop()
  availableTime: string;

  @Prop()
  charges: string;

  @Prop({ default: false })
  emergencyService: boolean;

  @Prop()
  serviceBio: string;
}

export const ServiceSchema = SchemaFactory.createForClass(Service);