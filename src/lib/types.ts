import { game, guess, player, schedule } from '@/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type Player = InferSelectModel<typeof player>;

export type Schedule = InferSelectModel<typeof schedule>;

export type ScheduleWithPlayer = Schedule & { playerToFind: Player };

export type Game = InferSelectModel<typeof game>;

export type GuessWithPlayer = InferSelectModel<typeof guess> & {
  player: Player;
};

export type GameWithGuesses = Game & {
  guesses: GuessWithPlayer[];
};

export type BestResultColumnType =
  | NonNullable<Player['bestResultPDC']>
  | NonNullable<Player['bestResultWDF']>;

export type Match = 'match' | 'noMatch';
export type RangedMatch = Match | 'higher' | 'lower';

export type ComparisonResults = {
  firstName: Match;
  lastName: Match;
  gender: Match;
  dateOfBirth: RangedMatch;
  country: Match;
  playingSince: RangedMatch;
  dartsBrand: Match;
  dartsWeight: RangedMatch;
  laterality: Match;
  organisation: Match;
  tourCard: Match;
  rankingPDC: RangedMatch;
  rankingWDF: RangedMatch;
  prizeMoney: RangedMatch;
  nineDartersPDC: RangedMatch;
  bestResultPDC: RangedMatch;
  yearOfBestResultPDC: RangedMatch;
  bestResultWDF: RangedMatch;
  yearOfBestResultWDF: RangedMatch;
  playedInWCOD: Match;
  playedInWDF: Match;
  active: Match;
};

export type PlayerToFindMatches = Omit<
  Partial<Player>,
  'id' | 'createdAt' | 'updatedAt' | 'difficulty'
>;

export type ExistingGame = {
  gameInProgress: true;
  guesses: Guess[];
  playerToFindMatches: PlayerToFindMatches;
  playerDifficulty: Player['difficulty'];
  winnersCount: number;
  nextPlayerStartDate: Schedule['startDate'];
};

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

type GiveUpError = { error: string; success: false };
type GiveUpSuccess = { error: null; success: true };

export type GiveUpAction = GiveUpError | GiveUpSuccess;

export type ErrorObject = { error: string };

export type NextScheduledPlayer = {
  startDate: Schedule['startDate'];
  playerToFind: { difficulty: Player['difficulty'] };
};

export type NoGame = {
  noGame: true;
  playerDifficulty: Player['difficulty'];
  winnersCount: number;
  nextPlayerStartDate: Schedule['startDate'];
};

export type GameWon = {
  hasWon: true;
  nextPlayerStartDate: Schedule['startDate'];
  nextPlayerDifficulty: Player['difficulty'];
  attempts: number;
  fullName: string;
};

export type GameGivenUp = {
  hasGivenUp: true;
  previousPlayer: Player;
  nextPlayerStartDate: Schedule['startDate'];
  nextPlayerDifficulty: Player['difficulty'];
  attempts: number;
};
