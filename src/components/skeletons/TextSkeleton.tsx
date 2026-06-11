import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { ComponentProps } from 'react';

export default function TextSkeleton({
  className,
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <Skeleton
      className={cn(
        'animate-pulse rounded-md bg-muted-foreground text-muted-foreground select-none',
        className
      )}
      {...props}
    >
      {children}
    </Skeleton>
  );
}
