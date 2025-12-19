import type { ReactNode } from 'react';

type TopBarProps = {
  children: ReactNode;
};

export default function TopBar({ children }: TopBarProps) {
  return (
    <div className="sticky top-0 bg-secondary py-2 sm:py-4 z-1">
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 sm:justify-center">
        {children}
      </div>
    </div>
  );
}
