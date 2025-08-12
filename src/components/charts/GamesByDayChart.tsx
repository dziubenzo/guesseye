'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
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
  won: {
    label: 'Won',
    color: 'var(--good-guess)',
  },
  givenUp: {
    label: 'Given Up',
    color: 'var(--wrong-guess)',
  },
} satisfies ChartConfig;

type GamesByDayChartProps = {
  data: UserStats['gamesByDay'];
};

export default function GamesByDayChart({ data }: GamesByDayChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center">
        <p>Complete a game in any mode to see the chart.</p>
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
          minTickGap={0}
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
            />
          }
        />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="givenUp" stackId="a" fill="var(--color-givenUp)">
          <LabelList
            dataKey="count"
            position="top"
            offset={9}
            className="fill-foreground hidden sm:text-base sm:block"
          />
          <LabelList
            dataKey="count"
            position="top"
            offset={3}
            className="fill-foreground text-[0.6rem] sm:hidden"
          />
        </Bar>
        <Bar dataKey="won" stackId="a" fill="var(--color-won)">
          <LabelList
            dataKey="count"
            position="top"
            offset={9}
            className="fill-foreground hidden sm:text-base sm:block"
          />
          <LabelList
            dataKey="count"
            position="top"
            offset={3}
            className="fill-foreground text-[0.6rem] sm:hidden"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
