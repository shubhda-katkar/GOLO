import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ConversationDocument = Conversation & Document;

@Schema({ timestamps: true, collection: 'conversations' })
export class Conversation {
  @Prop()
  adId?: string;

  @Prop()
  adTitle?: string;

  @Prop({ type: [String], required: true })
  participants: string[];

  @Prop({ required: true })
  participantKey: string;

  @Prop()
  lastMessageText?: string;

  @Prop()
  lastMessageAdId?: string;

  @Prop()
  lastMessageAdTitle?: string;

  @Prop({ default: Date.now })
  lastMessageAt: Date;

  @Prop({ default: 0 })
  messagesCount: number;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ConversationSchema = SchemaFactory.createForClass(Conversation);

ConversationSchema.index({ participants: 1, lastMessageAt: -1 });
ConversationSchema.index({ participantKey: 1 }, { unique: true });
