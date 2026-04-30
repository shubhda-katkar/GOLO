import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type LostFoundDocument = LostFound & Document;

@Schema({ _id: false, timestamps: false })
export class LostFound {

  @Prop({ required: true, enum: ['lost', 'found'] })
  condition: string;

  @Prop({ required: true })
  itemName: string;

  @Prop({ required: true })
  itemType: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ required: true })
  location: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  reward: string;

  @Prop({ required: true })
  contactDetails: string;

  @Prop({ type: [String] })
  images: string[];
}

export const LostFoundSchema = SchemaFactory.createForClass(LostFound);