import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MobileDocument = Mobile & Document;

@Schema({ _id: false, timestamps: false })
export class Mobile {

  @Prop({ required: true })
  brand: string;

  @Prop({ required: true })
  model: string;

  @Prop({ required: true, enum: ['new', 'like new', 'fair'] })
  condition: string;

  @Prop()
  warranty: string;

  @Prop({ required: true })
  price: number;

  @Prop({ default: false })
  negotiable: boolean;
}

export const MobileSchema = SchemaFactory.createForClass(Mobile);