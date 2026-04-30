import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type GreetingsDocument = Greetings & Document;

@Schema({ _id: false, timestamps: false })
export class Greetings {

    @Prop()
    noticeType?: string;

    // Greetings
    @Prop()
    relationType?: string;

    @Prop()
    name?: string;

    @Prop()
    age?: string;

    @Prop()
    year?: string;

    @Prop()
    wishes?: string;

    @Prop()
    from?: string;

    // Tribute
    @Prop()
    name2?: string;

    @Prop()
    age2?: string;

    @Prop()
    year2?: string;

    @Prop()
    summary?: string;

    @Prop()
    funeralDetails?: string;

}

export const GreetingsSchema = SchemaFactory.createForClass(Greetings);