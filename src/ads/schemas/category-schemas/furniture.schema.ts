import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type FurnitureDocument = Furniture & Document;

@Schema({ _id: false, timestamps: false })
export class Furniture {

  @Prop({ required: true })
  furnitureType: string;

  @Prop({ required: true })
  material: string;

  @Prop()
  size: string;

  @Prop()
  condition: string;

  @Prop({ default: false })
  negotiable: boolean;

  @Prop({ required: true })
  price: number;

}

export const FurnitureSchema = SchemaFactory.createForClass(Furniture);