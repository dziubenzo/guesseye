import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type ItalicProps = {
  children: ReactNode;
  className?: string;
};

export default function Italic({ children, className }: ItalicProps) {
  return <span className={cn('italic', className)}>{children}</span>;
}
