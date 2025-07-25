import { cn } from '@/lib/utils';
import { Faster_One } from 'next/font/google';
import Link from 'next/link';

type LogoProps = {
  location?: 'header' | 'headerGuest' | 'footer';
  className?: string;
};

const fasterOne = Faster_One({ subsets: ['latin'], weight: '400' });

export default function Logo({ location, className }: LogoProps) {
  if (location === 'header') {
    return (
      <span
        className={cn(
          fasterOne.className,
          'absolute hidden -rotate-2 left-0 pl-2 sm:text-xl sm:top-2 md:text-3xl md:top-1 lg:text-4xl lg:top-0 bg-gradient-to-r from-good-guess from-65% to-wrong-guess to-69% sm:inline-block text-transparent bg-clip-text'
        )}
      >
        <Link href="/">GuessEye</Link>
        <span className="sr-only">Go to Home page</span>
      </span>
    );
  } else if (location === 'headerGuest') {
    return (
      <span
        className={cn(
          fasterOne.className,
          'hidden sm:text-3xl sm:top-2 lg:from-58% lg:to-60% sm:from-61% sm:to-63% md:text-4xl md:from-59% md:to-61% md:top-0 bg-gradient-to-r from-good-guess to-wrong-guess sm:inline-block text-transparent bg-clip-text'
        )}
      >
        <Link href="/">GuessEye</Link>
        <span className="sr-only">Go to Home page</span>
      </span>
    );
  } else if (location === 'footer') {
    return (
      <span
        className={`${fasterOne.className} sm:hidden col-span-2 mb-2 text-5xl bg-gradient-to-r from-good-guess from-64% to-wrong-guess to-68% inline-block text-transparent bg-clip-text`}
      >
        <Link href="/">GuessEye</Link>
        <span className="sr-only">Go to Home page</span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        fasterOne.className,
        'bg-gradient-to-r from-good-guess from-64% to-wrong-guess to-68% inline-block text-transparent bg-clip-text',
        className
      )}
    >
      GuessEye
    </span>
  );
}
