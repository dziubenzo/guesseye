import { Skeleton } from '@/components/ui/skeleton';

type TableSkeletonProps = {
  rows?: number;
};

export default function TableSkeleton({ rows }: TableSkeletonProps) {
  return (
    <div className="flex flex-col w-full gap-2">
      <Skeleton className="h-10" />
      {Array.from({ length: rows ? rows : 10 }).map((_, index) => (
        <div className="flex gap-2" key={index}>
          <Skeleton className="h-14 flex-1" />
          <Skeleton className="h-14 w-24" />
          <Skeleton className="h-14 w-20" />
        </div>
      ))}
    </div>
  );
}
