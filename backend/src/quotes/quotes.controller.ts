import {
  Controller,
  Post,
  Body,
  ValidationPipe,
  HttpStatus,
  HttpException,
  Logger,
} from '@nestjs/common';
import { QuotesService } from './quotes.service';
import { CreateQuoteDto } from './dto/create-quote.dto';

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
}
