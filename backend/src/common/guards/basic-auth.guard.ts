import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class BasicAuthGuard implements CanActivate {
  constructor(private readonly configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException('Authentification Basic requise');
    }

    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString(
      'utf-8',
    );
    const [username, password] = credentials.split(':');

    const expectedUsername = this.configService.get<string>('BASIC_AUTH_USER');
    const expectedPassword = this.configService.get<string>('BASIC_AUTH_PASS');

    if (!expectedUsername || !expectedPassword) {
      throw new UnauthorizedException(
        "Configuration d'authentification manquante",
      );
    }

    if (username === expectedUsername && password === expectedPassword) {
      return true;
    }

    throw new UnauthorizedException('Identifiants invalides');
  }
}
