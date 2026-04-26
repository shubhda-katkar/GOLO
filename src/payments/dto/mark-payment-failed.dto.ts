import { IsOptional, IsString } from 'class-validator';

export class MarkPaymentFailedDto {
  @IsOptional()
  @IsString()
  razorpayOrderId?: string;

  @IsOptional()
  @IsString()
  razorpayPaymentId?: string;

  @IsOptional()
  @IsString()
  failureCode?: string;

  @IsOptional()
  @IsString()
  failureDescription?: string;
}
