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
    label: 'Guesses',
    color: 'var(--chart-3)',
  },
} satisfies ChartConfig;

type GuessesByDayChartProps = {
  data: UserStats['guessesByDay'];
};

export default function GuessesByDayChart({ data }: GuessesByDayChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center">
        <p>Make a guess in any game to see the chart.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 25, right: 5, bottom: 5, left: 5 }}
      >
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
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
