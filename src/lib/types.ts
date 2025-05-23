import type { GuessSchemaType } from '@/lib/zod/guess';
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

export type PlayerToFindMatches = GuessSchemaType['playerToFindMatches'];

export type MatchKeys = keyof Pick<
  Player,
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'country'
  | 'dartsBrand'
  | 'laterality'
  | 'organisation'
  | 'tourCard'
  | 'playedInWCOD'
  | 'playedInWDF'
  | 'active'
>;

export type RangedMatchKeys = keyof Pick<
  Player,
  | 'nineDartersPDC'
  | 'playingSince'
  | 'prizeMoney'
  | 'rankingPDC'
  | 'rankingWDF'
  | 'yearOfBestResultPDC'
  | 'yearOfBestResultWDF'
>;

export type SpecialRangedMatchKeys = keyof Pick<
  Player,
  'bestResultPDC' | 'bestResultWDF' | 'dateOfBirth' | 'dartsWeight'
>;

export type PlayerToFindRangedMatch<T> = {
  type: 'higher' | 'lower' | 'match';
  value: T;
};

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

type CheckGuessError = { type: 'error'; error: string };
type CheckGuessSuccess = {
  type: 'success';
  success:
    | {
        type: 'correctGuess';
        playerToFind: Player;
        comparisonResults: ComparisonResults;
        playerToFindMatches: PlayerToFindMatches;
      }
    | {
        type: 'incorrectGuess';
        guessedPlayer: Player;
        comparisonResults: ComparisonResults;
        playerToFindMatches: PlayerToFindMatches;
      };
};

export type CheckGuessAction = CheckGuessError | CheckGuessSuccess;

type GiveUpError = { type: 'error'; error: string };
type GiveUpSuccess = { type: 'success' };

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

export type OfficialGames = {
  scheduleId: Schedule['id'];
  startDate: Schedule['startDate'];
  endDate: Schedule['endDate'];
  playerDifficulty: Player['difficulty'];
  gameExists: boolean;
  gameInfo?: GameInfo;
};

export type GameInfo = {
  fullName?: string;
  gameStatus?: 'won' | 'givenUp' | 'inProgress';
};
