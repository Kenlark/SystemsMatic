// Utilitaire pour la gestion des cookies côté client

interface CookieOptions {
  path?: string;
  maxAge?: number; // en secondes
  secure?: boolean;
  sameSite?: "strict" | "lax" | "none";
}

/**
 * Définit un cookie avec les options appropriées selon l'environnement
 */
export const setCookie = (
  name: string,
  value: string,
  options: CookieOptions = {}
) => {
  if (typeof window === "undefined") return;

  const isProduction = process.env.NODE_ENV === "production";

  const defaultOptions: CookieOptions = {
    path: "/",
    maxAge: 24 * 60 * 60, // 24 heures
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...options,
  };

  const cookieString = [
    `${name}=${value}`,
    `path=${defaultOptions.path}`,
    `max-age=${defaultOptions.maxAge}`,
    defaultOptions.secure ? "secure" : "",
    `samesite=${defaultOptions.sameSite}`,
  ]
    .filter(Boolean)
    .join("; ");

  document.cookie = cookieString;
};

/**
 * Récupère la valeur d'un cookie
 */
export const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const cookies = document.cookie.split(";");
  const targetCookie = cookies.find((cookie) =>
    cookie.trim().startsWith(`${name}=`)
  );

  if (targetCookie) {
    const value = targetCookie.split("=")[1];
    return value && value !== "" ? value : null;
  }

  return null;
};

/**
 * Supprime un cookie
 */
export const removeCookie = (
  name: string,
  options: Omit<CookieOptions, "maxAge"> = {}
) => {
  if (typeof window === "undefined") return;

  const isProduction = process.env.NODE_ENV === "production";

  const defaultOptions = {
    path: "/",
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    ...options,
  };

  const cookieString = [
    `${name}=`,
    `path=${defaultOptions.path}`,
    "expires=Thu, 01 Jan 1970 00:00:00 UTC",
    defaultOptions.secure ? "secure" : "",
    `samesite=${defaultOptions.sameSite}`,
  ]
    .filter(Boolean)
    .join("; ");

  document.cookie = cookieString;
};
