import { Button } from '@/components/ui/button';
import Image from 'next/image';
import Link from 'next/link';

type ErrorPageProps = {
  errorMessage: string;
};

export default function ErrorPage({ errorMessage }: ErrorPageProps) {
  return (
    <div className="flex flex-col grow-1 justify-center items-center gap-6">
      <div className="flex gap-2 justify-center items-center">
        <p className="text-5xl">Error</p>
      </div>
      <p className="text-center">{errorMessage}</p>
      <div className="relative w-full sm:w-[75%] md:w-[50%] h-auto aspect-3/2">
        <Image
          className="rounded-md shadow-md"
          src="/error.gif"
          alt="A woman using a computer and experiencing a computer error"
          priority
          fill
          unoptimized
        />
      </div>
      <Button variant={'link'} asChild>
        <Link href="/">Back to Home page</Link>
      </Button>
    </div>
  );
}
