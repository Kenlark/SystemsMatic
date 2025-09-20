import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AppointmentsService } from '../appointments/appointments.service';
import { QuotesService } from '../quotes/quotes.service';
import { AppointmentStatus } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AdminGuard } from '../auth/guards/admin.guard';
import { UpdateQuoteDto } from '../quotes/dto/update-quote.dto';

@Controller('backoffice')
@UseGuards(JwtAuthGuard, AdminGuard)
export class BackofficeController {
  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly quotesService: QuotesService,
  ) {}

  @Get('appointments')
  async getAppointments(@Query('status') status?: AppointmentStatus) {
    return this.appointmentsService.findAllAdmin(status);
  }

  @Get('appointments/pending')
  async getPendingAppointments() {
    return this.appointmentsService.findAllAdmin('PENDING');
  }

  @Get('appointments/upcoming')
  async getUpcomingAppointments(@Query('days') days?: string) {
    const daysNumber = days ? parseInt(days, 10) : 7;
    return this.appointmentsService.getUpcomingAdmin(daysNumber);
  }

  @Get('appointments/stats')
  async getStats() {
    return this.appointmentsService.getStatsAdmin();
  }

  @Get('appointments/:id')
  async getAppointment(@Param('id') id: string) {
    return this.appointmentsService.findOneAdmin(id);
  }

  @Put('appointments/:id/status')
  async updateAppointmentStatus(
    @Param('id') id: string,
    @Body()
    data: {
      status: AppointmentStatus;
      scheduledAt?: string;
    },
  ) {
    return this.appointmentsService.updateStatusAdmin(id, data);
  }

  @Put('appointments/:id/reschedule')
  async rescheduleAppointment(
    @Param('id') id: string,
    @Body() data: { scheduledAt: string },
  ) {
    return this.appointmentsService.rescheduleAdmin(id, data);
  }

  @Delete('appointments/:id')
  async deleteAppointment(@Param('id') id: string) {
    await this.appointmentsService.deleteAdmin(id);
    return { message: 'Rendez-vous supprimé avec succès' };
  }

  @Post('appointments/:id/reminder')
  async sendReminder(@Param('id') id: string) {
    return this.appointmentsService.sendReminderAdmin(id);
  }

  @Post('appointments/:id/reschedule')
  async proposeReschedule(
    @Param('id') id: string,
    @Body() data: { newScheduledAt: string },
  ) {
    return this.appointmentsService.proposeRescheduleAdmin(
      id,
      data.newScheduledAt,
    );
  }

  // === GESTION DES DEVIS ===

  @Get('quotes')
  async getQuotes(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const pageNum = parseInt(page || '1');
    const limitNum = parseInt(limit || '10');

    return this.quotesService.findAllWithFilters(pageNum, limitNum, {
      status,
      search,
    });
  }

  @Get('quotes/stats')
  async getQuotesStats() {
    return this.quotesService.getStats();
  }

  @Get('quotes/:id')
  async getQuote(@Param('id') id: string) {
    return this.quotesService.findOne(id);
  }

  @Put('quotes/:id')
  async updateQuote(
    @Param('id') id: string,
    @Body() updateQuoteDto: UpdateQuoteDto,
  ) {
    return this.quotesService.updateQuote(id, updateQuoteDto);
  }

  @Put('quotes/:id/status')
  async updateQuoteStatus(
    @Param('id') id: string,
    @Body() data: { status: string; data?: any },
  ) {
    return this.quotesService.updateStatus(id, data.status, data.data);
  }

  // === DASHBOARD GLOBAL ===

  @Get('dashboard')
  async getDashboard() {
    const [appointmentStats, quoteStats] = await Promise.all([
      this.appointmentsService.getStatsAdmin(),
      this.quotesService.getStats(),
    ]);

    return {
      appointments: appointmentStats,
      quotes: quoteStats,
    };
  }

  @Get('profile')
  async getProfile(@Request() req) {
    return {
      id: req.user.sub,
      email: req.user.email,
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      role: req.user.role,
    };
  }
}
