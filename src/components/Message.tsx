'use client';

import { cn } from '@/lib/utils';
import { Flower2, TriangleAlert } from 'lucide-react';
import { useEffect, useState } from 'react';

type MessageProps = {
  type: 'success' | 'error';
  message: string;
  autoDismissible?: boolean;
};

export default function Message({
  type,
  message,
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

  return <ChildMessage type={type} message={message} dismiss={dismiss} />;
}

type ChildMessageProps = Omit<MessageProps, 'timed'> & { dismiss: () => void };

function ChildMessage({ type, message, dismiss }: ChildMessageProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-center md:justify-start gap-2 p-3 text-sm text-accent rounded-md m-0 font-bold cursor-pointer',
        type === 'success' ? 'bg-primary' : 'bg-destructive'
      )}
      onClick={dismiss}
    >
      <div>
        {type === 'success' ? (
          <Flower2 size={24} />
        ) : (
          <TriangleAlert size={24} />
        )}
      </div>
      <p>{message}</p>
    </div>
  );
}
