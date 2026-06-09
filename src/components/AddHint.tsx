import AddHintForm from '@/components/AddHintForm';
import AddHintFormSkeleton from '@/components/skeletons/AddHintFormSkeleton';
import type { PlayerAdmin } from '@/lib/types';
import { Suspense } from 'react';

type AddHintProps = {
  playersPromise: Promise<PlayerAdmin[]>;
};

export default async function AddHint({ playersPromise }: AddHintProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Add Hint</h1>
      <Suspense fallback={<AddHintFormSkeleton />}>
        <AddHintForm playersPromise={playersPromise} location="adminPage" />
      </Suspense>
    </div>
  );
}
