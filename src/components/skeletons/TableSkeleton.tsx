import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

type TableSkeletonProps = {
  rows?: number;
};

export default function TableSkeleton({ rows }: TableSkeletonProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <Skeleton className="h-10 dark:bg-gray-500 bg-gray-400" />
      {Array.from({ length: rows ? rows : 10 }).map((_, index) => (
        <div className="flex gap-2" key={index}>
          <Skeleton
            className={cn(
              'h-14 flex-1',
              index % 2 === 1 && 'dark:bg-gray-500 bg-gray-400'
            )}
          />
          <Skeleton
            className={cn(
              'h-14 w-24',
              index % 2 === 1 && 'dark:bg-gray-500 bg-gray-400'
            )}
          />
          <Skeleton
            className={cn(
              'h-14 w-20',
              index % 2 === 1 && 'dark:bg-gray-500 bg-gray-400'
            )}
          />
        </div>
      ))}
    </div>
  );
}
