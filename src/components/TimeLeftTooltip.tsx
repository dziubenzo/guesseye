import Tooltip from '@/components/Tooltip';
import type { Schedule } from '@/lib/types';
import { format } from 'date-fns';

type TimeLeftTooltipProps = {
  nextPlayerStartDate: Schedule['startDate'];
  top?: number;
  right?: number;
};

export default function TimeLeftTooltip({
  nextPlayerStartDate,
  top = 2,
  right = 4,
}: TimeLeftTooltipProps) {
  const topClass = `-top-${top}`;
  const rightClass = `-right-${right}`;

  return (
    <div className={`absolute ${topClass} ${rightClass}`}>
      <Tooltip className="w-fit">
        {format(nextPlayerStartDate, 'dd MMMM y')}, at{' '}
        <span className="font-bold">
          {format(nextPlayerStartDate, 'hh:mm a')}
        </span>
      </Tooltip>
    </div>
  );
}
