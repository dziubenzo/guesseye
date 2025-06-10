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
    color: 'var(--chart-darts-weight)',
  },
} satisfies ChartConfig;

type DartsWeightChartProps = {
  data: DatabaseStats['dartsWeight'];
};

export default function DartsWeightChart({ data }: DartsWeightChartProps) {
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
          minTickGap={8}
          tickFormatter={(value) => `${value}g`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator={true}
              labelFormatter={(value) => `${value}g darts`}
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
            offset={6}
            className="fill-foreground text-sm sm:hidden"
          />
          <LabelList
            dataKey="percentage"
            position="center"
            offset={0}
            formatter={(value: DatabaseStatsResult['percentage']) =>
              value + '%'
            }
            className="fill-white hidden sm:text-[0.6rem] md:text-xs lg:text-sm sm:block"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
