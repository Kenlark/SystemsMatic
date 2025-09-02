// src/app/layout.tsx
import "./globals.css";
import ToastProvider from "./components/ToastProvider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
      <body>
        <div className="app">
          <Navbar />
          <main className="app__main">{children}</main>
          <Footer />
        </div>
        <ToastProvider />
      </body>
    </html>
  );
}
