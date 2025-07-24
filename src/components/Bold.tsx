import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type BoldProps = {
  children: ReactNode;
  className?: string;
};

export default function Bold({ children, className }: BoldProps) {
  return <span className={cn('font-medium', className)}>{children}</span>;
}
