import { player } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type Player = InferSelectModel<typeof player>;

export type BestResultColumnType =
  | NonNullable<Player['bestResultPDC']>
  | NonNullable<Player['bestResultWDF']>;

type Match = 'match' | 'noMatch';
type MatchHigherLower = Match | 'higher' | 'lower';

export type ComparisonResult = {
  firstName: Match;
  lastName: Match;
  gender: Match;
  dateOfBirth: MatchHigherLower;
  country: Match;
  playingSince: MatchHigherLower;
  dartsBrand: Match;
  dartsWeight: MatchHigherLower;
  laterality: Match;
  organisation: Match;
  tourCard: Match;
  rankingPDC: MatchHigherLower;
  rankingWDF: MatchHigherLower;
  prizeMoney: MatchHigherLower;
  nineDartersPDC: MatchHigherLower;
  bestResultPDC: MatchHigherLower;
  yearOfBestResultPDC: MatchHigherLower;
  bestResultWDF: MatchHigherLower;
  yearOfBestResultWDF: MatchHigherLower;
  playedInWCOD: Match;
  playedInWDF: Match;
  active: Match;
};
