import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "MaiaLink - Logiciel Sage-Femme",
  description: "Application professionnelle pour sages-femmes liberales. Gestion des patientes, suivi de grossesse, facturation NGAP.",
  keywords: ["sage-femme", "logiciel medical", "grossesse", "facturation", "NGAP"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
