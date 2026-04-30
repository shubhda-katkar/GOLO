import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PropertyDocument = Property & Document;

@Schema({ _id: false, timestamps: false })
export class Property {

  @Prop({ required: true })
  noticeType: string;

  @Prop()
  propertyType: string;

  // Sell
  @Prop()
  bhk: string;

  @Prop()
  builtUpArea: string;

  @Prop()
  bathrooms: string;

  @Prop()
  floor: string;

  @Prop()
  propertyAge: string;

  @Prop()
  furnishing: string;

  @Prop()
  condition: string; // parking yes/no

  @Prop()
  facingSide: string;

  @Prop()
  price: string;

  // Rent
  @Prop()
  monthlyRentAmount: string;

  @Prop()
  securityDeposit: string;

  @Prop()
  maintenanceAmount: string;

  @Prop()
  availableFrom: string;

  @Prop()
  tenantType: string;

  @Prop()
  leaseDuration: string;
}

export const PropertySchema = SchemaFactory.createForClass(Property);