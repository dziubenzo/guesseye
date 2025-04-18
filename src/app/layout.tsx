import Header from '@/components/Header';
import '@/globals.css';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

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
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center min-h-screen`}
      >
        <div className="flex flex-col max-w-5xl w-full">
          <Header />
          {children}
        </div>
      </body>
    </html>
  );
}
