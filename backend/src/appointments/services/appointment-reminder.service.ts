import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ReminderScheduler } from '../queues/reminder.scheduler';

/**
 * Service de gestion des rappels de rendez-vous
 */
@Injectable()
export class AppointmentReminderService {
  private readonly logger = new Logger(AppointmentReminderService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly reminder: ReminderScheduler,
  ) {}

  /**
   * Crée un rappel pour un rendez-vous
   */
  async createReminder(appointmentId: string, scheduledAt: Date) {
    const reminderDueAt = new Date(scheduledAt);
    reminderDueAt.setHours(reminderDueAt.getHours() - 24); // 24h avant

    const reminder = await this.prisma.reminder.create({
      data: {
        appointmentId,
        dueAt: reminderDueAt,
      },
    });

    // Planifier le rappel et mettre à jour la référence du provider
    const jobId = await this.reminder.scheduleReminder({
      id: appointmentId,
      scheduledAt,
    });

    if (jobId) {
      await this.prisma.reminder.update({
        where: { id: reminder.id },
        data: { providerRef: jobId },
      });
    }

    return reminder;
  }

  /**
   * Met à jour un rappel existant
   */
  async updateReminder(appointmentId: string, scheduledAt: Date) {
    const reminderDueAt = new Date(scheduledAt);
    reminderDueAt.setHours(reminderDueAt.getHours() - 24);

    const existingReminder = await this.prisma.reminder.findUnique({
      where: { appointmentId },
    });

    if (existingReminder) {
      // Annuler l'ancien rappel
      if (existingReminder.providerRef) {
        await this.reminder.cancelReminder(existingReminder.providerRef);
      }

      // Planifier le nouveau rappel
      const jobId = await this.reminder.scheduleReminder({
        id: appointmentId,
        scheduledAt,
      });

      // Mettre à jour le rappel existant
      await this.prisma.reminder.update({
        where: { id: existingReminder.id },
        data: {
          dueAt: reminderDueAt,
          providerRef: jobId || null,
        },
      });

      return existingReminder;
    } else {
      // Créer un nouveau rappel
      return this.createReminder(appointmentId, scheduledAt);
    }
  }

  /**
   * Supprime un rappel
   */
  async deleteReminder(appointmentId: string) {
    const reminder = await this.prisma.reminder.findUnique({
      where: { appointmentId },
    });

    if (reminder?.providerRef) {
      await this.reminder.cancelReminder(reminder.providerRef);
    }

    if (reminder) {
      await this.prisma.reminder.delete({
        where: { id: reminder.id },
      });
    }

    return reminder;
  }

  /**
   * Trouve un rappel par ID de rendez-vous
   */
  async findByAppointmentId(appointmentId: string) {
    return this.prisma.reminder.findUnique({
      where: { appointmentId },
    });
  }
}
