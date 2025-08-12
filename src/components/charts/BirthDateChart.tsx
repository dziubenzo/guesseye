'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats } from '@/lib/types';
import { enGB } from 'date-fns/locale';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Player Count',
    color: 'var(--chart-birth-date)',
  },
} satisfies ChartConfig;

type BirthDateChartProps = {
  data: DatabaseStats['birthDate'];
};

export default function BirthDateChart({ data }: BirthDateChartProps) {
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
          tickFormatter={(value) => `${enGB.localize.ordinalNumber(value)}`}
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator={true}
              labelFormatter={(value) =>
                `Born on the ${enGB.localize.ordinalNumber(value)}`
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
            offset={3}
            className="fill-foreground text-[0.5rem] sm:hidden"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
