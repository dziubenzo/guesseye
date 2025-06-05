import Tooltip from '@/components/Tooltip';
import type { ReactNode } from 'react';

type StatProps = {
  children: ReactNode;
  className?: string;
  title: string;
  value?: number | string;
};

export default function Stat({ children, className, title, value }: StatProps) {
  return (
    <div
      className={`flex flex-col items-center gap-2 ${className ? className : ''}`}
    >
      <div className="flex gap-1">
        <p className="text-sm">{title}</p>
        <Tooltip>{children}</Tooltip>
      </div>
      {value !== undefined ? (
        <p className="px-8 py-2 rounded-md bg-primary text-secondary font-medium text-xl md:text-2xl">
          {value}
        </p>
      ) : (
        <p className="px-8 py-2 font-medium text-xl md:text-2xl">N/A</p>
      )}
    </div>
  );
}
