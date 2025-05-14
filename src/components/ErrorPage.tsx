import ErrorMessage from '@/components/ErrorMessage';
import { Cat } from 'lucide-react';

type ErrorPageProps = {
  errorMessage: string;
};

export default function ErrorPage({ errorMessage }: ErrorPageProps) {
  return (
    <div className="flex flex-col grow-1 justify-center items-center gap-6">
      <div className="flex gap-2 justify-center items-center">
        <p className="text-3xl">Error</p>
      </div>
      <Cat size={128} />
      <ErrorMessage errorMessage={errorMessage} />
    </div>
  );
}
