import type { ChartConfig } from '@/components/ui/chart';

// Chart configs

export const GENDER_CHART_CONFIG = {
  count: {
    label: 'Gender',
  },
  male: {
    label: 'Male',
  },
  female: {
    label: 'Female',
  },
} satisfies ChartConfig;

export const LATERALITY_CHART_CONFIG = {
  count: {
    label: 'Laterality',
  },
  'right-handed': {
    label: 'Right-Handed',
  },
  'left-handed': {
    label: 'Left-Handed',
  },
} satisfies ChartConfig;

export const DIFFICULTY_CHART_CONFIG = {
  count: {
    label: 'Difficulty',
  },
  easy: {
    label: 'Easy',
  },
  medium: {
    label: 'Medium',
  },
  hard: {
    label: 'Hard',
  },
  'very hard': {
    label: 'Very Hard',
  },
} satisfies ChartConfig;

// Chart colours

export const GENDER_COLOURS = ['var(--chart-male)', 'var(--chart-female)'];

export const LATERALITY_COLOURS = ['var(--chart-2)', 'var(--chart-3)'];

export const DIFFICULTY_COLOURS = [
  'var(--chart-easy)',
  'var(--chart-medium)',
  'var(--chart-hard)',
  'var(--chart-very-hard)',
];
