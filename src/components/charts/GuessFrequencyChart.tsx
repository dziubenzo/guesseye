'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { UserStats } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Guesses',
    color: 'var(--chart-2)',
  },
} satisfies ChartConfig;

type GuessFrequencyChartProps = {
  data: UserStats['guessFrequency'];
};

export default function GuessFrequencyChart({
  data,
}: GuessFrequencyChartProps) {
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
          dataKey="fullName"
          hide
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={32}
          tickFormatter={(value) => {
            const array = value.split(' ');
            const lastName = array[array.length - 1];
            return lastName;
          }}
        />
        <ChartTooltip content={<ChartTooltipContent hideIndicator={true} />} />
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
