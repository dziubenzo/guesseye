import type { ComparisonResults } from '@/lib/types';

// Corresponds to the number of properties in the ComparisonResults and the PlayerToFindMatches types
export const ALL_MATCHES = 22;

// Number of named fields in a card
export const NAMED_FIELDS = ALL_MATCHES - 5;

// Lowest ranking of a darts player to be added to reported missing players if they are not in the DB
export const MISSING_PLAYERS_MAX_RANKING = 32;

// Maximum number of matches to show if no exact/very close match is found
export const MAX_MATCH_SUGGESTIONS = 6;

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
  tourCard: 'match',
  rankingElo: 'match',
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
  status: 'match',
} as const;
