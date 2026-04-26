import { IsString, IsArray, IsOptional, IsNumber, IsDate, IsBoolean, IsEnum, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateOfferDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(['b1g1', 'b2g2', '50%off', '70%off', 'custom'])
  offerType: string;

  @IsArray()
  @IsString({ each: true })
  products: string[];

  @Type(() => Date)
  @IsDate()
  validFrom: Date;

  @Type(() => Date)
  @IsDate()
  validTo: Date;

  @IsOptional()
  @IsBoolean()
  loyaltyEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  stars?: number;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;
}

export class UpdateOfferDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(['b1g1', 'b2g2', '50%off', '70%off', 'custom'])
  offerType?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  products?: string[];

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validFrom?: Date;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validTo?: Date;

  @IsOptional()
  @IsBoolean()
  loyaltyEnabled?: boolean;

  @IsOptional()
  @IsNumber()
  stars?: number;

  @IsOptional()
  @IsString()
  termsAndConditions?: string;

  @IsOptional()
  @IsEnum(['active', 'inactive', 'expired'])
  status?: string;
}
