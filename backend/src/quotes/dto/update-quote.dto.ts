import { IsOptional, IsString, IsDateString, IsIn } from 'class-validator';

export class UpdateQuoteDto {
  @IsOptional()
  @IsIn(['PENDING', 'PROCESSING', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'])
  status?: string;

  @IsOptional()
  @IsDateString()
  quoteValidUntil?: string;

  @IsOptional()
  @IsString()
  quoteDocument?: string;

  @IsOptional()
  @IsString()
  rejectionReason?: string;
}
