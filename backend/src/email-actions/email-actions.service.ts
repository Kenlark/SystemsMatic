import {
  Injectable,
  Logger,
  BadRequestException,
  Inject,
  forwardRef,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AppointmentsService } from '../appointments/appointments.service';
import { QuotesService } from '../quotes/quotes.service';
import { MailService } from '../mail/mail.service';
import { AppointmentStatus } from '@prisma/client';
import { randomBytes } from 'crypto';

@Injectable()
export class EmailActionsService {
  private readonly logger = new Logger(EmailActionsService.name);

  constructor(
    private readonly prisma: PrismaService,
    @Inject(forwardRef(() => AppointmentsService))
    private readonly appointmentsService: AppointmentsService,
    @Inject(forwardRef(() => QuotesService))
    private readonly quotesService: QuotesService,
    @Inject(forwardRef(() => MailService))
    private readonly mailService: MailService,
  ) {}

  /**
   * Génère un token sécurisé pour les actions d'email
   */
  private generateActionToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Crée un token d'action avec expiration
   */
  async createActionToken(
    type: 'appointment' | 'quote',
    entityId: string,
    action: string,
    expiresInHours: number = 24,
  ): Promise<string> {
    const token = this.generateActionToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expiresInHours);

    await this.prisma.emailActionToken.create({
      data: {
        token,
        type,
        entityId,
        action,
        expiresAt,
        isUsed: false,
      },
    });

    return token;
  }

  /**
   * Vérifie et utilise un token d'action
   */
  async verifyAndUseToken(token: string): Promise<any> {
    const tokenRecord = await this.prisma.emailActionToken.findUnique({
      where: { token },
    });

    if (!tokenRecord) {
      throw new BadRequestException('Token invalide');
    }

    if (tokenRecord.isUsed) {
      throw new BadRequestException('Token déjà utilisé');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new BadRequestException('Token expiré');
    }

    // Marquer le token comme utilisé
    await this.prisma.emailActionToken.update({
      where: { id: tokenRecord.id },
      data: { isUsed: true, usedAt: new Date() },
    });

    return tokenRecord;
  }

  /**
   * Vérifie la validité d'un token sans l'utiliser
   */
  async verifyToken(
    token: string,
  ): Promise<{ valid: boolean; type?: string; action?: string }> {
    try {
      const tokenRecord = await this.prisma.emailActionToken.findUnique({
        where: { token },
      });

      if (
        !tokenRecord ||
        tokenRecord.isUsed ||
        tokenRecord.expiresAt < new Date()
      ) {
        return { valid: false };
      }

      return {
        valid: true,
        type: tokenRecord.type,
        action: tokenRecord.action,
      };
    } catch (error) {
      return { valid: false };
    }
  }

  /**
   * Accepter un rendez-vous via email
   */
  async acceptAppointment(
    id: string,
    data: { scheduledAt?: string; token: string },
  ) {
    const tokenRecord = await this.verifyAndUseToken(data.token);

    if (tokenRecord.type !== 'appointment' || tokenRecord.entityId !== id) {
      throw new BadRequestException('Token invalide pour cette action');
    }

    const updateData: any = {
      status: AppointmentStatus.CONFIRMED,
      confirmedAt: new Date(),
    };

    if (data.scheduledAt) {
      updateData.scheduledAt = new Date(data.scheduledAt);
    }

    const appointment = await this.appointmentsService.updateStatusAdmin(
      id,
      updateData,
    );

    // Envoyer un email de confirmation au client
    await this.mailService.sendAppointmentConfirmation(appointment);

    this.logger.log(`Rendez-vous ${id} accepté via email`);

    return {
      success: true,
      message: 'Rendez-vous accepté avec succès',
      appointment,
    };
  }

  /**
   * Refuser un rendez-vous via email
   */
  async rejectAppointment(
    id: string,
    data: { reason?: string; token: string },
  ) {
    const tokenRecord = await this.verifyAndUseToken(data.token);

    if (tokenRecord.type !== 'appointment' || tokenRecord.entityId !== id) {
      throw new BadRequestException('Token invalide pour cette action');
    }

    const appointment = await this.appointmentsService.updateStatusAdmin(id, {
      status: AppointmentStatus.CANCELLED,
    });

    // Envoyer un email d'annulation au client
    await this.mailService.sendAppointmentCancelled(appointment);

    this.logger.log(`Rendez-vous ${id} refusé via email`);

    return {
      success: true,
      message: 'Rendez-vous refusé avec succès',
      appointment,
    };
  }

  /**
   * Proposer une reprogrammation via email
   */
  async proposeReschedule(
    id: string,
    data: { newScheduledAt: string; token: string },
  ) {
    const tokenRecord = await this.verifyAndUseToken(data.token);

    if (tokenRecord.type !== 'appointment' || tokenRecord.entityId !== id) {
      throw new BadRequestException('Token invalide pour cette action');
    }

    const appointment = await this.appointmentsService.proposeRescheduleAdmin(
      id,
      data.newScheduledAt,
    );

    this.logger.log(
      `Reprogrammation proposée pour le rendez-vous ${id} via email`,
    );

    return {
      success: true,
      message: 'Proposition de reprogrammation envoyée',
      appointment,
    };
  }

  /**
   * Accepter un devis via email
   */
  async acceptQuote(
    id: string,
    data: { document?: string; validUntil?: string; token: string },
  ) {
    const tokenRecord = await this.verifyAndUseToken(data.token);

    if (tokenRecord.type !== 'quote' || tokenRecord.entityId !== id) {
      throw new BadRequestException('Token invalide pour cette action');
    }

    const quote = await this.quotesService.acceptQuote(id, {
      document: data.document,
      validUntil: data.validUntil,
    });

    // Envoyer un email de confirmation au client
    await this.mailService.sendQuoteAccepted(quote);

    this.logger.log(`Devis ${id} accepté via email`);

    return {
      success: true,
      message: 'Devis accepté avec succès',
      quote,
    };
  }

  /**
   * Refuser un devis via email
   */
  async rejectQuote(
    id: string,
    data: { rejectionReason: string; token: string },
  ) {
    const tokenRecord = await this.verifyAndUseToken(data.token);

    if (tokenRecord.type !== 'quote' || tokenRecord.entityId !== id) {
      throw new BadRequestException('Token invalide pour cette action');
    }

    const quote = await this.quotesService.rejectQuote(
      id,
      data.rejectionReason,
    );

    // Envoyer un email de refus au client
    await this.mailService.sendQuoteRejected(quote);

    this.logger.log(`Devis ${id} refusé via email`);

    return {
      success: true,
      message: 'Devis refusé avec succès',
      quote,
    };
  }
}
