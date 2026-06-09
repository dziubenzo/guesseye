'use client';

import type { ReactNode } from 'react';

type GamePageMiddleProps = {
  children: ReactNode;
};

export default function GamePageMiddle({ children }: GamePageMiddleProps) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-2xl opacity-50 text-center">Fields Found</h2>
      {children}
    </div>
  );
}
