import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GoldSprinkles } from "@/components/GoldSprinkles";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Stayra | Luxury Stays, Optimized Prices",
  description: "The intelligent hotel aggregator that finds you the perfect stay at the lowest price across every booking platform.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="fixed inset-0 z-0 pointer-events-none">
          <GoldSprinkles />
        </div>
        {children}
      </body>
    </html>
  );
}
