import { Button } from '@/components/ui/button';
import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: '404 | GuessEye' };

export default function NotFound() {
  return (
    <div className="flex flex-col grow-1 items-center justify-center gap-2">
      <h1 className="text-6xl">404</h1>
      <h2 className="text-xl">Page Not Found</h2>
      <Image
        className="rounded-md shadow-md"
        src="/not-found.gif"
        alt="A woman throwing a dart at the dartboard, but misses the dartboard entirely"
        priority={true}
        width={500}
        height={500}
        unoptimized
      />
      <Button variant={'link'} asChild>
        <Link href="/">Back to Home page</Link>
      </Button>
    </div>
  );
}
