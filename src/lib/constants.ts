import type { ComparisonResults } from '@/lib/types';

// Corresponds to the number of properties in the ComparisonResults and the PlayerToFindMatches type
export const ALL_MATCHES = 22;

export const matchingComparisonResults: ComparisonResults = {
  firstName: 'match',
  lastName: 'match',
  gender: 'match',
  dateOfBirth: 'match',
  country: 'match',
  playingSince: 'match',
  dartsBrand: 'match',
  dartsWeight: 'match',
  laterality: 'match',
  organisation: 'match',
  tourCard: 'match',
  rankingPDC: 'match',
  rankingWDF: 'match',
  nineDartersPDC: 'match',
  bestResultPDC: 'match',
  yearOfBestResultPDC: 'match',
  bestResultWDF: 'match',
  yearOfBestResultWDF: 'match',
  bestResultUKOpen: 'match',
  yearOfBestResultUKOpen: 'match',
  playedInWCOD: 'match',
  active: 'match',
} as const;
