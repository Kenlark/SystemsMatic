import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EmailActionsService } from './email-actions.service';
import { AppointmentStatus } from '@prisma/client';

@Controller('email-actions')
export class EmailActionsController {
  constructor(private readonly emailActionsService: EmailActionsService) {}

  /**
   * Accepter un rendez-vous via email
   */
  @Post('appointments/:id/accept')
  async acceptAppointment(
    @Param('id') id: string,
    @Body() data: { scheduledAt?: string; token: string },
  ) {
    try {
      return await this.emailActionsService.acceptAppointment(id, data);
    } catch (error) {
      throw new HttpException(
        error.message || "Erreur lors de l'acceptation du rendez-vous",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Refuser un rendez-vous via email
   */
  @Post('appointments/:id/reject')
  async rejectAppointment(
    @Param('id') id: string,
    @Body() data: { reason?: string; token: string },
  ) {
    try {
      return await this.emailActionsService.rejectAppointment(id, data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors du refus du rendez-vous',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Proposer une reprogrammation via email
   */
  @Post('appointments/:id/propose-reschedule')
  async proposeReschedule(
    @Param('id') id: string,
    @Body() data: { newScheduledAt: string; token: string },
  ) {
    try {
      return await this.emailActionsService.proposeReschedule(id, data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la proposition de reprogrammation',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Accepter un devis via email
   */
  @Post('quotes/:id/accept')
  async acceptQuote(
    @Param('id') id: string,
    @Body() data: { document?: string; validUntil?: string; token: string },
  ) {
    try {
      return await this.emailActionsService.acceptQuote(id, data);
    } catch (error) {
      throw new HttpException(
        error.message || "Erreur lors de l'acceptation du devis",
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Refuser un devis via email
   */
  @Post('quotes/:id/reject')
  async rejectQuote(
    @Param('id') id: string,
    @Body() data: { rejectionReason: string; token: string },
  ) {
    try {
      return await this.emailActionsService.rejectQuote(id, data);
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors du refus du devis',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Vérifier la validité d'un token d'action
   */
  @Get('verify-token/:token')
  async verifyToken(@Param('token') token: string) {
    try {
      return await this.emailActionsService.verifyToken(token);
    } catch (error) {
      throw new HttpException(
        error.message || 'Token invalide ou expiré',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  /**
   * Endpoint de test pour créer des tokens (développement uniquement)
   */
  @Post('test/create-tokens')
  async createTestTokens(
    @Body() data: { type: 'appointment' | 'quote'; entityId: string },
  ) {
    try {
      if (process.env.NODE_ENV === 'production') {
        throw new HttpException(
          'Endpoint de test non disponible en production',
          HttpStatus.FORBIDDEN,
        );
      }

      const tokens = await Promise.all([
        this.emailActionsService.createActionToken(
          data.type,
          data.entityId,
          'accept',
        ),
        this.emailActionsService.createActionToken(
          data.type,
          data.entityId,
          'reject',
        ),
        ...(data.type === 'appointment'
          ? [
              this.emailActionsService.createActionToken(
                data.type,
                data.entityId,
                'reschedule',
              ),
            ]
          : []),
      ]);

      return {
        success: true,
        tokens: {
          accept: tokens[0],
          reject: tokens[1],
          ...(data.type === 'appointment' && { reschedule: tokens[2] }),
        },
        urls: {
          accept: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/email-actions/${data.type}s/${data.entityId}/accept?token=${tokens[0]}`,
          reject: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/email-actions/${data.type}s/${data.entityId}/reject?token=${tokens[1]}`,
          ...(data.type === 'appointment' && {
            reschedule: `${process.env.PUBLIC_URL || 'http://localhost:3000'}/email-actions/appointments/${data.entityId}/propose-reschedule?token=${tokens[2]}`,
          }),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message || 'Erreur lors de la création des tokens de test',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
