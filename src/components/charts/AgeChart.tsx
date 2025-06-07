'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats, DatabaseStatsResult } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Player Count',
    color: 'var(--chart-age)',
  },
} satisfies ChartConfig;

type AgeProps = {
  data: DatabaseStats['age'];
};

export default function AgeChart({ data }: AgeProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 25, right: 5, bottom: 5, left: 5 }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="value"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={16}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator={true}
              labelFormatter={(value: DatabaseStatsResult['value']) =>
                `${value} years old`
              }
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}>
          <LabelList
            dataKey="count"
            position="top"
            offset={12}
            className="fill-foreground hidden sm:text-base sm:block"
          />
          <LabelList
            dataKey="count"
            position="top"
            offset={3}
            className="fill-foreground text-[0.5rem] sm:hidden"
          />
          <LabelList
            dataKey="percentage"
            position="center"
            angle={-90}
            offset={12}
            formatter={(value: DatabaseStatsResult['percentage']) =>
              value + '%'
            }
            className="fill-white hidden sm:text-xs sm:block"
          />
          <LabelList
            dataKey="percentage"
            position="center"
            angle={-90}
            offset={3}
            formatter={(value: DatabaseStatsResult['percentage']) =>
              value + '%'
            }
            className="fill-white text-[0.4rem] sm:hidden"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
