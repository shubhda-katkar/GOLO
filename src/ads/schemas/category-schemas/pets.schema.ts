import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PetsDocument = Pets & Document;

@Schema({ _id: false, timestamps: false })
export class Pets {

  @Prop({ required: true })
  species: string;

  @Prop()
  breed: string;

  @Prop()
  age: string;

  @Prop()
  gender: string;

  @Prop()
  weight: string;

  @Prop({ default: false })
  friendly: boolean;

  @Prop({ default: false })
  quiet: boolean;

  @Prop({ default: false })
  active: boolean;

  @Prop({ default: false })
  protective: boolean;

  @Prop({ default: false })
  kidfriendly: boolean;

  @Prop()
  specialDiet: string;
}

export const PetsSchema = SchemaFactory.createForClass(Pets);