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
      <p>{errorMessage}</p>
      <Image
        className="rounded-md shadow-md"
        src="/error.gif"
        alt="A woman using a computer and experiencing a computer error"
        priority={true}
        width={400}
        height={400}
        unoptimized
      />
      <Button variant={'link'} asChild>
        <Link href="/">Back to Home page</Link>
      </Button>
    </div>
  );
}
