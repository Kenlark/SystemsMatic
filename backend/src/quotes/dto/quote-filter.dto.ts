import { IsOptional, IsString, IsNumberString, IsIn } from 'class-validator';

export class QuoteFilterDto {
  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;

  @IsOptional()
  @IsIn(['PENDING', 'PROCESSING', 'SENT', 'ACCEPTED', 'REJECTED', 'EXPIRED'])
  status?: string;

  @IsOptional()
  @IsString()
  contactId?: string;

  @IsOptional()
  @IsString()
  search?: string; // Recherche par nom ou email du contact
}
