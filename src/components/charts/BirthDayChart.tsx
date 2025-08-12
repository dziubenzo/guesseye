'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats, DatabaseStatsResult } from '@/lib/types';
import { enGB } from 'date-fns/locale';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';

const chartConfig = {
  count: {
    label: 'Player Count',
    color: 'var(--chart-birth-day)',
  },
} satisfies ChartConfig;

type BirthDayChartProps = {
  data: DatabaseStats['birthDay'];
};

export default function BirthDayChart({ data }: BirthDayChartProps) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <BarChart
        accessibilityLayer
        data={data}
        margin={{ top: 5, right: 25, bottom: 5, left: 5 }}
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
          tickFormatter={(value) =>
            `${enGB.localize.day(value, { width: 'abbreviated' })}`
          }
        />
        <ChartTooltip
          content={
            <ChartTooltipContent
              hideIndicator={true}
              labelFormatter={(value) =>
                `Born on ${enGB.localize.day(value, { width: 'wide' })}`
              }
            />
          }
        />
        <Bar dataKey="count" fill="var(--color-count)" radius={4}>
          <LabelList
            dataKey="count"
            position="right"
            offset={6}
            className="fill-foreground hidden sm:text-base sm:block"
          />
          <LabelList
            dataKey="count"
            position="right"
            offset={3}
            className="fill-foreground text-sm sm:hidden"
          />
          <LabelList
            dataKey="percentage"
            position="insideLeft"
            offset={8}
            formatter={(value: DatabaseStatsResult['percentage']) =>
              value + '%'
            }
            className="fill-white hidden sm:text-base sm:block"
          />
          <LabelList
            dataKey="percentage"
            position="insideLeft"
            offset={4}
            formatter={(value: DatabaseStatsResult['percentage']) =>
              value + '%'
            }
            className="fill-white text-xs sm:hidden"
          />
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}
