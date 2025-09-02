import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Get,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import {
  getCookieOptions,
  getClearCookieOptions,
} from '../config/cookie.config';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    const result = await this.authService.login(loginDto);
    const isProduction = process.env.NODE_ENV === 'production';

    // Définir le cookie HTTP-only pour le token
    res.cookie(
      'auth_token',
      result.access_token,
      getCookieOptions(isProduction),
    );

    // Définir le cookie HTTP-only pour les données utilisateur
    res.cookie(
      'auth_user',
      JSON.stringify(result.user),
      getCookieOptions(isProduction),
    );

    // Retourner la réponse sans le token (il est maintenant dans le cookie)
    return res.status(HttpStatus.OK).json({
      message: 'Connexion réussie',
      user: result.user,
    });
  }

  @Post('register')
  async register(@Body() registerDto: RegisterDto, @Res() res: Response) {
    const result = await this.authService.register(registerDto);
    const isProduction = process.env.NODE_ENV === 'production';

    // Définir le cookie HTTP-only pour le token
    res.cookie(
      'auth_token',
      result.access_token,
      getCookieOptions(isProduction),
    );

    // Définir le cookie HTTP-only pour les données utilisateur
    res.cookie(
      'auth_user',
      JSON.stringify(result.user),
      getCookieOptions(isProduction),
    );

    // Retourner la réponse sans le token (il est maintenant dans le cookie)
    return res.status(HttpStatus.CREATED).json({
      message: 'Inscription réussie',
      user: result.user,
    });
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    const isProduction = process.env.NODE_ENV === 'production';

    // Supprimer les cookies d'authentification
    res.clearCookie('auth_token', getClearCookieOptions(isProduction));
    res.clearCookie('auth_user', getClearCookieOptions(isProduction));

    return res.status(HttpStatus.OK).json({
      message: 'Déconnexion réussie',
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.sub);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login/local')
  async loginLocal(@Request() req, @Res() res: Response) {
    const result = await this.authService.login(req.user);
    const isProduction = process.env.NODE_ENV === 'production';

    // Définir le cookie HTTP-only pour le token
    res.cookie(
      'auth_token',
      result.access_token,
      getCookieOptions(isProduction),
    );

    // Définir le cookie HTTP-only pour les données utilisateur
    res.cookie(
      'auth_user',
      JSON.stringify(result.user),
      getCookieOptions(isProduction),
    );

    return res.status(HttpStatus.OK).json({
      message: 'Connexion locale réussie',
      user: result.user,
    });
  }

  @Get('debug-cookies')
  async debugCookies(@Request() req, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      cookies: req.cookies,
      headers: req.headers,
      userAgent: req.get('User-Agent'),
      origin: req.get('Origin'),
      referer: req.get('Referer'),
    });
  }
}
