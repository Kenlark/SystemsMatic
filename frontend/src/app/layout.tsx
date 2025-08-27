// src/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "System's Matic",
  description: "Application moderne avec Next.js et NestJS",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
