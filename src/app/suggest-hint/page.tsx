import SuggestHint from '@/components/SuggestHint';
import { Card } from '@/components/ui/card';
import { getSession } from '@/server/utils';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = { title: 'Suggest Hint' };

export default async function SuggestHintPage() {
  const sessionPromise = getSession();

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <Suspense>
          <SuggestHint sessionPromise={sessionPromise} />
        </Suspense>
      </Card>
    </div>
  );
}
