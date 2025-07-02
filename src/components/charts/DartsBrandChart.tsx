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
    color: 'var(--chart-darts-brand)',
  },
} satisfies ChartConfig;

type DartsBrandChartProps = {
  data: DatabaseStats['dartsBrand'];
};

export default function DartsBrandChart({ data }: DartsBrandChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[500px] w-full">
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
          tickMargin={10}
          axisLine={false}
          minTickGap={0}
          width={140}
          tickFormatter={(value) => value}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator={true}
              labelFormatter={(value) => value}
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}>
          <LabelList
            dataKey="count"
            position="insideRight"
            offset={3}
            className="fill-white hidden sm:text-sm sm:block"
          />
          <LabelList
            dataKey="count"
            position="right"
            offset={4}
            className="fill-foreground text-[0.7rem] sm:hidden"
          />
          <LabelList
            dataKey="percentage"
            position="right"
            offset={6}
            formatter={(value: DatabaseStatsResult['percentage']) =>
              value + '%'
            }
            className="fill-foreground hidden sm:text-sm sm:block"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
