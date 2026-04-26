import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type AstrologyDocument = Astrology & Document;

@Schema({ _id: false, timestamps: false })
export class Astrology {
  @Prop({ required: true, enum: ['Consultation', 'Horoscope', 'Puja', 'Remedies'] })
  serviceType: string;

  @Prop()
  astrologerName: string;

  @Prop()
  experience: number;

  @Prop()
  specialization: string;

  @Prop()
  languages: string[];

  @Prop()
  consultationMode: string;

  @Prop()
  charges: number;

  @Prop()
  duration: string;

  @Prop()
  availableTimings: string;

  @Prop()
  qualification: string;

  @Prop()
  contactNumber: string;

  @Prop()
  email: string;

  @Prop()
  website: string;

  @Prop()
  about: string;
}

export const AstrologySchema = SchemaFactory.createForClass(Astrology);