import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CircleHelp } from 'lucide-react';
import { ReactNode } from 'react';

type TooltipProps = {
  children: ReactNode;
  className?: string;
};

export default function Tooltip({ children, className }: TooltipProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <CircleHelp size={12} className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className={`text-xs p-3 ${className ? className : ''}`}>
        {children}
      </PopoverContent>
    </Popover>
  );
}
