import Tooltip from '@/components/Tooltip';
import { cn } from '@/lib/utils';
import { formatDistanceToNowStrict } from 'date-fns';
import type { ReactNode } from 'react';

type StatProps = {
  children: ReactNode;
  className?: string;
  title: string;
  value?: number | string;
  time?: Date;
};

export default function Stat({
  children,
  className,
  title,
  value,
  time,
}: StatProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2', className)}>
      <div className="flex gap-1">
        <p className="text-sm">{title}</p>
        <Tooltip>{children}</Tooltip>
      </div>
      {value !== undefined && time !== undefined ? (
        <div className="flex flex-col gap-1">
          <p className="px-8 py-2 rounded-md bg-primary text-secondary font-medium text-xl sm:text-2xl">
            {value}
          </p>
          <p className="text-xs">
            {formatDistanceToNowStrict(time, { addSuffix: true })}
          </p>
        </div>
      ) : value !== undefined && time === undefined ? (
        <>
          <p className="px-8 py-2 rounded-md bg-primary text-secondary font-medium text-xl sm:text-2xl">
            {value}
          </p>
        </>
      ) : (
        <p className="px-8 py-2 font-medium text-xl sm:text-2xl">N/A</p>
      )}
    </div>
  );
}
