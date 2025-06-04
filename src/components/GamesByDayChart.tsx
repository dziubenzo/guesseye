'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { UserStats } from '@/lib/types';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Games',
    color: 'var(--chart-1)',
  },
} satisfies ChartConfig;

type GamesByDayChartProps = {
  data: UserStats['gamesByDay'];
};

export default function GamesByDayChart({ data }: GamesByDayChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center">
        <p>No data to display.</p>
        <p>Complete a game in any mode to see the chart.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart accessibilityLayer data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={32}
          tickFormatter={(value) => {
            const date = new Date(value);
            return date.toLocaleDateString('en-GB', {
              month: 'short',
              day: 'numeric',
            });
          }}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              labelFormatter={(value) => format(value, 'dd MMMM y')}
              hideIndicator={true}
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}>
          <LabelList
            position="top"
            offset={12}
            className="fill-foreground text-xs md:text-lg"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
