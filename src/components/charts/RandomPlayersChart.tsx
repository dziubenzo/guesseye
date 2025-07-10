'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { UserStats } from '@/lib/types';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Count',
    color: 'var(--chart-random-players)',
  },
} satisfies ChartConfig;

type RandomPlayersChartProps = {
  data: UserStats['randomPlayers'];
};

export default function RandomPlayersChart({ data }: RandomPlayersChartProps) {
  if (data.length === 0) {
    return (
      <div className="text-center">
        <p>Complete a game in random mode to see the chart.</p>
      </div>
    );
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 25, bottom: 5, left: 0 }}
        layout="vertical"
      >
        <XAxis type="number" hide />
        <YAxis
          dataKey="fullName"
          type="category"
          tickLine={false}
          tickMargin={10}
          axisLine={false}
          minTickGap={0}
          width={150}
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
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
