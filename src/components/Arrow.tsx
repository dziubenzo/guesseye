import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ReactNode } from 'react';

type ArrowProps = { children: ReactNode; type: 'higher' | 'lower' };

export default function Arrow({ children, type }: ArrowProps) {
  return (
    <Popover>
      <PopoverTrigger>
        {type === 'higher' ? (
          <ArrowUp size={16} strokeWidth={2.5} className="cursor-pointer" />
        ) : (
          <ArrowDown size={16} strokeWidth={2.5} className="cursor-pointer" />
        )}
      </PopoverTrigger>
      <PopoverContent className="text-xs p-2 w-max">
        {children} should be{' '}
        <span className="font-bold">
          {type === 'higher' ? 'higher' : 'lower'}
        </span>
      </PopoverContent>
    </Popover>
  );
}
