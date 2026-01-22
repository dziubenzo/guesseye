import type { GuessSchemaType } from '@/lib/zod/check-guess';
import { game, guess, hint, player, schedule, user } from '@/server/db/schema';
import type { InferSelectModel } from 'drizzle-orm';

export type Player = InferSelectModel<typeof player>;

export type PlayersMap = Map<string, Player>;

export type PlayerWithHints = Player & { hints: GameHint[] };

export type Schedule = InferSelectModel<typeof schedule>;

export type ScheduleWithPlayerAndGame = Schedule & {
  playerToFind: PlayerWithHints;
  games: OfficialGame[];
};

export type Game = InferSelectModel<typeof game>;

export type User = InferSelectModel<typeof user>;

export type Hint = InferSelectModel<typeof hint>;

export type GameHint = Pick<Hint, 'createdAt' | 'hint'> & {
  user: Pick<User, 'name'> | null;
};

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
  randomPlayer: PlayerWithHints | null;
};

export type UserStatsGame = Game & {
  guesses: GuessWithPlayerName[];
  scheduledPlayer: {
    playerToFindId: Schedule['playerToFindId'];
  } | null;
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
export type PlayerToFindMatch = PlayerToFindMatches[keyof PlayerToFindMatches];

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

export type AnyOfficialGame = {
  gameId?: Game['id'];
  status: 'inProgress';
  mode: 'official';
  guesses: Guess[];
  hints: GameHint[];
  obfuscatedHints: string[];
  availableHints: number;
  playerToFindMatches: PlayerToFindMatches;
  playerDifficulty: Player['difficulty'];
  winnersCount: number;
  nextPlayerStartDate: Schedule['startDate'];
};

export type ExistingRandomGame = Pick<
  AnyOfficialGame,
  | 'status'
  | 'gameId'
  | 'guesses'
  | 'playerToFindMatches'
  | 'hints'
  | 'obfuscatedHints'
  | 'availableHints'
  | 'playerDifficulty'
> & { mode: 'random' };

export type NoRandomGame = Pick<
  ExistingRandomGame,
  | 'gameId'
  | 'mode'
  | 'guesses'
  | 'playerToFindMatches'
  | 'hints'
  | 'obfuscatedHints'
  | 'availableHints'
> & {
  status: 'noGame';
  playerDifficulty: PlayerDifficultyField;
};

export type CompletedGameTable = {
  gameId: Game['id'];
  gameNo: number;
  playerToFindName: string;
  playerToFindDifficulty: Player['difficulty'];
  endDate: Date;
  mode: Game['mode'];
  status: 'won' | 'givenUp';
  guessesCount: number;
};

export type CompletedGameDetails = {
  username: string;
  startDate: Game['startDate'];
  endDate: Date;
  mode: Game['mode'];
  status: CompletedGameTable['status'];
  hintsRevealed: Game['hintsRevealed'];
  playerToFind: Player;
  guesses: GuessWithPlayer[];
};

export type PlayerDifficultyField = Player['difficulty'] | '???';

export type GameMode = 'official' | 'random';

export type Guess = {
  guessedPlayer: Player;
  comparisonResults: ComparisonResults;
};

type ActionError = { type: 'error'; error: string };
type CheckGuessSuccess = {
  type: 'success';
  success: (
    | {
        type: 'correctGuess';
        playerToFind: Player;
        comparisonResults: ComparisonResults;
      }
    | {
        type: 'incorrectGuess';
        guessedPlayer: Player;
        comparisonResults: ComparisonResults;
      }
  ) & {
    newMatches: PlayerToFindMatches;
    playerDifficulty: Player['difficulty'];
  };
};

export type CheckGuessAction = ActionError | CheckGuessSuccess;

type GiveUpSuccess = { type: 'success'; playerToFind: string };

export type GiveUpAction = ActionError | GiveUpSuccess;

type RevealHintSuccess = { type: 'success'; revealedHint: GameHint };

export type RevealHintAction = ActionError | RevealHintSuccess;

export type ErrorObject = { error: string };

export type UpdateAction = {
  type: 'error' | 'success';
  message: string;
};

export type NextScheduledPlayer = {
  startDate: Schedule['startDate'];
  playerToFind: { difficulty: Player['difficulty'] };
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

export type LeaderboardUser = {
  username: string;
  isCurrentUser: boolean;
  officialModeWins: number;
  officialModeGiveUps: number;
  randomModeWins: number;
  randomModeGiveUps: number;
  hintsRevealed: number;
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
      officialModeHintsRevealed: number;
      officialModeHintsRevealedPercentage: number;
    };
    random: {
      randomGamesPlayed: number;
      randomModeWins: number;
      randomModeWinsPercentage: number;
      randomModeGiveUps: number;
      randomModeGiveUpsPercentage: number;
      randomModeHintsRevealed: number;
      randomModeHintsRevealedPercentage: number;
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
      officialModeHintsRevealed: number;
      officialModeHintsRevealedPercentage: number;
    };
    random: {
      randomGamesPlayed: number;
      randomGamesCompleted: number;
      randomModeWins: number;
      randomModeGiveUps: number;
      randomModeHintsRevealed: number;
      randomModeHintsRevealedPercentage: number;
      randomGamesPlayedUser: number;
      randomGamesCompletedUser: number;
      randomModeWinsUser: number;
      randomModeGiveUpsUser: number;
      randomModeHintsRevealedUser: number;
      randomModeHintsRevealedPercentageUser: number;
      randomGamesPlayedGuest: number;
      randomGamesCompletedGuest: number;
      randomModeWinsGuest: number;
      randomModeGiveUpsGuest: number;
      randomModeHintsRevealedGuest: number;
      randomModeHintsRevealedPercentageGuest: number;
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

export type RankedPlayer = {
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

export type TourCardHolder = Omit<RankedPlayer, 'ranking'>;

export type PlayerAdmin = Pick<
  Player,
  'id' | 'firstName' | 'lastName' | 'gender' | 'difficulty'
> & {
  officialModeCount: number;
  approvedHintsCount: number;
};

export type GroupedPlayersAdmin = {
  male: PlayerAdmin[];
  female: PlayerAdmin[];
};

export type PlayerSuggestHint = Pick<
  PlayerAdmin,
  'id' | 'firstName' | 'lastName'
> & { difficulty: null };

export type BirthdayPlayer = {
  fullName: string;
  age: number;
};

export type PlayerFullName = {
  fullName: string;
};

export type EvaluateMatchesResult =
  | {
      type: 'error';
      message: string;
      matches: string[];
    }
  | { type: 'success'; guess: string };

export type SuggestedHint = Hint & {
  fullName: string;
  addedBy: User['name'] | null;
  approvedHintsCount: number;
};

export type HintCounts = {
  totalHintCount: number;
  playerHintCount: number;
};
