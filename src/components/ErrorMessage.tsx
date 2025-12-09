import { TriangleAlert } from 'lucide-react';

type ErrorMessageProps = {
  errorMessage: string;
};

export default function ErrorMessage({ errorMessage }: ErrorMessageProps) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-2 p-3 text-sm text-accent bg-destructive rounded-md m-0 font-bold">
      <div>
        <TriangleAlert size={24} />
      </div>
      <p>{errorMessage}</p>
    </div>
  );
}
