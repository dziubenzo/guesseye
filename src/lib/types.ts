import { player, comparison } from '@/server/db/schema';
import type { InferSelectModel, InferInsertModel } from 'drizzle-orm';

export type Player = InferSelectModel<typeof player>;

export type BestResultColumnType =
  | NonNullable<Player['bestResultPDC']>
  | NonNullable<Player['bestResultWDF']>;

export type Match = 'match' | 'noMatch';
export type RangedMatch = Match | 'higher' | 'lower';

export type ComparisonResults = InferInsertModel<typeof comparison>;

export type PlayerToFindMatches = Omit<
  Partial<Player>,
  'id' | 'createdAt' | 'updatedAt' | 'difficulty'
>;

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
        comparisonResults: ComparisonResults;
      }
    | {
        type: 'incorrectGuess';
        guessedPlayer: Player;
        comparisonResults: ComparisonResults;
        playerToFindMatches: PlayerToFindMatches;
      };
};

export type CheckGuessAction = CheckGuessActionError | CheckGuessActionSuccess;
