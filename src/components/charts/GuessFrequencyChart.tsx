'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { UserStats } from '@/lib/types';
import {
  Bar,
  BarChart,
  LabelList,
  XAxis,
  YAxis
} from 'recharts';

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
    <ChartContainer config={chartConfig} className="min-h-[800px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 40, bottom: 5, left: 0 }}
        layout="vertical"
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="fullName"
          type="category"
          tickLine={false}
          tickMargin={5}
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
            offset={2}
            className="fill-white hidden sm:text-sm sm:block"
          />
          <LabelList
            dataKey="count"
            position="right"
            offset={3}
            className="fill-foreground text-sm sm:hidden"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
