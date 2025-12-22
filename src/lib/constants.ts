import type { ComparisonResults } from '@/lib/types';

// Corresponds to the number of properties in the ComparisonResults and the PlayerToFindMatches types
export const ALL_MATCHES = 22;

// Number of named fields in a card
export const NAMED_FIELDS = ALL_MATCHES - 5;

// Lowest ranking of a darts player to be added to reported missing players if they are not in the DB
export const MISSING_PLAYERS_MAX_RANKING = 32;

// Maximum number of matches to show if no exact/very close match is found
export const MAX_MATCH_SUGGESTIONS = 6;

export const DARTS_FACTS: string[] = [
  'Winmau was founded in 1946 by Harry Kicks, who named the company after his wife, Winifred Maud, pronounced “Winmore”.',
  'A dart must not exceed 40 grams for PDC matches.',
  'Did you know that dartboards have also been made from elm, poplar and coiled paper?',
  'The total length of a dart must not exceed 200 millimetres for PDC matches.',
  'The worst result Phil Taylor ever had at a Circus Tavern World Championship was losing in the final.',
  'John Lowe became the World Champion in three different decades.',
  'Nodor inventors of the modern dartboard manufactured a new type of dartboard which had "no odour" using sisal as they do today. Standard boards at the time were made of clay and had a strong smell. This was eventually shortened to become NODOR.',
  'Did you know that there are exactly 3,944 ways of getting a nine dart finish?',
  'The music that is played at the break during every PDC tournament is Chase the Sun by Planet Funk.',
  'The first PDC Premier League competitors were: Mark Dudridge, Colin Lloyd, Peter Manley, Wayne Mardle, John Part, Roland Scholten, and Phil Taylor.',
  'The lowest number that cannot be scored with one dart is 23.',
  'In 2012, a darter was kicked out of an English tournament because, due to his appearance, viewers kept chanting Jesus, which prevented other players from focusing on the game. A year later, he was banned from entering the competition for the same reason.',
];

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
