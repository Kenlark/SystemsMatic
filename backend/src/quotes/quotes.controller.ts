import {
  Controller,
  Post,
  Get,
  Put,
  Param,
  Body,
  Query,
  ValidationPipe,
  HttpStatus,
  HttpException,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { QuoteFilterDto } from './dto/quote-filter.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('quotes')
export class QuotesController {
  private readonly logger = new Logger(QuotesController.name);

  constructor(private readonly quotesService: QuotesService) {}

  @Post()
  async create(@Body(new ValidationPipe()) createQuoteDto: CreateQuoteDto) {
    try {
      this.logger.log('Nouvelle demande de devis reçue');

      // Validation supplémentaire des conditions générales
      if (!createQuoteDto.acceptTerms) {
        throw new HttpException(
          "L'acceptation des conditions générales est obligatoire",
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.quotesService.create(createQuoteDto);

      this.logger.log('Demande de devis traitée avec succès');
      return result;
    } catch (error) {
      this.logger.error(
        'Erreur lors du traitement de la demande de devis:',
        error,
      );

      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Une erreur est survenue lors du traitement de votre demande',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // Endpoints pour la gestion admin (back-office)

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query(new ValidationPipe()) filters: QuoteFilterDto) {
    try {
      const page = parseInt(filters.page || '1');
      const limit = parseInt(filters.limit || '10');

      return await this.quotesService.findAllWithFilters(page, limit, filters);
    } catch (error) {
      this.logger.error('Erreur lors de la récupération des devis:', error);
      throw new HttpException(
        'Erreur lors de la récupération des devis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('stats')
  async getStats() {
    try {
      return await this.quotesService.getStats();
    } catch (error) {
      this.logger.error(
        'Erreur lors de la récupération des statistiques:',
        error,
      );
      throw new HttpException(
        'Erreur lors de la récupération des statistiques',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      const quote = await this.quotesService.findOne(id);
      if (!quote) {
        throw new HttpException('Devis introuvable', HttpStatus.NOT_FOUND);
      }
      return quote;
    } catch (error) {
      this.logger.error(
        `Erreur lors de la récupération du devis ${id}:`,
        error,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la récupération du devis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body(new ValidationPipe()) updateQuoteDto: UpdateQuoteDto,
  ) {
    try {
      const quote = await this.quotesService.findOne(id);
      if (!quote) {
        throw new HttpException('Devis introuvable', HttpStatus.NOT_FOUND);
      }

      return await this.quotesService.updateQuote(id, updateQuoteDto);
    } catch (error) {
      this.logger.error(`Erreur lors de la mise à jour du devis ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la mise à jour du devis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body() body: { status: string; data?: any },
  ) {
    try {
      const quote = await this.quotesService.findOne(id);
      if (!quote) {
        throw new HttpException('Devis introuvable', HttpStatus.NOT_FOUND);
      }

      return await this.quotesService.updateStatus(id, body.status, body.data);
    } catch (error) {
      this.logger.error(
        `Erreur lors de la mise à jour du statut du devis ${id}:`,
        error,
      );
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors de la mise à jour du statut',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/accept')
  async acceptQuote(
    @Param('id') id: string,
    @Body() body: { document?: string; validUntil?: string },
  ) {
    try {
      const quote = await this.quotesService.findOne(id);
      if (!quote) {
        throw new HttpException('Devis introuvable', HttpStatus.NOT_FOUND);
      }

      if (quote.status !== 'PENDING' && quote.status !== 'PROCESSING') {
        throw new HttpException(
          'Seuls les devis en attente ou en cours de traitement peuvent être acceptés',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.quotesService.acceptQuote(id, body);
    } catch (error) {
      this.logger.error(`Erreur lors de l'acceptation du devis ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        "Erreur lors de l'acceptation du devis",
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id/reject')
  async rejectQuote(
    @Param('id') id: string,
    @Body() body: { rejectionReason: string },
  ) {
    try {
      const quote = await this.quotesService.findOne(id);
      if (!quote) {
        throw new HttpException('Devis introuvable', HttpStatus.NOT_FOUND);
      }

      if (quote.status !== 'PENDING' && quote.status !== 'PROCESSING') {
        throw new HttpException(
          'Seuls les devis en attente ou en cours de traitement peuvent être rejetés',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (!body.rejectionReason || body.rejectionReason.trim().length === 0) {
        throw new HttpException(
          'La raison du refus est obligatoire',
          HttpStatus.BAD_REQUEST,
        );
      }

      return await this.quotesService.rejectQuote(id, body.rejectionReason);
    } catch (error) {
      this.logger.error(`Erreur lors du rejet du devis ${id}:`, error);
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erreur lors du rejet du devis',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
