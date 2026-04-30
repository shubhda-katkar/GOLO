import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PersonalDocument = Personal & Document;

@Schema({ _id: false, timestamps: false })
export class Personal {

    @Prop()
    name?: string;

    @Prop()
    gender?: string;

    @Prop()
    age?: string;

    @Prop()
    achievementTitle?: string;

    @Prop()
    description?: string;

    @Prop()
    contact?: string;

}

export const PersonalSchema = SchemaFactory.createForClass(Personal);