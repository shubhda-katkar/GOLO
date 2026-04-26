import { IsOptional, IsString } from 'class-validator';

export class PayBannerPromotionDto {
  @IsOptional()
  @IsString()
  paymentReference?: string;
}
