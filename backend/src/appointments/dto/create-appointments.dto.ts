import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  IsBoolean,
  IsNotEmpty,
} from 'class-validator';
import { AppointmentReason } from '@prisma/client';

export class CreateAppointmentDto {
  @IsString() @IsNotEmpty() firstName: string;
  @IsString() @IsNotEmpty() lastName: string;
  @IsEmail() email: string;
  @IsOptional() @IsString() phone?: string;

  @IsOptional() @IsEnum(AppointmentReason) reason?: AppointmentReason;
  @IsOptional() @IsString() reasonOther?: string;
  @IsOptional() @IsString() message?: string;

  @IsBoolean() consent: boolean;
}
