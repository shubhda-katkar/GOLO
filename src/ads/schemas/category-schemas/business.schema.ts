import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BusinessDocument = Business & Document;

@Schema({ _id: false, timestamps: false })
export class Business {
  @Prop({ required: true, enum: ['Promotion', 'Partnership', 'Investment', 'Sale', 'Franchise'] })
  type: string;

  @Prop({ required: true })
  businessName: string;

  @Prop()
  businessType: string;

  @Prop()
  establishedYear: number;

  @Prop()
  description: string;

  @Prop()
  location: string;

  @Prop()
  investment: number;

  @Prop()
  expectedReturn: string;

  @Prop()
  employees: number;

  @Prop()
  turnover: string;

  @Prop()
  profitMargin: string;

  @Prop()
  website: string;

  @Prop()
  contactPerson: string;

  @Prop()
  contactNumber: string;

  @Prop()
  email: string;

  @Prop({ type: [String] })
  images: string[];

  @Prop()
  documents: string;
}

export const BusinessSchema = SchemaFactory.createForClass(Business);