import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ElectronicsDocument = Electronics & Document;

@Schema({ _id: false, timestamps: false })
export class Electronics {

  @Prop({ required: true })
  electronicsType: string;

  @Prop()
  brand: string;

  @Prop()
  modelNumber: string;

  @Prop()
  warrantyRemaining: string;

  @Prop()
  capacity: string;

  @Prop({ enum: ['new', 'like new', 'fair'] })
  condition: string;

  @Prop()
  negotiable: boolean;

  @Prop({ required: true })
  price: string;
}

export const ElectronicsSchema = SchemaFactory.createForClass(Electronics);