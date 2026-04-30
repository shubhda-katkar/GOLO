import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TravelDocument = Travel & Document;

@Schema({ _id: false, timestamps: false })
export class Travel {

  @Prop({ required: true })
  courseType: string;

  @Prop()
  destination: string;

  @Prop()
  duration: string;

  @Prop()
  travelDate: string;

  @Prop()
  price: string;

  @Prop()
  availableSeats: string;

  @Prop()
  pickupLocation: string;

  @Prop()
  inclusions: string;

  @Prop()
  exclusions: string;
}

export const TravelSchema = SchemaFactory.createForClass(Travel);