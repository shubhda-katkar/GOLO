import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type VehicleDocument = Vehicle & Document;

@Schema({ _id: false, timestamps: false })
export class Vehicle {

  @Prop({ required: true, enum: ['Rent', 'Sell'] })
  type: string;

  @Prop()
  vehicleType?: string;

  @Prop()
  vehicleType2?: string;

  @Prop()
  brand?: string;

  @Prop()
  brand2?: string;

  @Prop()
  model?: string;

  @Prop()
  variant?: string;

  @Prop()
  year?: number;

  @Prop()
  kilometersDriven?: number;

  @Prop()
  fuelType?: string;

  @Prop({ enum: ['Manual', 'Automatic'] })
  transmission?: string;

  @Prop()
  ownership?: string;

  @Prop()
  insurance?: string;

  @Prop()
  condition?: string;

  @Prop()
  price?: number;

  // Rent fields

  @Prop()
  perDayRentAmount?: number;

  @Prop()
  securityDeposit?: number;

  @Prop({ enum: ['yes', 'no', 'both'] })
  includesDriver?: string;

  @Prop()
  minRentalDuration?: string;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);