'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats, DatabaseStatsResult } from '@/lib/types';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Player Count',
    color: 'var(--chart-age)',
  },
} satisfies ChartConfig;

type AgeChartProps = {
  data: DatabaseStats['age'];
};

export default function AgeChart({ data }: AgeChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[1300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 55, bottom: 5, left: 0 }}
        layout="vertical"
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="value"
          type="category"
          tickLine={false}
          tickMargin={5}
          axisLine={false}
          minTickGap={0}
          tickFormatter={(value) => value}
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
            position="right"
            offset={4}
            className="fill-foreground text-sm sm:hidden"
          />
          <LabelList
            dataKey="count"
            position="right"
            offset={6}
            className="fill-foreground hidden sm:text-sm sm:block"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
