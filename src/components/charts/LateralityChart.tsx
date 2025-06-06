'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats, DatabaseStatsResult } from '@/lib/types';
import { Cell, Pie, PieChart } from 'recharts';

const chartConfig = {
  count: {
    label: 'Laterality',
  },
  'right-handed': {
    label: 'Right-Handed',
  },
  'left-handed': {
    label: 'Left-Handed',
  },
} satisfies ChartConfig;

const COLORS = ['var(--chart-2)', 'var(--chart-4)'];

type LateralityChartType = {
  data: DatabaseStats['gender'];
};

export default function LateralityChart({ data }: LateralityChartType) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent className="w-[150px]" />} />
        <Pie
          data={data}
          dataKey="count"
          nameKey="value"
          label={(value: DatabaseStatsResult) => value.percentage + '%'}
          fontSize={14}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
