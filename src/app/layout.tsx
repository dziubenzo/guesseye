import Footer from '@/components/Footer';
import Header from '@/components/Header';
import '@/globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import type { ReactNode } from 'react';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'GuessEye',
  description: 'To be completed',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center justify-center min-h-lvh bg-secondary`}
      >
        <div className="flex flex-col min-h-lvh w-full max-w-lvw lg:max-w-5xl gap-4 p-2">
          <Header />
          <main className="flex flex-col grow-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
