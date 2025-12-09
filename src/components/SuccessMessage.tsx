import { Flower2 } from 'lucide-react';

type SuccessMessageProps = {
  successMessage: string;
};

export default function SuccessMessage({
  successMessage,
}: SuccessMessageProps) {
  return (
    <div className="flex items-center justify-center md:justify-start gap-2 p-3 text-sm text-accent bg-primary rounded-md m-0 font-bold">
      <div>
        <Flower2 size={24} />
      </div>
      <p>{successMessage}</p>
    </div>
  );
}
