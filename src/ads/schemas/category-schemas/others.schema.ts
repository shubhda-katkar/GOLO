import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type OthersDocument = Others & Document;

@Schema({ _id: false, timestamps: false })
export class Others {

    @Prop()
    title?: string;

    @Prop()
    description?: string;

    @Prop()
    price?: string;

}

export const OthersSchema = SchemaFactory.createForClass(Others);