import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { AppointmentsModule } from './appointments/appointments.module';
import { ContactsService } from './contacts/contacts.service';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { QueueModule } from './queue/queue.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
    AppointmentsModule,
    MailModule,
    QueueModule,
  ],
  controllers: [AppController],
  providers: [AppService, ContactsService, MailService],
})
export class AppModule {}
