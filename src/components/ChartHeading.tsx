import Tooltip from '@/components/Tooltip';
import type { ReactNode } from 'react';

type ChartHeadingProps = {
  children: ReactNode;
  title: string;
};

export default function ChartHeading({ children, title }: ChartHeadingProps) {
  return (
    <div className="flex justify-center">
      <h1 className="text-xl md:text-4xl font-medium text-center px-0 py-2">
        {title}
      </h1>
      <div>
        <Tooltip>{children}</Tooltip>
      </div>
    </div>
  );
}
