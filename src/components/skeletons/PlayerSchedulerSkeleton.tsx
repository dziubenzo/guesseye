import InlineSkeleton from '@/components/skeletons/InlineSkeleton';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

export default function PlayerSchedulerSkeleton() {
  return (
    <>
      <h1 className="text-xl font-medium">Schedule Player</h1>
      <p>Last official mode player is scheduled for:</p>
      <Skeleton className="w-48 h-6" />
      <Separator />
      <p>
        Schedule player for{' '}
        <InlineSkeleton className="p-0.75" fill="29 August 2026" />
      </p>
      <Skeleton className="h-9 w-full sm:w-[350px]" />
      <Skeleton className="h-9 w-full" />
    </>
  );
}
