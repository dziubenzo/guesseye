import Footer from '@/components/Footer';
import Header from '@/components/Header';
import ThemeProvider from '@/components/ThemeProvider';
import '@/globals.css';
import { Analytics } from '@vercel/analytics/next';
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
  applicationName: 'GuessEye',
  title: { default: 'GuessEye', template: '%s | GuessEye' },
  description:
    'Challenge yourself and play a completely free game where you have to guess a darts player hand-picked from the actively maintained database of hundreds of darts players.',
  keywords: [
    'Darts',
    'Game',
    'Guess',
    'Beau Greaves',
    'Phil Taylor',
    'Luke Littler',
    'Michael van Gerwen',
    'Krzysztof Ratajski',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center justify-center min-h-lvh bg-secondary`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-lvh w-full max-w-lvw lg:max-w-5xl gap-4 p-2">
            <Header />
            <main className="flex flex-col grow-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
