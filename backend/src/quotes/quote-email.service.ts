import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { MailService } from '../mail/mail.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { EmailRenderer } from '../email-templates/EmailRenderer';

@Injectable()
export class QuoteEmailService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly mailService: MailService,
  ) {}

  async sendQuoteNotificationEmail(quoteDto: CreateQuoteDto, quoteId: string) {
    const subject = `Nouvelle demande de devis - ${quoteDto.firstName} ${quoteDto.lastName}`;

    const html = await EmailRenderer.renderAdminQuoteNotification({
      contactName: `${quoteDto.firstName} ${quoteDto.lastName}`,
      contactEmail: quoteDto.email,
      contactPhone: quoteDto.phone,
      acceptPhone: quoteDto.acceptPhone,
      message: quoteDto.message,
    });

    // Utiliser l'email admin depuis les variables d'environnement
    const adminEmail =
      process.env.ADMIN_EMAIL || 'kenzokerachi@hotmail.fr (dev test)';

    await this.mailService.sendEmail(adminEmail, subject, html);

    // Logger l'email dans la base de données
    await this.prisma.emailLog.create({
      data: {
        quoteId,
        to: adminEmail,
        subject,
        template: 'quote-notification-admin',
        meta: {
          contact: {
            firstName: quoteDto.firstName,
            lastName: quoteDto.lastName,
            email: quoteDto.email,
            phone: quoteDto.phone,
          },
          preferences: {
            acceptPhone: quoteDto.acceptPhone,
            acceptTerms: quoteDto.acceptTerms,
          },
        },
      },
    });
  }

  async sendQuoteConfirmationEmail(quoteDto: CreateQuoteDto, quoteId: string) {
    const subject = 'Confirmation de réception - Demande de devis SystemsMatic';

    const html = await EmailRenderer.renderQuoteConfirmation({
      contactName: quoteDto.firstName,
      email: quoteDto.email,
      phone: quoteDto.phone,
      acceptPhone: quoteDto.acceptPhone,
      message: quoteDto.message,
    });

    await this.mailService.sendEmail(quoteDto.email, subject, html);

    // Logger l'email dans la base de données
    await this.prisma.emailLog.create({
      data: {
        quoteId,
        to: quoteDto.email,
        subject,
        template: 'quote-confirmation-client',
        meta: {
          contact: {
            firstName: quoteDto.firstName,
            lastName: quoteDto.lastName,
          },
          projectDescription: quoteDto.message,
          preferences: {
            acceptPhone: quoteDto.acceptPhone,
            acceptTerms: quoteDto.acceptTerms,
          },
        },
      },
    });
  }

  async sendQuoteAcceptedEmail(quote: any) {
    const subject = 'Devis accepté - SystemsMatic';

    const html = await EmailRenderer.renderQuoteAccepted({
      contactName: quote.contact.firstName,
      projectDescription: quote.projectDescription,
    });

    await this.mailService.sendEmail(quote.contact.email, subject, html);

    // Logger l'email dans la base de données
    await this.prisma.emailLog.create({
      data: {
        quoteId: quote.id,
        to: quote.contact.email,
        subject,
        template: 'quote-accepted-client',
        meta: {
          contact: {
            firstName: quote.contact.firstName,
            lastName: quote.contact.lastName,
          },
          projectDescription: quote.projectDescription,
          status: 'ACCEPTED',
        },
      },
    });
  }

  async sendQuoteRejectedEmail(quote: any, rejectionReason?: string) {
    const subject = 'Demande de devis - SystemsMatic';

    const html = await EmailRenderer.renderQuoteRejected({
      contactName: quote.contact.firstName,
      projectDescription: quote.projectDescription,
      rejectionReason,
    });

    await this.mailService.sendEmail(quote.contact.email, subject, html);

    // Logger l'email dans la base de données
    await this.prisma.emailLog.create({
      data: {
        quoteId: quote.id,
        to: quote.contact.email,
        subject,
        template: 'quote-rejected-client',
        meta: {
          contact: {
            firstName: quote.contact.firstName,
            lastName: quote.contact.lastName,
          },
          projectDescription: quote.projectDescription,
          status: 'REJECTED',
          rejectionReason: rejectionReason || null,
        },
      },
    });
  }
}
