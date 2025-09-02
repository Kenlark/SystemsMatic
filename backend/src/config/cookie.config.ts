import { CookieOptions } from 'express';

export const getCookieOptions = (isProduction: boolean): CookieOptions => {
  // Forcer le mode production si on est sur Render ou si FORCE_PRODUCTION est défini
  const forceProduction =
    isProduction ||
    process.env.FORCE_PRODUCTION === 'true' ||
    process.env.CORS_ORIGIN?.includes('netlify');

  console.log('Mode production forcé:', forceProduction);

  return {
    httpOnly: true,
    secure: forceProduction,
    sameSite: forceProduction ? 'none' : 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 jours
    path: '/',
    domain: forceProduction ? '.systemsmatic.com' : undefined,
  };
};

export const getClearCookieOptions = (isProduction: boolean): CookieOptions => {
  const forceProduction =
    isProduction ||
    process.env.FORCE_PRODUCTION === 'true' ||
    process.env.CORS_ORIGIN?.includes('netlify');

  return {
    path: '/',
    secure: forceProduction,
    sameSite: forceProduction ? 'none' : 'strict',
    domain: forceProduction ? '.systemsmatic.com' : undefined,
  };
};
