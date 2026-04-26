import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ReportStatus } from '../schemas/report.schema';

export class UpdateReportStatusDto {
  @IsEnum(ReportStatus, {
    message: 'Status must be one of: pending, reviewed, action_taken',
  })
  status: ReportStatus;

  @IsString()
  @IsOptional()
  adminNotes?: string;
}
