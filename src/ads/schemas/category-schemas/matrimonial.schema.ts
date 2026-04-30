import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatrimonialDocument = Matrimonial & Document;

@Schema({ _id: false, timestamps: false })
export class Matrimonial {

  @Prop({ required: true })
  profileFor: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  age: number;

  @Prop({ required: true })
  gender: string;

  @Prop()
  maritalStatus: string;

  @Prop()
  religion: string;

  @Prop()
  caste: string;

  @Prop()
  education: string;

  @Prop()
  occupation: string;

  @Prop()
  annualIncome: string;

  @Prop()
  height: string;

  @Prop()
  location: string;

  @Prop()
  aboutMe: string;

  @Prop()
  partnerPreference: string;
}

export const MatrimonialSchema = SchemaFactory.createForClass(Matrimonial);