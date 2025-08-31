import {
  Controller,
  Get,
  Put,
  Param,
  Req,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiSecurity,
} from '@nestjs/swagger';
import { BasicAuthGuard } from '../common/guards/basic-auth.guard';

@ApiTags('Backoffice')
@Controller('backoffice')
@UseGuards(BasicAuthGuard)
@ApiSecurity('basic')
export class BackofficeController {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  @Get('appointments/pending')
  @ApiOperation({
    summary: 'Récupérer les rendez-vous en attente (backoffice)',
  })
  @ApiResponse({ status: 200, description: 'Rendez-vous en attente' })
  async getPendingAppointments(@Req() req: Request, @Res() res: Response) {
    try {
      const adminApiKey = this.configService.get<string>('ADMIN_API_KEY');

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.get(
          `${req.protocol}://${req.get('host')}/admin/appointments/pending`,
          {
            headers: {
              'x-admin-key': adminApiKey,
            },
          },
        ),
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erreur interne du serveur',
      });
    }
  }

  @Put('appointments/:id/confirm')
  @ApiOperation({ summary: 'Confirmer un rendez-vous (backoffice)' })
  @ApiResponse({ status: 200, description: 'Rendez-vous confirmé' })
  @ApiResponse({ status: 404, description: 'Rendez-vous non trouvé' })
  async confirmAppointment(
    @Param('id') id: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    try {
      const adminApiKey = this.configService.get<string>('ADMIN_API_KEY');

      const response: AxiosResponse = await firstValueFrom(
        this.httpService.put(
          `${req.protocol}://${req.get('host')}/admin/appointments/${id}/status`,
          req.body,
          {
            headers: {
              'x-admin-key': adminApiKey,
              'Content-Type': 'application/json',
            },
          },
        ),
      );

      return res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        return res.status(error.response.status).json(error.response.data);
      }
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        message: 'Erreur interne du serveur',
      });
    }
  }
}
