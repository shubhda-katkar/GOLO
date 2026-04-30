import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PublicNoticeDocument = PublicNotice & Document;

@Schema({ _id: false, timestamps: false })
export class PublicNotice {

    @Prop()
    noticetype?: string;

    @Prop()
    issuingAuthority?: string;

    @Prop()
    referenceNumber?: string;

    @Prop()
    publishDate?: string;

    @Prop()
    expiryDate?: string;

    @Prop()
    detailedNotice?: string;

    @Prop({
        type: {
            name: String,
            uri: String,
            size: Number,
            mimeType: String,
        },
    })
    pdf?: {
        name?: string;
        uri?: string;
        size?: number;
        mimeType?: string;
    };

}

export const PublicNoticeSchema = SchemaFactory.createForClass(PublicNotice);