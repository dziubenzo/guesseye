import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { ReactNode } from 'react';

type ArrowProps = {
  children: ReactNode;
  type: 'higher' | 'lower';
  bestResult?: 'better' | 'worse';
};

export default function Arrow({ children, type, bestResult }: ArrowProps) {
  return (
    <Popover>
      <PopoverTrigger>
        {type === 'higher' ? (
          <ArrowUp
            size={16}
            strokeWidth={2.5}
            className="cursor-pointer ml-0.75"
          />
        ) : (
          <ArrowDown
            size={16}
            strokeWidth={2.5}
            className="cursor-pointer ml-0.75"
          />
        )}
      </PopoverTrigger>
      <PopoverContent className="text-xs p-2 w-max">
        {children} should be{' '}
        <span className="font-bold">{bestResult ? bestResult : type}</span>
      </PopoverContent>
    </Popover>
  );
}
