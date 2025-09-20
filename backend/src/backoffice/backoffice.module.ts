import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { BackofficeController } from './backoffice.controller';
import { AppointmentsModule } from '../appointments/appointments.module';
import { QuotesModule } from '../quotes/quotes.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [HttpModule, AppointmentsModule, QuotesModule, AuthModule],
  controllers: [BackofficeController],
})
export class BackofficeModule {}
