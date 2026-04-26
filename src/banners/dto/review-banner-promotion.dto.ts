import { IsIn, IsOptional, IsString } from 'class-validator';

export class ReviewBannerPromotionDto {
  @IsIn(['approve', 'reject'])
  decision: 'approve' | 'reject';

  @IsOptional()
  @IsString()
  adminNotes?: string;
}
