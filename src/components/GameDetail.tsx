import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type GameDetailsProps = {
  children: ReactNode;
  title: string;
  className?: string;
};

export default function GameDetail({
  children,
  title,
  className,
}: GameDetailsProps) {
  return (
    <div className="flex flex-col gap-2">
      <p>{title}:</p>
      <p
        className={cn(
          'dark:text-primary font-medium text-xl sm:text-2xl',
          className
        )}
      >
        {children}
      </p>
    </div>
  );
}
