import { Module, forwardRef } from '@nestjs/common';
import { AppointmentsController } from './appointments.controller';
import { AppointmentsService } from './appointments.service';
import { PrismaService } from '../prisma/prisma.service';
import { QueueModule } from '../queue/queue.module';
import { ReminderProcessor } from './queues/reminder.processor';
import { ReminderScheduler } from './queues/reminder.scheduler';
import { MailModule } from '../mail/mail.module';
import {
  AppointmentCrudService,
  AppointmentValidationService,
  AppointmentReminderService,
  AppointmentAdminService,
} from './services';

@Module({
  imports: [QueueModule, forwardRef(() => MailModule)],
  controllers: [AppointmentsController],
  providers: [
    AppointmentsService,
    AppointmentCrudService,
    AppointmentValidationService,
    AppointmentReminderService,
    AppointmentAdminService,
    PrismaService,
    ReminderProcessor,
    ReminderScheduler,
  ],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
