import { player } from '@/server/db/schema';
import { InferSelectModel } from 'drizzle-orm';

export type Player = InferSelectModel<typeof player>;

export type BestResultColumnType =
  | NonNullable<Player['bestResultPDC']>
  | NonNullable<Player['bestResultWDF']>;

export type Match = 'match' | 'noMatch';
export type MatchHigherLower = Match | 'higher' | 'lower';

export type ComparisonResults = {
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

export type PlayerToFindMatches = Partial<Player>;

export type Guess = {
  guessedPlayer: Player;
  comparisonResults: ComparisonResults;
};

// TODO: This is atrocious, do something about it
type CheckGuessActionError = { error: string; success: null };
type CheckGuessActionSuccess = {
  error: null;
  success:
    | {
        type: 'correctGuess';
        playerToFind: Player;
      }
    | {
        type: 'incorrectGuess';
        guessedPlayer: Player;
        comparisonResults: ComparisonResults;
        playerToFindMatches: PlayerToFindMatches;
      };
};

export type CheckGuessAction = CheckGuessActionError | CheckGuessActionSuccess;
