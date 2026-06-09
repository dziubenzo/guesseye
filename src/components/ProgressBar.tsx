'use client';

import { Progress } from '@/components/ui/progress';
import { ALL_MATCHES } from '@/lib/constants';
import { useUpdateProgressBar } from '@/lib/hooks';

export default function ProgressBar() {
  const fieldsFound = useUpdateProgressBar();

  return (
    <div className="flex justify-center items-center gap-2">
      <span>{fieldsFound}</span>
      <Progress
        className="w-[75vw] md:w-xl h-4 [&>*]:bg-good-guess bg-wrong-guess"
        value={(fieldsFound / ALL_MATCHES) * 100}
        getValueLabel={() =>
          `${fieldsFound} out of ${ALL_MATCHES} fields found`
        }
      />
      <span>{ALL_MATCHES}</span>
    </div>
  );
}
