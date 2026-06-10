import { cn } from '@/lib/utils';

type InlineSkeletonProps = {
  className?: string;
  fill: string | number;
};

export default function InlineSkeleton({
  className,
  fill,
}: InlineSkeletonProps) {
  return (
    <span
      data-slot="skeleton"
      className={cn(
        'p-1 animate-pulse rounded-md bg-muted-foreground text-muted-foreground select-none',
        className
      )}
      aria-hidden="true"
    >
      {fill}
    </span>
  );
}
