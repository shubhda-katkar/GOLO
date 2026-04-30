import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EducationDocument = Education & Document;

@Schema({ _id: false, timestamps: false })
export class Education {

  @Prop({
    required: true,
    enum: ['tuition', 'coaching', 'online course', 'workshop', 'other']
  })
  courseType: string;

  @Prop({
    required: true,
    enum: ['online', 'offline']
  })
  modeOfEducation: string;

  @Prop({
    required: true,
    enum: ['yes', 'no']
  })
  demoAvailable: string;

  @Prop()
  class: string;

  @Prop()
  subject: string;

  @Prop()
  institute: string;

  @Prop()
  duration: string;

  @Prop()
  fees: number;

  @Prop()
  experience: string;

  @Prop()
  qualification: string;

  @Prop({ type: [String] })
  images: string[];
}

export const EducationSchema = SchemaFactory.createForClass(Education);