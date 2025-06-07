'use client';

import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import type { DatabaseStats, UserStats } from '@/lib/types';
import { format } from 'date-fns';
import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from 'recharts';
import { Pie, PieChart } from 'recharts';

const chartConfig = {
  count: {
    label: 'Country',
    color: 'var(--chart-2)',
  },
  value: {
    label: 'Country',
  },
  percentage: {
    label: 'Percentage',
  },
} satisfies ChartConfig;

type CountryChartType = {
  data: DatabaseStats['country'];
};

export default function CountryChart({ data }: CountryChartType) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <PieChart>
        <ChartTooltip content={<ChartTooltipContent />} />
        <Pie data={data} dataKey="count" nameKey="value">
          <LabelList
            dataKey="value"
            position="outside"
            className="bg-black fill-black stroke-card-foreground font-extralight"
          />
          <LabelList dataKey="count" position="top" />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
