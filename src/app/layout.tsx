import type { Metadata } from "next";
import Link from "next/link";
import { Playfair_Display, Space_Mono, Work_Sans } from "next/font/google";
import "./globals.css";
import layoutStyles from "./layout.module.css";

const playfairDisplay = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const workSans = Work_Sans({
  variable: "--font-ui",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const spaceMono = Space_Mono({
  variable: "--font-mono-loaded",
  subsets: ["latin"],
  weight: ["400", "700"],
  display: "swap",
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
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${workSans.variable} ${spaceMono.variable}`}
    >
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
