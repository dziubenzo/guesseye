import { Flower2 } from 'lucide-react';

type SuccessMessageProps = {
  successMessage: string;
};

export default function SuccessMessage({
  successMessage,
}: SuccessMessageProps) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-2 p-3 text-sm text-accent bg-primary rounded-md m-0 font-bold">
      <Flower2 />
      <p>{successMessage}</p>
    </div>
  );
}
