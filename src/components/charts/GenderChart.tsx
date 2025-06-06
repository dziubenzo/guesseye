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
    label: 'Gender',
  },
  male: {
    label: 'Male',
  },
  female: {
    label: 'Female',
  },
} satisfies ChartConfig;

const COLORS = ['var(--chart-male)', 'var(--chart-female)'];

type GenderChartType = {
  data: DatabaseStats['gender'];
};

export default function GenderChart({ data }: GenderChartType) {
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
