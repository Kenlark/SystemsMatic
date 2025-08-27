import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === "true";
  if (!maintenance) return NextResponse.next();

  const url = req.nextUrl.clone();

  // Autorise UNIQUEMENT la page /maintenance
  if (url.pathname === "/maintenance") {
    return NextResponse.next();
  }

  // Tout le reste est réécrit vers /maintenance
  url.pathname = "/maintenance";
  return NextResponse.rewrite(url);
}

export const config = {
  matcher: ["/:path*"], // capture tout, même les assets
};
