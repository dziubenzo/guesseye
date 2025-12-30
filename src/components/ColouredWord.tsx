import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ColouredWordProps = {
  children: ReactNode;
  colour: 'grey' | 'green' | 'red';
  className?: string;
};

export default function ColouredWord({
  children,
  colour,
  className,
}: ColouredWordProps) {
  return (
    <span
      className={cn(
        'p-1 text-primary-foreground dark:text-black rounded-sm ',
        colour === 'grey'
          ? 'bg-muted-foreground'
          : colour === 'green'
            ? 'bg-good-guess'
            : 'bg-wrong-guess',
        className
      )}
    >
      {children}
    </span>
  );
}
