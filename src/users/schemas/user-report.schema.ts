import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from './user.schema';

export enum UserReportReason {
  HARASSMENT = 'harassment',
  ABUSE = 'abuse',
  FRAUD = 'fraud',
  SCAM = 'scam',
  FAKE_ACCOUNT = 'fake_account',
  SPAM = 'spam',
  OTHER = 'other',
}

export enum UserReportStatus {
  PENDING = 'pending',
  UNDER_INVESTIGATION = 'under_investigation',
  RESOLVED = 'resolved',
  DISMISSED = 'dismissed',
}

export type UserReportDocument = UserReport & Document;

@Schema({
  timestamps: true,
  collection: 'user_reports',
})
export class UserReport {
  @Prop({ type: String, required: true, unique: true })
  reportId: string;

  @Prop({ type: String, ref: 'User', required: true, index: true })
  reportedUserId: string;

  @Prop({ type: String, ref: 'User', required: true, index: true })
  reportedBy: string;

  @Prop({
    type: String,
    enum: UserReportReason,
    required: true,
    default: UserReportReason.OTHER,
  })
  reason: UserReportReason;

  @Prop({ type: String, maxlength: 500, trim: true })
  description?: string;

  @Prop({
    type: String,
    enum: UserReportStatus,
    default: UserReportStatus.PENDING,
    index: true,
  })
  status: UserReportStatus;

  @Prop({ type: String })
  adminNotes?: string;

  @Prop({ type: String, default: null })
  assignedTo?: string;

  @Prop({ type: [String] })
  evidenceUrls?: string[];

  @Prop({ type: Number, default: 0 })
  priority: number;

  @Prop({ type: Date, default: null })
  resolvedAt?: Date;

  @Prop({ type: Date })
  createdAt?: Date;

  @Prop({ type: Date })
  updatedAt?: Date;
}

export const UserReportSchema = SchemaFactory.createForClass(UserReport);
UserReportSchema.index({ reportedUserId: 1, status: 1 });
UserReportSchema.index({ reportedBy: 1, createdAt: -1 });
UserReportSchema.index({ status: 1, createdAt: -1 });
