import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import layoutStyles from "./layout.module.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Product catalog",
  description: "Multi-category product catalog with dynamic specifications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        <header className={layoutStyles.header}>
          <div className={layoutStyles.headerInner}>
            <Link href="/" className={layoutStyles.brand}>
              Catalog
            </Link>
          </div>
        </header>
        <main className={layoutStyles.main}>{children}</main>
      </body>
    </html>
  );
}
