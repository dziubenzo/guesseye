import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { CircleHelp } from 'lucide-react';
import type { ReactNode } from 'react';

export default function GameStatsSkeleton() {
  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8 mt-4 md:mt-8">
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Guesses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center p-2">
          <div className="grid grid-cols-1 md:grid-cols-1 md:col-span-3 gap-8">
            <StatSkeleton>Total Guesses</StatSkeleton>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-3 gap-8">
            <StatSkeleton>Fewest Guesses To Win</StatSkeleton>
            <StatSkeleton>Most Guesses To Win</StatSkeleton>
          </div>
          <StatSkeleton>Avg. Guesses</StatSkeleton>
          <StatSkeleton>Avg. Guesses To Win</StatSkeleton>
          <StatSkeleton>Avg. Guesses To Give Up</StatSkeleton>
        </div>
        <Separator />
        <div className="flex justify-center">
          <h1 className="text-xl md:text-4xl font-medium text-center px-0 py-2">
            Most Frequent Guesses
          </h1>
          <div className="mt-1.5">
            <CircleHelp size={12} className="cursor-not-allowed" />
          </div>
        </div>
        <ChartSkeleton />
      </div>
    </div>
  );
}

type StatSkeletonProps = {
  children: ReactNode;
};

function StatSkeleton({ children }: StatSkeletonProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2')}>
      <div className="flex gap-1 items-center">
        <p className="text-sm">{children}</p>
        <CircleHelp size={12} className="cursor-not-allowed" />
      </div>
      <div className="flex flex-col gap-1">
        <Skeleton className="px-8 py-2 rounded-md bg-primary text-secondary font-medium text-xl sm:text-2xl min-w-32 h-11 sm:h-12" />
      </div>
    </div>
  );
}

function ChartSkeleton() {
  const chartWidths = [
    'w-[60%]',
    'w-[55%]',
    'w-[50%]',
    'w-[45%]',
    'w-[40%]',
    'w-[35%]',
    'w-[30%]',
    'w-[25%]',
    'w-[20%]',
    'w-[15%]',
  ];

  return (
    <div className="flex flex-col gap-2">
      {Array.from({ length: 10 }).map((_, index) => (
        <div className="flex gap-2 w-full" key={index}>
          <Skeleton className="h-6.5 w-[15%]" />
          <Skeleton
            className={cn(
              'flex items-center justify-end h-6.5 pr-1',
              chartWidths[index]
            )}
          >
            <span>{chartWidths.length - index}</span>
          </Skeleton>
        </div>
      ))}
    </div>
  );
}
