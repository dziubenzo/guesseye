import Tooltip from '@/components/Tooltip';
import type { Schedule } from '@/lib/types';
import { format } from 'date-fns';

type TimeLeftTooltipProps = {
  nextPlayerStartDate: Schedule['startDate'];
};

export default function TimeLeftTooltip({
  nextPlayerStartDate,
}: TimeLeftTooltipProps) {
  return (
    <div className={`absolute -top-2 -right-4`}>
      <Tooltip className="w-fit">
        {format(nextPlayerStartDate, 'dd MMMM y')}, at{' '}
        <span className="font-bold">
          {format(nextPlayerStartDate, 'hh:mm a')}
        </span>
      </Tooltip>
    </div>
  );
}
