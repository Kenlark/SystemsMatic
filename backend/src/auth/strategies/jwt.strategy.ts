import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // Extraire depuis les cookies en premier
        (request: Request) => {
          const token = request?.cookies?.auth_token;
          if (token) {
            this.logger.debug('Token extrait depuis les cookies');
            return token;
          }
          this.logger.debug('Aucun token trouvé dans les cookies');
          return null;
        },
        // Fallback vers les headers d'autorisation
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    this.logger.debug(
      `Validation du payload JWT pour l'utilisateur: ${payload.email}`,
    );
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      firstName: payload.firstName,
      lastName: payload.lastName,
    };
  }
}
