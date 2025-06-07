'use client';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import type { DatabaseStatsResult } from '@/lib/types';
import { Cell, Pie, PieChart } from 'recharts';

type GeneralPieChartProps = {
  data: DatabaseStatsResult[];
  config: ChartConfig;
  colours: string[];
};

export default function GeneralPieChart({
  data,
  config,
  colours,
}: GeneralPieChartProps) {
  return (
    <ChartContainer config={config} className="min-h-[200px] w-full">
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
            <Cell
              key={`cell-${index}`}
              fill={colours[index % colours.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
