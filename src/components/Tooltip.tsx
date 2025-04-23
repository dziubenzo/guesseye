import { ReactNode } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CircleHelp } from 'lucide-react';

type TooltipProps = { children: ReactNode };

export default function Tooltip({ children }: TooltipProps) {
  return (
    <Popover>
      <PopoverTrigger>
        <CircleHelp size={12} className="cursor-pointer" />
      </PopoverTrigger>
      <PopoverContent className="text-xs p-3">
        {children}
      </PopoverContent>
    </Popover>
  );
}
