import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EmploymentDocument = Employment & Document;

@Schema({ _id: false, timestamps: false })
export class Employment {

  @Prop({
    required: true,
    enum: ['full time', 'part time', 'contract'],
  })
  employmentType: string;

  @Prop({
    required: true,
    enum: ['entry level', 'mid level', 'senior level'],
  })
  experienceLevel: string;

  @Prop()
  industry: string;

  @Prop()
  salaryRangeMin: string;

  @Prop()
  salaryRangeMax: string;

  @Prop()
  vacancies: number;

  // Benefits
  @Prop({ default: false })
  insurance: boolean;

  @Prop({ default: false })
  paidoff: boolean;

  @Prop({ default: false })
  workFromHome: boolean;

  @Prop({ default: false })
  annualBonus: boolean;
}

export const EmploymentSchema = SchemaFactory.createForClass(Employment);