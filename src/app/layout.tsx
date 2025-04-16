import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import '../globals.css';

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col items-center min-h-screen p-2`}
      >
        <div className="flex flex-col max-w-5xl w-full">
          <header className="grid grid-flow-col text-center">
            <p>1</p>
            <p>2</p>
            <p>3</p>
          </header>
          {children}
        </div>
      </body>
    </html>
  );
}
