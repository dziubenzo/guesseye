import type { GuessSchemaType } from '@/lib/zod/check-guess';
import { game, guess, player, schedule, user } from '@/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type Player = InferSelectModel<typeof player>;

export type Schedule = InferSelectModel<typeof schedule>;

export type ScheduleWithPlayer = Schedule & { playerToFind: Player };

export type Game = InferSelectModel<typeof game>;

export type User = InferSelectModel<typeof user>;

export type GuessWithPlayer = InferSelectModel<typeof guess> & {
  player: Player;
};

export type GuessWithPlayerName = InferSelectModel<typeof guess> & {
  player: Pick<Player, 'firstName' | 'lastName'>;
};

export type GameWithGuesses = Game & {
  guesses: InferSelectModel<typeof guess>[];
};

export type OfficialGame = Game & {
  guesses: GuessWithPlayer[];
};

export type RandomGame = OfficialGame & {
  randomPlayer: Player | null;
};

export type UserStatsGame = Game & {
  guesses: GuessWithPlayerName[];
  randomPlayer: {
    firstName: Player['firstName'];
    lastName: Player['lastName'];
  } | null;
};

export type GlobalStatsGame = UserStatsGame & {
  user: {
    name: User['name'];
  } | null;
};

export type GameWithGuessesAndUser = Game & {
  guesses: InferSelectModel<typeof guess>[];
  user: User | null;
};

export type BestResultColumnType =
  | NonNullable<Player['bestResultPDC']>
  | NonNullable<Player['bestResultWDF']>
  | NonNullable<Player['bestResultUKOpen']>;

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
  tourCard: Match;
  rankingElo: RangedMatch;
  rankingPDC: RangedMatch;
  rankingWDF: RangedMatch;
  nineDartersPDC: RangedMatch;
  bestResultPDC: RangedMatch;
  yearOfBestResultPDC: RangedMatch;
  bestResultWDF: RangedMatch;
  yearOfBestResultWDF: RangedMatch;
  bestResultUKOpen: RangedMatch;
  yearOfBestResultUKOpen: RangedMatch;
  playedInWCOD: Match;
  status: Match;
};

export type PlayerToFindMatches = GuessSchemaType['currentMatches'];

export type MatchKeys = keyof Pick<
  Player,
  | 'firstName'
  | 'lastName'
  | 'gender'
  | 'country'
  | 'dartsBrand'
  | 'laterality'
  | 'tourCard'
  | 'playedInWCOD'
  | 'status'
>;

export type RangedMatchKeys = keyof Pick<
  Player,
  | 'nineDartersPDC'
  | 'playingSince'
  | 'rankingElo'
  | 'rankingPDC'
  | 'rankingWDF'
  | 'yearOfBestResultPDC'
  | 'yearOfBestResultWDF'
  | 'yearOfBestResultUKOpen'
>;

export type SpecialRangedMatchKeys = keyof Pick<
  Player,
  | 'bestResultPDC'
  | 'bestResultWDF'
  | 'bestResultUKOpen'
  | 'dateOfBirth'
  | 'dartsWeight'
>;

export type PlayerToFindRangedMatch<T> = {
  type: 'higher' | 'lower' | 'match';
  value: T;
};

export type ExistingOfficialGame = {
  status: 'inProgress';
  mode: 'official';
  guesses: Guess[];
  playerToFindMatches: PlayerToFindMatches;
  playerDifficulty: Player['difficulty'];
  winnersCount: number;
  nextPlayerStartDate: Schedule['startDate'];
};

export type ExistingRandomGame = Pick<
  ExistingOfficialGame,
  'guesses' | 'playerToFindMatches' | 'playerDifficulty'
> & { mode: 'random' };

export type GameMode = 'official' | 'random';

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
        newMatches: PlayerToFindMatches;
      }
    | {
        type: 'incorrectGuess';
        guessedPlayer: Player;
        comparisonResults: ComparisonResults;
        newMatches: PlayerToFindMatches;
      };
};

export type CheckGuessAction = CheckGuessError | CheckGuessSuccess;

type GiveUpError = { type: 'error'; error: string };
type GiveUpSuccess = { type: 'success'; playerToFind: string };

export type GiveUpAction = GiveUpError | GiveUpSuccess;

export type ErrorObject = { error: string };

export type UpdateAction = {
  type: 'error' | 'success';
  message: string;
};

export type NextScheduledPlayer = {
  startDate: Schedule['startDate'];
  playerToFind: { difficulty: Player['difficulty'] };
};

export type GameNotPlayed = {
  status: 'notPlayed';
  mode: 'official';
  playerDifficulty: Player['difficulty'];
  winnersCount: number;
  nextPlayerStartDate: Schedule['startDate'];
};

export type GameWon = {
  status: 'won';
  nextPlayerStartDate: Schedule['startDate'];
  nextPlayerDifficulty: Player['difficulty'];
  attempts: number;
  fullName: string;
};

export type GameGivenUp = {
  status: 'givenUp';
  previousPlayer: PlayerToFindMatches;
  previousPlayerDifficulty: Player['difficulty'];
  nextPlayerStartDate: Schedule['startDate'];
  nextPlayerDifficulty: Player['difficulty'];
  attempts: number;
};

export type OfficialGames = {
  gameNo: number;
  scheduleId: Schedule['id'];
  startDate: Schedule['startDate'];
  endDate: Schedule['endDate'];
  playerDifficulty: Player['difficulty'];
  gameInfo: GameInfo;
};

export type GameInfo = {
  fullName?: string;
  status: 'won' | 'givenUp' | 'inProgress' | 'notPlayed';
};

export type OfficialGamesHistory = Pick<
  OfficialGames,
  'gameNo' | 'startDate' | 'endDate' | 'playerDifficulty'
> & {
  winners: number;
  firstWinner?: string;
  firstWinnerTime?: Game['endDate'];
  fastestWinner?: string;
  fastestWinnerDuration?: number;
  winnerWithFewestGuesses?: string;
  winnerGuesses?: number;
};

export type Leaderboard = {
  username: string;
  isCurrentUser: boolean;
  officialModeWins: number;
  officialModeGiveUps: number;
  randomModeWins: number;
  randomModeGiveUps: number;
  gamesInProgress: number;
  fastestWin?: number;
  fewestGuesses?: number;
};

export type UserStats = {
  guesses: {
    fewestGuesses?: number;
    mostGuesses?: number;
    avgGuesses?: number;
    avgGuessesToWin?: number;
    avgGuessesToGiveUp?: number;
    totalGuesses: number;
  };
  games: {
    official: {
      officialGamesPlayed: number;
      officialGamesPlayedPercentage: number;
      officialGamesCompleted: number;
      officialGamesCompletedPercentage: number;
      officialModeWins: number;
      officialModeWinsPercentage: number;
      officialModeGiveUps: number;
      officialModeGiveUpsPercentage: number;
    };
    random: {
      randomGamesPlayed: number;
      randomModeWins: number;
      randomModeWinsPercentage: number;
      randomModeGiveUps: number;
      randomModeGiveUpsPercentage: number;
    };
    duration: {
      fastestWin?: number;
      slowestWin?: number;
    };
  };
  players: {
    firstOfficialGuess?: string;
    firstOfficialGuessTime?: Date;
    latestOfficialGuess?: string;
    latestOfficialGuessTime?: Date;
    firstOfficialWin?: string;
    firstOfficialWinTime?: Date;
    latestOfficialWin?: string;
    latestOfficialWinTime?: Date;
    firstRandomGuess?: string;
    firstRandomGuessTime?: Date;
    latestRandomGuess?: string;
    latestRandomGuessTime?: Date;
  };
  guessFrequency: { fullName: string; count: number }[];
  gamesByDay: { date: string; count: number; won: number; givenUp: number }[];
  guessesByDay: { date: string; count: number }[];
  randomPlayers: { fullName: string; count: number }[];
};

export type GamesByDayObject = Record<
  string,
  {
    count: number;
    won: number;
    givenUp: number;
  }
>;

export type GlobalStats = {
  guesses: {
    fewestGuesses?: number;
    mostGuesses?: number;
    avgGuesses?: number;
    avgGuessesUser?: number;
    avgGuessesGuest?: number;
    avgGuessesToWin?: number;
    avgGuessesToWinUser?: number;
    avgGuessesToWinGuest?: number;
    avgGuessesToGiveUp?: number;
    avgGuessesToGiveUpUser?: number;
    avgGuessesToGiveUpGuest?: number;
    totalGuesses: number;
    totalGuessesUser: number;
    totalGuessesGuest: number;
  };
  games: {
    official: {
      officialGamesPlayed: number;
      officialGamesCompleted: number;
      officialModeWins: number;
      officialModeGiveUps: number;
    };
    random: {
      randomGamesPlayed: number;
      randomGamesCompleted: number;
      randomModeWins: number;
      randomModeGiveUps: number;
      randomGamesPlayedUser: number;
      randomGamesCompletedUser: number;
      randomModeWinsUser: number;
      randomModeGiveUpsUser: number;
      randomGamesPlayedGuest: number;
      randomGamesCompletedGuest: number;
      randomModeWinsGuest: number;
      randomModeGiveUpsGuest: number;
    };
  };
  players: {
    latestOfficialGuess?: string;
    latestOfficialGuessName?: string;
    latestOfficialGuessTime?: Date;
    latestRandomGuess?: string;
    latestRandomGuessName?: string;
    latestRandomGuessTime?: Date;
  };
  guessFrequency: UserStats['guessFrequency'];
  gamesByDay: UserStats['gamesByDay'];
  guessesByDay: UserStats['guessesByDay'];
  randomPlayers: UserStats['randomPlayers'];
};

export type DatabaseStatsPlayer = Omit<
  Player,
  'id' | 'createdAt' | 'updatedAt'
>;

export type DatabaseStatsType =
  | 'gender'
  | 'age'
  | 'birthMonth'
  | 'birthDate'
  | 'birthDay'
  | 'country'
  | 'playingSince'
  | 'laterality'
  | 'dartsBrand'
  | 'dartsWeight'
  | 'nineDartersPDC'
  | 'bestResultPDC'
  | 'bestResultWDF'
  | 'bestResultUKOpen'
  | 'yearOfBestResultPDC'
  | 'yearOfBestResultWDF'
  | 'yearOfBestResultUKOpen'
  | 'status'
  | 'difficulty';

export type DatabaseStatsResult = {
  value: string;
  count: number;
  percentage: number;
};

export type DatabaseStatsObject = {
  [key in DatabaseStatsType]: Record<string, number>;
};

export type DatabaseStats = {
  [key in DatabaseStatsType]: DatabaseStatsResult[];
};

export type UpdatedRanking = {
  firstName: string;
  lastName: string;
  ranking: number;
};

export type UpdateRankingsType =
  | 'menPDC'
  | 'womenPDC'
  | 'menWDF'
  | 'womenWDF'
  | 'elo';

export type TourCardHolder = Omit<UpdatedRanking, 'ranking'>;

export type PlayerWithCount = {
  id: Player['id'];
  firstName: Player['firstName'];
  lastName: Player['lastName'];
  gender: Player['gender'];
  difficulty: Player['difficulty'];
  officialModeCount: number;
};
