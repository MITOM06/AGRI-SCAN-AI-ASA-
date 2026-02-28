import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { APP_NAME, APP_DESCRIPTION } from "@agri-scan/shared";
import { Navbar } from "@/components/layout/Navbar";
import { Providers } from "./providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: APP_DESCRIPTION,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar />
            <main>{children}</main>

            <footer className="bg-white border-t border-gray-100 py-12 mt-20">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-gray-500">
                <p>© 2026 Agri-Scan AI. All rights reserved.</p>
                <p className="text-sm mt-2">
                  Website & AI Innovation Contest 2026 - Foundation Track
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
