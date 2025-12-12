'use client';

import { cn } from '@/lib/utils';
import { Flower2, TriangleAlert, UserRoundSearch } from 'lucide-react';
import { useEffect, useState, type ReactNode } from 'react';

type MessageProps = {
  children: ReactNode;
  type: 'success' | 'error' | 'info';
  autoDismissible?: boolean;
};

export default function Message({
  children,
  type,
  autoDismissible = false,
}: MessageProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (autoDismissible) {
      id = setTimeout(() => {
        dismiss();
      }, 5000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [autoDismissible]);

  function dismiss() {
    setShow(false);
  }

  if (!show) return null;

  return (
    <ChildMessage type={type} dismiss={dismiss}>
      {children}
    </ChildMessage>
  );
}

type ChildMessageProps = Omit<MessageProps, 'timed'> & { dismiss: () => void };

function ChildMessage({ children, type, dismiss }: ChildMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center md:justify-start gap-2 p-3 text-sm text-accent rounded-md m-0 font-bold',
        type !== 'info' && 'cursor-pointer',
        type === 'success'
          ? 'bg-primary'
          : type === 'error'
            ? 'bg-destructive'
            : 'bg-muted-foreground flex-col md:flex-row'
      )}
      onClick={type !== 'info' ? dismiss : undefined}
    >
      <div>
        {type === 'success' && <Flower2 size={24} />}
        {type === 'error' && <TriangleAlert size={24} />}
        {type === 'info' && <UserRoundSearch size={24} />}
      </div>
      {children}
    </div>
  );
}
