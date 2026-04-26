import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type OfferDocument = Offer & Document;

@Schema({ timestamps: true })
export class Offer {
  @Prop({ required: true, unique: true, index: true })
  offerId: string;

  @Prop({ required: true, index: true })
  merchantId: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  description?: string;

  @Prop({ required: true, enum: ['b1g1', 'b2g2', '50%off', '70%off', 'custom'] })
  offerType: string;

  @Prop({ type: [Types.ObjectId], default: [] })
  products: Types.ObjectId[];

  @Prop()
  validFrom: Date;

  @Prop()
  validTo: Date;

  @Prop({ default: false })
  loyaltyEnabled: boolean;

  @Prop()
  stars?: number;

  @Prop()
  termsAndConditions?: string;

  @Prop({ default: 'active', enum: ['active', 'inactive', 'expired'] })
  status: string;

  @Prop({ default: 0 })
  views: number;

  @Prop({ default: 0 })
  redeemed: number;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 0 })
  reviewCount: number;

  @Prop({ default: true })
  isVisible: boolean;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const OfferSchema = SchemaFactory.createForClass(Offer);

OfferSchema.index({ merchantId: 1, createdAt: -1 });
OfferSchema.index({ offerType: 1 });
OfferSchema.index({ status: 1, isVisible: 1 });
OfferSchema.index({ merchantId: 1, status: 1 });
