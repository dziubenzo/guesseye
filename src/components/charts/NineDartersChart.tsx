'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats } from '@/lib/types';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Player Count',
    color: 'var(--chart-nine-darters)',
  },
} satisfies ChartConfig;

type NineDartersChartProps = {
  data: DatabaseStats['nineDartersPDC'];
};

export default function NineDartersChart({ data }: NineDartersChartProps) {
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
          minTickGap={0}
          tickFormatter={(value) => `${value}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator={true}
              labelFormatter={(value) =>
                value === '1'
                  ? `${value} PDC Nine-Darter`
                  : `${value} PDC Nine-Darters`
              }
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}>
          <LabelList
            dataKey="count"
            position="top"
            offset={9}
            className="fill-foreground hidden sm:text-base sm:block"
          />
          <LabelList
            dataKey="count"
            position="top"
            offset={6}
            className="fill-foreground text-xs sm:hidden"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
