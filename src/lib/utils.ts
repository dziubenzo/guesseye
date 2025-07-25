import type {
  BestResultColumnType,
  ComparisonResults,
  DatabaseStats,
  DatabaseStatsObject,
  DatabaseStatsPlayer,
  DatabaseStatsType,
  ErrorObject,
  GamesByDayObject,
  GameWithGuesses,
  GameWithGuessesAndUser,
  GlobalStats,
  GlobalStatsGame,
  Guess,
  GuessWithPlayerName,
  Leaderboard,
  MatchKeys,
  OfficialGamesHistory,
  Player,
  PlayerToFindMatches,
  RangedMatchKeys,
  Schedule,
  SpecialRangedMatchKeys,
  UpdateRankingsType,
  UserStats,
  UserStatsGame,
} from '@/lib/types';
import type { GuessSchemaType } from '@/lib/zod/check-guess';
import { player } from '@/server/db/schema';
import assert, { AssertionError } from 'assert';
import { clsx, type ClassValue } from 'clsx';
import {
  differenceInYears,
  getDate,
  getDay,
  getMonth,
  millisecondsToMinutes,
  millisecondsToSeconds,
} from 'date-fns';
import { eq, getTableColumns } from 'drizzle-orm';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getAge(dateOfBirth: Date | string) {
  return differenceInYears(new Date(), dateOfBirth);
}

export function capitalise(string: string) {
  const splitString = string.split('-');

  // Capitalise laterality
  if (splitString.length === 2) {
    return (
      splitString[0][0].toUpperCase() +
      splitString[0].slice(1) +
      '-' +
      splitString[1][0].toUpperCase() +
      splitString[1].slice(1)
    );
  }

  return string[0].toUpperCase() + string.slice(1);
}

// Get rid of all special characters in player's name
export function normaliseArray(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ł', 'l')
    .split(' ');
}

export function normaliseString(name: string) {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ł', 'l');
}

export function checkIfGuessCorrect(
  guessedPlayer: Player,
  playerToFind: Player
) {
  let isGuessCorrect = true;

  // Convert Date objects cached as strings back to Date objects
  // Otherwise the check below fails, but it should not
  guessedPlayer.createdAt = new Date(guessedPlayer.createdAt);
  guessedPlayer.updatedAt = new Date(guessedPlayer.updatedAt);

  try {
    assert.deepStrictEqual(guessedPlayer, playerToFind);
  } catch (error) {
    if (error instanceof AssertionError) {
      isGuessCorrect = false;
    }
  }

  return isGuessCorrect;
}

export function fillAllMatches(
  playerToFind: Player,
  currentMatches: PlayerToFindMatches
) {
  let key: keyof Player;

  for (key in playerToFind) {
    switch (key) {
      // Cases to skip
      case 'id':
      case 'createdAt':
      case 'updatedAt':
      case 'difficulty':
        break;
      // Match cases
      case 'firstName':
      case 'lastName':
      case 'country':
        currentMatches[key] = playerToFind[key];
        break;
      case 'tourCard':
      case 'playedInWCOD':
        currentMatches[key] = playerToFind[key];
        break;
      case 'status':
        currentMatches[key] = playerToFind[key];
        break;
      case 'dartsBrand':
        currentMatches[key] = playerToFind[key];
        break;
      case 'gender':
        currentMatches[key] = playerToFind[key];
        break;
      case 'laterality':
        currentMatches[key] = playerToFind[key];
        break;
      // Ranged match cases
      case 'nineDartersPDC':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
      case 'playingSince':
      case 'rankingElo':
      case 'rankingPDC':
      case 'rankingWDF':
      case 'yearOfBestResultPDC':
      case 'yearOfBestResultWDF':
      case 'yearOfBestResultUKOpen':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
      // Special ranged match cases
      case 'dateOfBirth':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
      case 'bestResultPDC':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
      case 'bestResultWDF':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
      case 'bestResultUKOpen':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
      case 'dartsWeight':
        currentMatches[key] = {
          type: 'match',
          value: playerToFind[key],
        };
        break;
    }
  }

  return;
}

export function buildBestResultMap(columnValues: BestResultColumnType[]) {
  const reversedValues = columnValues.toReversed();
  let weight = 1;

  const map = reversedValues.reduce((map, result) => {
    map.set(result, weight);
    // Treat Fourth Place and Semi-Finals as equal result
    if (result === 'Fourth Place') {
      return map;
    }
    weight++;
    return map;
  }, new Map<BestResultColumnType, number>());

  return map;
}

export const bestResultPDCMap = buildBestResultMap(
  getTableColumns(player).bestResultPDC.enumValues
);
export const bestResultWDFMap = buildBestResultMap(
  getTableColumns(player).bestResultWDF.enumValues
);
export const bestResultUKOpenMap = buildBestResultMap(
  getTableColumns(player).bestResultUKOpen.enumValues
);

export function comparePlayers(
  guessedPlayer: Player,
  playerToFind: Player,
  currentMatches: PlayerToFindMatches
) {
  const comparisonResults = {} as ComparisonResults;
  let key: keyof Player;

  function compareMatch(key: MatchKeys) {
    if (guessedPlayer[key] !== playerToFind[key]) {
      comparisonResults[key] = 'noMatch';
    } else if (guessedPlayer[key] === playerToFind[key]) {
      comparisonResults[key] = 'match';
      // Is there a normal way to narrow possible values in TS so that I don't get the only common type: undefined?
      switch (key) {
        case 'firstName':
        case 'lastName':
        case 'country':
          currentMatches[key] = playerToFind[key];
          break;
        case 'tourCard':
        case 'playedInWCOD':
          currentMatches[key] = playerToFind[key];
          break;
        case 'status':
          currentMatches[key] = playerToFind[key];
          break;
        case 'dartsBrand':
          currentMatches[key] = playerToFind[key];
          break;
        case 'gender':
          currentMatches[key] = playerToFind[key];
          break;
        case 'laterality':
          currentMatches[key] = playerToFind[key];
          break;
      }
    }
  }

  function compareRangedMatch(key: RangedMatchKeys) {
    if (
      (guessedPlayer[key] === null && playerToFind[key] === null) ||
      guessedPlayer[key] === playerToFind[key]
    ) {
      comparisonResults[key] = 'match';
      switch (key) {
        case 'nineDartersPDC':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'playingSince':
        case 'rankingElo':
        case 'rankingPDC':
        case 'rankingWDF':
        case 'yearOfBestResultPDC':
        case 'yearOfBestResultWDF':
        case 'yearOfBestResultUKOpen':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
      }
    } else if (guessedPlayer[key] === null || playerToFind[key] === null) {
      comparisonResults[key] = 'noMatch';
    } else if (guessedPlayer[key] > playerToFind[key]) {
      comparisonResults[key] = 'lower';
      updateRangedMatch(key, 'lower');
    } else if (guessedPlayer[key] < playerToFind[key]) {
      comparisonResults[key] = 'higher';
      updateRangedMatch(key, 'higher');
    }
  }

  function updateRangedMatch(
    key: RangedMatchKeys,
    newType: 'higher' | 'lower'
  ) {
    if (guessedPlayer[key] === null || playerToFind[key] === null) return;

    if (currentMatches[key]?.type !== 'match') {
      const newClosest = findClosest(
        guessedPlayer[key],
        playerToFind[key],
        currentMatches[key]?.value
      );
      const currentType = currentMatches[key]?.type;
      currentMatches[key] = {
        type: newClosest.type === 'current' ? currentType! : newType,
        value: newClosest.value,
      };
    }
  }

  function compareSpecialRangedMatch(key: SpecialRangedMatchKeys) {
    if (
      (guessedPlayer[key] === null && playerToFind[key] === null) ||
      guessedPlayer[key] === playerToFind[key]
    ) {
      comparisonResults[key] = 'match';
      switch (key) {
        case 'dateOfBirth':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'bestResultPDC':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'bestResultWDF':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'dartsWeight':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
      }
    } else if (guessedPlayer[key] === null || playerToFind[key] === null) {
      comparisonResults[key] = 'noMatch';
    }

    let guessedValue: number;
    let playerToFindValue: number;
    let currentMatchValue: number | undefined;

    switch (key) {
      case 'dateOfBirth':
        guessedValue = getAge(guessedPlayer[key]!);
        playerToFindValue = getAge(playerToFind[key]!);
        currentMatchValue = currentMatches[key]?.value
          ? getAge(currentMatches[key]!.value)
          : undefined;
        break;
      case 'dartsWeight':
        guessedValue = parseFloat(guessedPlayer[key]!);
        playerToFindValue = parseFloat(playerToFind[key]!);
        currentMatchValue = currentMatches[key]?.value
          ? parseFloat(currentMatches[key]!.value)
          : undefined;
        break;
      case 'bestResultPDC':
        guessedValue = bestResultPDCMap.get(guessedPlayer[key]!)!;
        playerToFindValue = bestResultPDCMap.get(playerToFind[key]!)!;
        currentMatchValue = currentMatches[key]?.value
          ? bestResultPDCMap.get(currentMatches[key]?.value)
          : undefined;
        break;
      case 'bestResultWDF':
        guessedValue = bestResultWDFMap.get(guessedPlayer[key]!)!;
        playerToFindValue = bestResultWDFMap.get(playerToFind[key]!)!;
        currentMatchValue = currentMatches[key]?.value
          ? bestResultWDFMap.get(currentMatches[key]?.value)
          : undefined;
        break;
      case 'bestResultUKOpen':
        guessedValue = bestResultUKOpenMap.get(guessedPlayer[key]!)!;
        playerToFindValue = bestResultUKOpenMap.get(playerToFind[key]!)!;
        currentMatchValue = currentMatches[key]?.value
          ? bestResultWDFMap.get(currentMatches[key]?.value)
          : undefined;
        break;
    }

    if (guessedValue > playerToFindValue) {
      comparisonResults[key] =
        key === 'dartsWeight' || key === 'dateOfBirth' ? 'lower' : 'higher';
      updateSpecialRangedMatch(
        key,
        key === 'dartsWeight' || key === 'dateOfBirth' ? 'lower' : 'higher',
        guessedValue,
        playerToFindValue,
        currentMatchValue
      );
    } else if (guessedValue < playerToFindValue) {
      comparisonResults[key] =
        key === 'dartsWeight' || key === 'dateOfBirth' ? 'higher' : 'lower';
      updateSpecialRangedMatch(
        key,
        key === 'dartsWeight' || key === 'dateOfBirth' ? 'higher' : 'lower',
        guessedValue,
        playerToFindValue,
        currentMatchValue
      );
    } else if (guessedValue === playerToFindValue) {
      comparisonResults[key] = 'match';
      switch (key) {
        case 'dateOfBirth':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'bestResultPDC':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'bestResultWDF':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'bestResultUKOpen':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
        case 'dartsWeight':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
      }
    }
  }

  function updateSpecialRangedMatch(
    key: SpecialRangedMatchKeys,
    newType: 'higher' | 'lower',
    guessedValue: number,
    playerToFindValue: number,
    currentMatchValue: number | undefined
  ) {
    if (currentMatches[key]?.type !== 'match') {
      const newClosest = findClosest(
        guessedValue,
        playerToFindValue,
        currentMatchValue
      );
      const currentType = currentMatches[key]?.type;
      switch (key) {
        case 'dateOfBirth':
          currentMatches[key] = {
            type: newClosest.type === 'current' ? currentType! : newType,
            value:
              newClosest.type === 'current'
                ? currentMatches[key]!.value
                : guessedPlayer[key],
          };
          break;
        case 'bestResultPDC':
          currentMatches[key] = {
            type: newClosest.type === 'current' ? currentType! : newType,
            value:
              newClosest.type === 'current'
                ? currentMatches[key]!.value
                : guessedPlayer[key],
          };
          break;
        case 'bestResultWDF':
          currentMatches[key] = {
            type: newClosest.type === 'current' ? currentType! : newType,
            value:
              newClosest.type === 'current'
                ? currentMatches[key]!.value
                : guessedPlayer[key],
          };
          break;
        case 'bestResultUKOpen':
          currentMatches[key] = {
            type: newClosest.type === 'current' ? currentType! : newType,
            value:
              newClosest.type === 'current'
                ? currentMatches[key]!.value
                : guessedPlayer[key],
          };
          break;
        case 'dartsWeight':
          currentMatches[key] = {
            type: newClosest.type === 'current' ? currentType! : newType,
            value:
              newClosest.type === 'current'
                ? currentMatches[key]!.value
                : guessedPlayer[key],
          };
          break;
      }
    }
  }

  for (key in guessedPlayer) {
    switch (key) {
      // Cases to skip
      case 'id':
      case 'createdAt':
      case 'updatedAt':
      case 'difficulty':
        break;
      // Match cases
      case 'firstName':
      case 'lastName':
      case 'gender':
      case 'country':
      case 'dartsBrand':
      case 'laterality':
      case 'tourCard':
      case 'playedInWCOD':
      case 'status':
        compareMatch(key);
        break;
      // Ranged match cases
      case 'playingSince':
      case 'rankingElo':
      case 'rankingPDC':
      case 'rankingWDF':
      case 'nineDartersPDC':
      case 'yearOfBestResultPDC':
      case 'yearOfBestResultWDF':
      case 'yearOfBestResultUKOpen':
        compareRangedMatch(key);
        break;
      // Special ranged match cases
      case 'dateOfBirth':
      case 'dartsWeight':
      case 'bestResultPDC':
      case 'bestResultWDF':
      case 'bestResultUKOpen':
        compareSpecialRangedMatch(key);
        break;
    }
  }

  return { comparisonResults };
}

type FindClosestType = {
  type: 'current' | 'guess';
  value: number;
};

export function findClosest(
  guess: number,
  playerToFind: number,
  currentMatch: number | undefined | null
): FindClosestType {
  if (!currentMatch) {
    return { type: 'guess', value: guess };
  }

  const currentDifference = Math.abs(playerToFind - currentMatch);
  const newDifference = Math.abs(playerToFind - guess);

  return currentDifference < newDifference
    ? { type: 'current', value: currentMatch }
    : { type: 'guess', value: guess };
}

export function checkForDuplicateGuess(
  guess: GuessSchemaType['guess'],
  prevGuesses: Guess[]
) {
  const isDuplicateGuess = prevGuesses.some((prevGuess) => {
    const splitGuess = normaliseArray(guess);
    const firstName = normaliseString(prevGuess.guessedPlayer.firstName);
    const lastName = normaliseString(prevGuess.guessedPlayer.lastName);
    const lastWordIndex = splitGuess.length - 1;

    if (splitGuess.length === 1) {
      return (
        firstName.includes(splitGuess[0]) || lastName.includes(splitGuess[0])
      );
    }

    return (
      (firstName.includes(splitGuess[0]) &&
        lastName.includes(splitGuess[lastWordIndex])) ||
      (lastName.includes(splitGuess[0]) &&
        firstName.includes(splitGuess[lastWordIndex])) ||
      (lastName.includes(splitGuess[0]) &&
        lastName.includes(splitGuess[lastWordIndex]))
    );
  });

  return isDuplicateGuess;
}

export function getDifficultyColour(difficulty: Player['difficulty']) {
  switch (difficulty) {
    case 'easy':
      return 'text-good-guess';
    case 'medium':
      return 'text-medium-difficulty';
    default:
      return 'text-wrong-guess';
  }
}

export const validateScheduleId = (scheduleId: string | undefined) => {
  if (scheduleId) {
    // Make sure scheduleId is a positive integer
    const isValid =
      Number.isInteger(Number(scheduleId)) && Number(scheduleId) > 0;

    if (!isValid) {
      const error: ErrorObject = { error: 'Invalid game.' };
      return error;
    }
  }

  return { validScheduleId: scheduleId ? Number(scheduleId) : undefined };
};

export function filterPlayers(players: Player[], guess: string[]): Player[] {
  const searchResults = players.filter((player) => {
    const firstName = normaliseString(player.firstName);
    const lastName = normaliseString(player.lastName);
    const lastWordIndex = guess.length - 1;

    if (guess.length === 1) {
      return firstName.includes(guess[0]) || lastName.includes(guess[0]);
    }

    // Also allow search by lastName followed by firstName as well as searches for players using only multi-word surname such as van Gerwen or Van den Bergh
    return (
      (firstName.includes(guess[0]) &&
        lastName.includes(guess[lastWordIndex])) ||
      (lastName.includes(guess[0]) &&
        firstName.includes(guess[lastWordIndex])) ||
      (lastName.includes(guess[0]) && lastName.includes(guess[lastWordIndex]))
    );
  });

  return searchResults;
}

export function checkSearchResults(searchResults: Player[]) {
  let error: ErrorObject;

  if (searchResults.length === 0) {
    error = {
      error: 'No darts player found. Try again.',
    };
    return error;
  } else if (searchResults.length === 2) {
    const playerNames = searchResults
      .map((player) => {
        return player.firstName + ' ' + player.lastName;
      })
      .join(' and ');
    error = {
      error: `Found two players: ${playerNames}. Please add more detail to your guess.`,
    };
    return error;
  } else if (searchResults.length > 2) {
    error = {
      error:
        'Found more than two darts players. Please add more detail to your guess.',
    };
    return error;
  }

  return searchResults[0];
}

export function findFirstWinner(
  currentGame: GameWithGuessesAndUser,
  scheduledPlayerHistory: OfficialGamesHistory,
  scheduledPlayerStartDate: Schedule['startDate']
) {
  if (
    !scheduledPlayerHistory.firstWinner &&
    !scheduledPlayerHistory.firstWinnerTime
  ) {
    scheduledPlayerHistory.firstWinner = currentGame.user?.name;
    scheduledPlayerHistory.firstWinnerTime = currentGame.endDate;
    return;
  }

  const previousGameEndTime = scheduledPlayerHistory.firstWinnerTime!.getTime();
  const currentGameEndTime = currentGame.endDate!.getTime();
  const scheduledPlayerStartTime = scheduledPlayerStartDate.getTime();

  const previousDifference = Math.abs(
    previousGameEndTime - scheduledPlayerStartTime
  );
  const currentDifference = Math.abs(
    currentGameEndTime - scheduledPlayerStartTime
  );

  if (currentDifference > previousDifference) return;

  scheduledPlayerHistory.firstWinner = currentGame.user?.name;
  scheduledPlayerHistory.firstWinnerTime = currentGame.endDate;

  return;
}

export function findFastestWinner(
  currentGame: GameWithGuessesAndUser,
  scheduledPlayerHistory: OfficialGamesHistory
) {
  const currentGameStartTime = currentGame.startDate.getTime();
  const currentGameEndTime = currentGame.endDate!.getTime();
  const currentGameDuration = Math.abs(
    currentGameEndTime - currentGameStartTime
  );

  if (
    !scheduledPlayerHistory.fastestWinner &&
    !scheduledPlayerHistory.fastestWinnerDuration
  ) {
    scheduledPlayerHistory.fastestWinner = currentGame.user?.name;
    scheduledPlayerHistory.fastestWinnerDuration = currentGameDuration;
    return;
  }

  const previousGameDuration = scheduledPlayerHistory.fastestWinnerDuration!;

  if (currentGameDuration > previousGameDuration) return;

  scheduledPlayerHistory.fastestWinner = currentGame.user?.name;
  scheduledPlayerHistory.fastestWinnerDuration = currentGameDuration;

  return;
}

export function findWinnerWithFewestGuesses(
  currentGame: GameWithGuessesAndUser,
  scheduledPlayerHistory: OfficialGamesHistory
) {
  const currentGameGuesses = currentGame.guesses.length;

  if (
    !scheduledPlayerHistory.winnerWithFewestGuesses &&
    !scheduledPlayerHistory.winnerGuesses
  ) {
    scheduledPlayerHistory.winnerWithFewestGuesses = currentGame.user?.name;
    scheduledPlayerHistory.winnerGuesses = currentGameGuesses;
    return;
  }

  const previousGameGuesses = scheduledPlayerHistory.winnerGuesses!;

  if (currentGameGuesses > previousGameGuesses) return;

  scheduledPlayerHistory.winnerWithFewestGuesses = currentGame.user?.name;
  scheduledPlayerHistory.winnerGuesses = currentGameGuesses;

  return;
}

export function countGames(game: GameWithGuesses, user: Leaderboard) {
  if (game.status === 'inProgress') {
    user.gamesInProgress++;
  } else if (game.status === 'won' && game.mode === 'official') {
    user.officialModeWins++;
  } else if (game.status === 'givenUp' && game.mode === 'official') {
    user.officialModeGiveUps++;
  } else if (game.status === 'won' && game.mode === 'random') {
    user.randomModeWins++;
  } else if (game.status === 'givenUp' && game.mode === 'random') {
    user.randomModeGiveUps++;
  }
}

export function findFastestWin(game: GameWithGuesses, stat?: number) {
  const currentGameStartTime = game.startDate.getTime();
  const currentGameEndTime = game.endDate!.getTime();
  const currentGameDuration = Math.abs(
    currentGameEndTime - currentGameStartTime
  );

  if (!stat) {
    return currentGameDuration;
  }

  const previousGameDuration = stat;

  if (currentGameDuration > previousGameDuration) {
    return previousGameDuration;
  }

  return currentGameDuration;
}

export function findSlowestWin(game: GameWithGuesses, stat?: number) {
  const currentGameStartTime = game.startDate.getTime();
  const currentGameEndTime = game.endDate!.getTime();
  const currentGameDuration = Math.abs(
    currentGameEndTime - currentGameStartTime
  );

  if (!stat) {
    return currentGameDuration;
  }

  const previousGameDuration = stat;

  if (currentGameDuration < previousGameDuration) {
    return previousGameDuration;
  }

  return currentGameDuration;
}

export function findWinWithFewestGuesses(
  game: GameWithGuesses,
  user: Leaderboard
) {
  const currentGameGuesses = game.guesses.length;

  if (!user.fewestGuesses) {
    user.fewestGuesses = currentGameGuesses;
    return;
  }

  const previousGameGuesses = user.fewestGuesses;

  if (currentGameGuesses > previousGameGuesses) return;

  user.fewestGuesses = currentGameGuesses;

  return;
}

// Order the leaderboard by official game wins, random mode wins, official mode giveups and, finally, random mode giveups
export function sortByWinsAndGiveUps(userA: Leaderboard, userB: Leaderboard) {
  if (userA.officialModeWins > userB.officialModeWins) {
    return -1;
  } else if (userA.officialModeWins < userB.officialModeWins) {
    return 1;
  } else if (userA.randomModeWins > userB.randomModeWins) {
    return -1;
  } else if (userA.randomModeWins < userB.randomModeWins) {
    return 1;
  } else if (userA.officialModeGiveUps < userB.officialModeGiveUps) {
    return -1;
  } else if (userA.officialModeGiveUps > userB.officialModeGiveUps) {
    return 1;
  } else if (userA.randomModeGiveUps < userB.randomModeGiveUps) {
    return -1;
  } else if (userA.randomModeGiveUps > userB.randomModeGiveUps) {
    return 1;
  }

  return 0;
}

export function countGamesForUserStats(game: UserStatsGame, stats: UserStats) {
  if (game.mode === 'official') {
    stats.games.official.officialGamesPlayed++;

    if (game.status === 'inProgress') return;

    if (game.status === 'won') {
      stats.games.official.officialModeWins++;
    } else if (game.status === 'givenUp') {
      stats.games.official.officialModeGiveUps++;
    }

    stats.games.official.officialGamesCompleted++;
  } else if (game.mode === 'random') {
    stats.games.random.randomGamesPlayed++;

    if (game.status === 'won') {
      stats.games.random.randomModeWins++;
    } else if (game.status === 'givenUp') {
      stats.games.random.randomModeGiveUps++;
    }
  }
}

export function findFirstAndLatestOfficialWin(
  game: UserStatsGame,
  stats: UserStats
) {
  if (game.mode === 'official' && game.status === 'won') {
    const winningGuess = game.guesses[game.guesses.length - 1].player;
    const winningTime = game.guesses[game.guesses.length - 1].time;
    const firstName = winningGuess.firstName;
    const lastName = winningGuess.lastName;

    if (
      stats.players.firstOfficialWin === undefined ||
      (stats.players.firstOfficialWinTime &&
        winningTime.getTime() < stats.players.firstOfficialWinTime.getTime())
    ) {
      stats.players.firstOfficialWin = firstName + ' ' + lastName;
      stats.players.firstOfficialWinTime = winningTime;
    } else if (
      stats.players.latestOfficialWin === undefined ||
      (stats.players.latestOfficialWinTime &&
        winningTime.getTime() > stats.players.latestOfficialWinTime.getTime())
    ) {
      stats.players.latestOfficialWin = firstName + ' ' + lastName;
      stats.players.latestOfficialWinTime = winningTime;
    }
  }

  return;
}

export function findFewestAndMostGuesses(
  game: UserStatsGame,
  stats: UserStats | GlobalStats
) {
  if (game.status === 'won') {
    const gameGuesses = game.guesses.length;

    if (
      !stats.guesses.fewestGuesses ||
      gameGuesses < stats.guesses.fewestGuesses
    ) {
      stats.guesses.fewestGuesses = gameGuesses;
    }

    if (!stats.guesses.mostGuesses || gameGuesses > stats.guesses.mostGuesses) {
      stats.guesses.mostGuesses = gameGuesses;
    }
  }

  return;
}

export function findUserGuessesToWinAndGiveUp(
  game: UserStatsGame,
  stats: UserStats
) {
  const guesses = game.guesses.length;

  if (game.status === 'won') {
    if (!stats.guesses.avgGuessesToWin) {
      stats.guesses.avgGuessesToWin = guesses;
    } else {
      stats.guesses.avgGuessesToWin += guesses;
    }
  } else if (game.status === 'givenUp') {
    if (!stats.guesses.avgGuessesToGiveUp) {
      stats.guesses.avgGuessesToGiveUp = guesses;
    } else {
      stats.guesses.avgGuessesToGiveUp += guesses;
    }
  }

  return;
}

export function findFirstAndLatestOfficialGuess(
  game: UserStatsGame,
  guess: GuessWithPlayerName,
  stats: UserStats
) {
  const firstName = guess.player.firstName;
  const lastName = guess.player.lastName;

  if (game.mode === 'official') {
    if (
      stats.players.firstOfficialGuess === undefined ||
      (stats.players.firstOfficialGuessTime &&
        guess.time.getTime() < stats.players.firstOfficialGuessTime.getTime())
    ) {
      stats.players.firstOfficialGuess = firstName + ' ' + lastName;
      stats.players.firstOfficialGuessTime = guess.time;
    } else if (
      stats.players.latestOfficialGuess === undefined ||
      (stats.players.latestOfficialGuessTime &&
        guess.time.getTime() > stats.players.latestOfficialGuessTime.getTime())
    ) {
      stats.players.latestOfficialGuess = firstName + ' ' + lastName;
      stats.players.latestOfficialGuessTime = guess.time;
    }
  }

  return;
}

export function countGuessedPlayers(
  guess: GuessWithPlayerName,
  mostFrequentGuesses: Record<string, number>
) {
  if (!mostFrequentGuesses) return;

  const firstName = guess.player.firstName;
  const lastName = guess.player.lastName;
  const fullName = firstName + ' ' + lastName;

  if (mostFrequentGuesses[fullName] === undefined) {
    mostFrequentGuesses[fullName] = 1;
  } else {
    mostFrequentGuesses[fullName]++;
  }

  return;
}

export function countGuessesByDay(
  guess: GuessWithPlayerName,
  guessesByDay: Record<string, number>
) {
  if (!guessesByDay) return;

  const day = guess.time.toISOString().split('T')[0];

  if (guessesByDay[day] === undefined) {
    guessesByDay[day] = 1;
  } else {
    guessesByDay[day]++;
  }

  return;
}

export function countGamesByDay(
  game: UserStatsGame | GlobalStatsGame,
  gamesByDay: GamesByDayObject
) {
  if (!gamesByDay) return;

  const day = game.endDate!.toISOString().split('T')[0];

  if (gamesByDay[day] === undefined) {
    gamesByDay[day] = {
      count: 1,
      won: 0,
      givenUp: 0,
    };
  } else {
    gamesByDay[day].count++;
  }

  if (game.status === 'won') {
    gamesByDay[day].won++;
  }

  if (game.status === 'givenUp') {
    gamesByDay[day].givenUp++;
  }

  return;
}

export function countRandomPlayers(
  game: UserStatsGame | GlobalStatsGame,
  randomPlayers: Record<string, number>
) {
  if (!randomPlayers || game.mode === 'official' || game.randomPlayer === null)
    return;

  const fullName =
    game.randomPlayer.firstName + ' ' + game.randomPlayer.lastName;

  if (randomPlayers[fullName] === undefined) {
    randomPlayers[fullName] = 1;
  } else {
    randomPlayers[fullName]++;
  }

  return;
}

export function roundToNthDecimalPlace(number: number, decimalPlaces = 1) {
  return parseFloat(number.toFixed(decimalPlaces));
}

export function transformGuessFrequency(
  guessFrequency: Record<string, number>,
  limit: number
): UserStats['guessFrequency'] {
  const array: UserStats['guessFrequency'] = [];

  for (const key in guessFrequency) {
    array.push({ fullName: key, count: guessFrequency[key] });
  }

  return array.sort((a, b) => b.count - a.count).slice(0, limit);
}

export function transformGamesByDay(
  gamesByDay: GamesByDayObject,
  limit: number
): UserStats['gamesByDay'] {
  const array: UserStats['gamesByDay'] = [];

  for (const key in gamesByDay) {
    array.push({
      date: key,
      count: gamesByDay[key].count,
      won: gamesByDay[key].won,
      givenUp: gamesByDay[key].givenUp,
    });
  }

  return array
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-limit);
}

export function transformGuessesByDay(
  guessesByDay: Record<string, number>,
  limit: number
): UserStats['guessesByDay'] {
  const array: UserStats['guessesByDay'] = [];

  for (const key in guessesByDay) {
    array.push({ date: key, count: guessesByDay[key] });
  }

  return array
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-limit);
}

export function transformRandomPlayers(
  randomPlayers: Record<string, number>,
  limit: number
): UserStats['randomPlayers'] {
  const array: UserStats['randomPlayers'] = [];

  for (const key in randomPlayers) {
    array.push({ fullName: key, count: randomPlayers[key] });
  }

  return array.sort((a, b) => b.count - a.count).slice(0, limit);
}

export function formatGameDuration(duration: number) {
  const minutes = millisecondsToMinutes(duration);
  const seconds = millisecondsToSeconds(duration) % 60;

  if (minutes > 60) return '>1 hour';

  if (duration <= 1000) return 'First try!';

  return `${minutes} min ${seconds} sec`;
}

export function countGamesForGlobalStats(
  game: UserStatsGame,
  stats: GlobalStats
) {
  if (game.mode === 'official') {
    stats.games.official.officialGamesPlayed++;

    if (game.status === 'inProgress') return;

    if (game.status === 'won') {
      stats.games.official.officialModeWins++;
    } else if (game.status === 'givenUp') {
      stats.games.official.officialModeGiveUps++;
    }

    stats.games.official.officialGamesCompleted++;
  } else if (game.mode === 'random') {
    if (game.userId) {
      stats.games.random.randomGamesPlayedUser++;

      if (game.status === 'inProgress') return;

      if (game.status === 'won') {
        stats.games.random.randomModeWinsUser++;
      } else if (game.status === 'givenUp') {
        stats.games.random.randomModeGiveUpsUser++;
      }

      stats.games.random.randomGamesCompletedUser++;
    } else {
      stats.games.random.randomGamesPlayedGuest++;

      if (game.status === 'inProgress') return;

      if (game.status === 'won') {
        stats.games.random.randomModeWinsGuest++;
      } else if (game.status === 'givenUp') {
        stats.games.random.randomModeGiveUpsGuest++;
      }

      stats.games.random.randomGamesCompletedGuest++;
    }
  }

  return;
}

export function countTotalGuesses(game: UserStatsGame, stats: GlobalStats) {
  if (game.guesses.length === 0) return;

  const guesses = game.guesses.length;

  stats.guesses.totalGuesses += guesses;

  if (game.userId) {
    stats.guesses.totalGuessesUser += guesses;
  } else {
    stats.guesses.totalGuessesGuest += guesses;
  }

  return;
}

export function findLatestGuesses(
  game: GlobalStatsGame,
  guess: GuessWithPlayerName,
  stats: GlobalStats
) {
  const firstName = guess.player.firstName;
  const lastName = guess.player.lastName;

  if (game.mode === 'official') {
    // Guesses are by games, so they need to be time-compared
    if (
      stats.players.latestOfficialGuess === undefined ||
      (stats.players.latestOfficialGuessTime &&
        guess.time.getTime() > stats.players.latestOfficialGuessTime.getTime())
    ) {
      stats.players.latestOfficialGuess = firstName + ' ' + lastName;
      stats.players.latestOfficialGuessName = game.user
        ? game.user.name
        : 'User';
      stats.players.latestOfficialGuessTime = guess.time;
    }
  } else if (game.mode === 'random') {
    if (
      stats.players.latestRandomGuess === undefined ||
      (stats.players.latestRandomGuessTime &&
        guess.time.getTime() > stats.players.latestRandomGuessTime.getTime())
    ) {
      stats.players.latestRandomGuess = firstName + ' ' + lastName;
      if (game.userId) {
        stats.players.latestRandomGuessName = game.user
          ? game.user.name
          : 'User';
      } else {
        stats.players.latestRandomGuessName = 'Guest';
      }
      stats.players.latestRandomGuessTime = guess.time;
    }
  }

  return;
}

export function findGlobalGuessesToWinAndGiveUp(
  game: GlobalStatsGame,
  stats: GlobalStats
) {
  const guesses = game.guesses.length;

  if (game.status === 'won') {
    if (!stats.guesses.avgGuessesToWin) {
      stats.guesses.avgGuessesToWin = guesses;
    } else {
      stats.guesses.avgGuessesToWin += guesses;
    }

    if (game.userId) {
      if (!stats.guesses.avgGuessesToWinUser) {
        stats.guesses.avgGuessesToWinUser = guesses;
      } else {
        stats.guesses.avgGuessesToWinUser += guesses;
      }
    } else {
      if (!stats.guesses.avgGuessesToWinGuest) {
        stats.guesses.avgGuessesToWinGuest = guesses;
      } else {
        stats.guesses.avgGuessesToWinGuest += guesses;
      }
    }
  } else if (game.status === 'givenUp') {
    if (!stats.guesses.avgGuessesToGiveUp) {
      stats.guesses.avgGuessesToGiveUp = guesses;
    } else {
      stats.guesses.avgGuessesToGiveUp += guesses;
    }

    if (game.userId) {
      if (!stats.guesses.avgGuessesToGiveUpUser) {
        stats.guesses.avgGuessesToGiveUpUser = guesses;
      } else {
        stats.guesses.avgGuessesToGiveUpUser += guesses;
      }
    } else {
      if (!stats.guesses.avgGuessesToGiveUpGuest) {
        stats.guesses.avgGuessesToGiveUpGuest = guesses;
      } else {
        stats.guesses.avgGuessesToGiveUpGuest += guesses;
      }
    }
  }

  return;
}

export function transformChartData(
  stats: UserStats | GlobalStats,
  guessFrequency: Record<string, number>,
  gamesByDay: GamesByDayObject,
  guessesByDay: Record<string, number>,
  randomPlayers: Record<string, number>
) {
  stats.guessFrequency = transformGuessFrequency(guessFrequency, 30);
  stats.gamesByDay = transformGamesByDay(gamesByDay, 30);
  stats.guessesByDay = transformGuessesByDay(guessesByDay, 30);
  stats.randomPlayers = transformRandomPlayers(randomPlayers, 30);
}

export function calculateOtherStatsUser(
  stats: UserStats,
  games: UserStatsGame[],
  scheduledPlayersCount: number
) {
  const avgGuesses = stats.guesses.totalGuesses / games.length;
  stats.guesses.avgGuesses = roundToNthDecimalPlace(avgGuesses);

  if (stats.guesses.avgGuessesToWin) {
    const avgGuessesToWin =
      stats.guesses.avgGuessesToWin /
      (stats.games.official.officialModeWins +
        stats.games.random.randomModeWins);
    stats.guesses.avgGuessesToWin = roundToNthDecimalPlace(avgGuessesToWin);
  }

  if (stats.guesses.avgGuessesToGiveUp) {
    const avgGuessesToGiveUp =
      stats.guesses.avgGuessesToGiveUp /
      (stats.games.official.officialModeGiveUps +
        stats.games.random.randomModeGiveUps);
    stats.guesses.avgGuessesToGiveUp =
      roundToNthDecimalPlace(avgGuessesToGiveUp);
  }

  if (stats.games.official.officialGamesPlayed > 0) {
    const officialGamesPlayedPercentage =
      (stats.games.official.officialGamesPlayed / scheduledPlayersCount) * 100;
    stats.games.official.officialGamesPlayedPercentage = roundToNthDecimalPlace(
      officialGamesPlayedPercentage
    );
  }

  if (stats.games.official.officialGamesCompleted > 0) {
    const officialGamesCompletedPercentage =
      (stats.games.official.officialGamesCompleted / scheduledPlayersCount) *
      100;
    stats.games.official.officialGamesCompletedPercentage =
      roundToNthDecimalPlace(officialGamesCompletedPercentage);
  }

  if (stats.games.official.officialModeWins > 0) {
    const officialModeWinsPercentage =
      (stats.games.official.officialModeWins / scheduledPlayersCount) * 100;
    stats.games.official.officialModeWinsPercentage = roundToNthDecimalPlace(
      officialModeWinsPercentage
    );
  }

  if (stats.games.official.officialModeGiveUps > 0) {
    const officialModeGiveUpsPercentage =
      (stats.games.official.officialModeGiveUps / scheduledPlayersCount) * 100;
    stats.games.official.officialModeGiveUpsPercentage = roundToNthDecimalPlace(
      officialModeGiveUpsPercentage
    );
  }

  if (stats.games.random.randomModeWins > 0) {
    const randomModeWinsPercentage =
      (stats.games.random.randomModeWins /
        stats.games.random.randomGamesPlayed) *
      100;
    stats.games.random.randomModeWinsPercentage = roundToNthDecimalPlace(
      randomModeWinsPercentage
    );
  }

  if (stats.games.random.randomModeGiveUps > 0) {
    const randomModeGiveUpsPercentage =
      (stats.games.random.randomModeGiveUps /
        stats.games.random.randomGamesPlayed) *
      100;
    stats.games.random.randomModeGiveUpsPercentage = roundToNthDecimalPlace(
      randomModeGiveUpsPercentage
    );
  }
}

export function calculateOtherStatsGlobal(
  stats: GlobalStats,
  games: GlobalStatsGame[]
) {
  const avgGuesses = stats.guesses.totalGuesses / games.length;
  stats.guesses.avgGuesses = roundToNthDecimalPlace(avgGuesses);

  if (stats.guesses.totalGuessesUser) {
    const avgGuessesUser =
      stats.guesses.totalGuessesUser /
      (stats.games.official.officialGamesPlayed +
        stats.games.random.randomGamesPlayedUser);
    stats.guesses.avgGuessesUser = roundToNthDecimalPlace(avgGuessesUser);
  }

  if (stats.guesses.totalGuessesGuest) {
    const avgGuessesGuest =
      stats.guesses.totalGuessesGuest /
      stats.games.random.randomGamesPlayedGuest;
    stats.guesses.avgGuessesGuest = roundToNthDecimalPlace(avgGuessesGuest);
  }

  if (stats.guesses.avgGuessesToWin) {
    const avgGuessesToWin =
      stats.guesses.avgGuessesToWin /
      (stats.games.official.officialModeWins +
        stats.games.random.randomModeWinsUser +
        stats.games.random.randomModeWinsGuest);
    stats.guesses.avgGuessesToWin = roundToNthDecimalPlace(avgGuessesToWin);
  }

  if (stats.guesses.avgGuessesToWinUser) {
    const avgGuessesToWinUser =
      stats.guesses.avgGuessesToWinUser /
      (stats.games.official.officialModeWins +
        stats.games.random.randomModeWinsUser);
    stats.guesses.avgGuessesToWinUser =
      roundToNthDecimalPlace(avgGuessesToWinUser);
  }

  if (stats.guesses.avgGuessesToWinGuest) {
    const avgGuessesToWinGuest =
      stats.guesses.avgGuessesToWinGuest /
      stats.games.random.randomModeWinsGuest;
    stats.guesses.avgGuessesToWinGuest =
      roundToNthDecimalPlace(avgGuessesToWinGuest);
  }

  if (stats.guesses.avgGuessesToGiveUp) {
    const avgGuessesToGiveUp =
      stats.guesses.avgGuessesToGiveUp /
      (stats.games.official.officialModeGiveUps +
        stats.games.random.randomModeGiveUpsUser +
        stats.games.random.randomModeGiveUpsGuest);
    stats.guesses.avgGuessesToGiveUp =
      roundToNthDecimalPlace(avgGuessesToGiveUp);
  }

  if (stats.guesses.avgGuessesToGiveUpUser) {
    const avgGuessesToGiveUpUser =
      stats.guesses.avgGuessesToGiveUpUser /
      (stats.games.official.officialModeGiveUps +
        stats.games.random.randomModeGiveUpsUser);
    stats.guesses.avgGuessesToGiveUpUser = roundToNthDecimalPlace(
      avgGuessesToGiveUpUser
    );
  }

  if (stats.guesses.avgGuessesToGiveUpGuest) {
    const avgGuessesToGiveUpGuest =
      stats.guesses.avgGuessesToGiveUpGuest /
      stats.games.random.randomModeGiveUpsGuest;
    stats.guesses.avgGuessesToGiveUpGuest = roundToNthDecimalPlace(
      avgGuessesToGiveUpGuest
    );
  }

  stats.games.random.randomGamesPlayed =
    stats.games.random.randomGamesPlayedUser +
    stats.games.random.randomGamesPlayedGuest;
  stats.games.random.randomGamesCompleted =
    stats.games.random.randomGamesCompletedUser +
    stats.games.random.randomGamesCompletedGuest;
  stats.games.random.randomModeWins =
    stats.games.random.randomModeWinsUser +
    stats.games.random.randomModeWinsGuest;
  stats.games.random.randomModeGiveUps =
    stats.games.random.randomModeGiveUpsUser +
    stats.games.random.randomModeGiveUpsGuest;
}

export function countPlayersBy(
  player: DatabaseStatsPlayer,
  entryObject: Record<string, number>,
  type: DatabaseStatsType
) {
  if (!entryObject) return;

  let field: string | number | null;

  switch (type) {
    case 'gender':
      field = player.gender;
      break;
    case 'age':
      // Count only active darts players by age
      field =
        player.dateOfBirth && player.status === 'active'
          ? getAge(player.dateOfBirth)
          : null;
      break;
    case 'birthMonth':
      field = player.dateOfBirth ? getMonth(player.dateOfBirth) : null;
      break;
    case 'birthDate':
      field = player.dateOfBirth ? getDate(player.dateOfBirth) : null;
      break;
    case 'birthDay':
      field = player.dateOfBirth ? getDay(player.dateOfBirth) : null;
      break;
    case 'country':
      field = player.country;
      break;
    case 'playingSince':
      field = player.playingSince ? player.playingSince : null;
      break;
    case 'laterality':
      field = player.laterality;
      break;
    case 'dartsBrand':
      field = player.dartsBrand ? player.dartsBrand : null;
      break;
    case 'dartsWeight':
      field = player.dartsWeight ? parseFloat(player.dartsWeight) : null;
      break;
    case 'nineDartersPDC':
      field = player.nineDartersPDC;
      break;
    case 'bestResultPDC':
      field = player.bestResultPDC ? player.bestResultPDC : 'Did not play';
      break;
    case 'bestResultWDF':
      field = player.bestResultWDF ? player.bestResultWDF : 'Did not play';
      break;
    case 'bestResultUKOpen':
      field = player.bestResultUKOpen
        ? player.bestResultUKOpen
        : 'Did not play';
      break;
    case 'yearOfBestResultPDC':
      field = player.yearOfBestResultPDC ? player.yearOfBestResultPDC : null;
      break;
    case 'yearOfBestResultWDF':
      field = player.yearOfBestResultWDF ? player.yearOfBestResultWDF : null;
      break;
    case 'yearOfBestResultUKOpen':
      field = player.yearOfBestResultUKOpen
        ? player.yearOfBestResultUKOpen
        : null;
      break;
    case 'difficulty':
      field = player.difficulty;
      break;
  }

  if (field === null) return;

  if (entryObject[field] === undefined) {
    entryObject[field] = 1;
  } else {
    entryObject[field]++;
  }

  return;
}

export function transformPlayerStats(
  stats: DatabaseStats,
  playerObject: DatabaseStatsObject,
  players: DatabaseStatsPlayer[]
) {
  let key: keyof DatabaseStatsObject;

  for (key in playerObject) {
    for (const stat in playerObject[key]) {
      const percentage = roundToNthDecimalPlace(
        (playerObject[key][stat] / players.length) * 100,
        2
      );
      stats[key].push({
        value: stat,
        count: playerObject[key][stat],
        percentage,
      });
    }
  }
}

export function sortPlayerStats(stats: DatabaseStats) {
  let key: keyof DatabaseStats;

  for (key in stats) {
    switch (key) {
      case 'age':
      case 'birthMonth':
      case 'birthDate':
      case 'playingSince':
      case 'dartsWeight':
      case 'nineDartersPDC':
      case 'yearOfBestResultPDC':
      case 'yearOfBestResultWDF':
      case 'yearOfBestResultUKOpen':
      case 'birthDay':
        // Sort values in the ascending order
        stats[key].sort((a, b) => parseFloat(a.value) - parseFloat(b.value));
        // Move Sunday to the end
        if (key === 'birthDay') {
          if (stats[key][0].value === '0') {
            const sunday = stats[key].shift();
            stats[key].push(sunday!);
          }
        }
        break;
      case 'gender': {
        // Sort gender from male to female
        stats[key].sort((a, b) => {
          const dayMap = new Map<string, number>();
          dayMap.set('male', 1);
          dayMap.set('female', 2);

          const aValue = dayMap.get(a.value);
          const bValue = dayMap.get(b.value);

          if (!aValue || !bValue) {
            return b.count - a.count;
          }

          return aValue - bValue;
        });
        break;
      }
      case 'laterality': {
        // Sort laterality from right-handed to left-handed
        stats[key].sort((a, b) => {
          const dayMap = new Map<string, number>();
          dayMap.set('right-handed', 1);
          dayMap.set('left-handed', 2);

          const aValue = dayMap.get(a.value);
          const bValue = dayMap.get(b.value);

          if (!aValue || !bValue) {
            return b.count - a.count;
          }

          return aValue - bValue;
        });
        break;
      }
      case 'difficulty': {
        // Sort difficulty from easy to very hard
        stats[key].sort((a, b) => {
          const dayMap = new Map<string, number>();
          dayMap.set('easy', 1);
          dayMap.set('medium', 2);
          dayMap.set('hard', 3);
          dayMap.set('very hard', 4);

          const aValue = dayMap.get(a.value);
          const bValue = dayMap.get(b.value);

          if (!aValue || !bValue) {
            return b.count - a.count;
          }

          return aValue - bValue;
        });
        break;
      }
      case 'bestResultPDC': {
        // Sort best PDC WC result from best to worst
        stats[key].sort((a, b) => {
          const aResult = bestResultPDCMap.get(a.value as BestResultColumnType);
          const bResult = bestResultPDCMap.get(b.value as BestResultColumnType);

          if (!aResult && !bResult) return 0;
          if (!aResult) return 1;
          if (!bResult) return -1;

          return aResult - bResult;
        });
        break;
      }
      case 'bestResultWDF': {
        // Sort best WDF WC result from best to worst
        stats[key].sort((a, b) => {
          const aResult = bestResultWDFMap.get(a.value as BestResultColumnType);
          const bResult = bestResultWDFMap.get(b.value as BestResultColumnType);

          if (!aResult && !bResult) return 0;
          if (!aResult) return 1;
          if (!bResult) return -1;

          return aResult - bResult;
        });
        break;
      }
      case 'bestResultUKOpen': {
        // Sort best UK Open result from best to worst
        stats[key].sort((a, b) => {
          const aResult = bestResultUKOpenMap.get(
            a.value as BestResultColumnType
          );
          const bResult = bestResultUKOpenMap.get(
            b.value as BestResultColumnType
          );

          if (!aResult && !bResult) return 0;
          if (!aResult) return 1;
          if (!bResult) return -1;

          return aResult - bResult;
        });
        break;
      }
      default:
        // Sort count in the descending order
        stats[key].sort((a, b) => b.count - a.count);
        break;
    }
  }
}

// Make sure all names are spelled according to what's in the DB
export function handleDifferentSpellings(fullName: string) {
  switch (fullName) {
    case 'Dominik Gruellich':
      return 'Dominik Grüllich';
    case 'Christian Goedl':
      return 'Christian Gödl';
    case 'Patrick Klingelhoefer':
      return 'Patrick Klingelhöfer';
    case 'Kai-Fan Leung':
      return 'Kai Fan Leung';
    case 'Rob Owen':
      return 'Robert Owen';
    case 'Joanne Locke':
      return 'Jo Locke';
    case 'Cameron Crabtree':
      return 'Cam Crabtree';
    case 'Stefanie Lueck':
      return 'Stefanie Lück';
    case 'Steffi Lueck':
      return 'Stefanie Lück';
    case 'Steffi Luck':
      return 'Stefanie Lück';
    case 'Steffi Lück':
      return 'Stefanie Lück';
    case 'Maria Carli-Mason':
      return 'Maria Carli';
    case 'Taylor Marsh-Kahaki':
      return 'Taylor-Marsh Kahaki';
    case 'Sharon Boxem-Prins':
      return 'Sharon Prins';
    case 'Karin van Leeuwen-Krappen':
      return 'Karin Krappen';
    case 'Rilana Honsbeek':
      return 'Rilana Honsbeek-Erades';
    case 'Rilana Erades':
      return 'Rilana Honsbeek-Erades';
    case 'Linda Ithurralde':
      return 'Linda Hindmarch-Ithurralde';
    case 'Linda Hindmarch':
      return 'Linda Hindmarch-Ithurralde';
    case 'Danny Lauby II':
      return 'Danny Lauby';
    case 'Thomas Sykes':
      return 'Tom Sykes';
  }

  return fullName;
}

export function getMidnightUTC() {
  const year = new Date().getFullYear();
  const month = new Date().getMonth();
  const day = new Date().getDate();

  const midnightUTC = new Date(Date.UTC(year, month, day, 0, 0, 0));

  return midnightUTC;
}

export function getPlayerCondition(type: UpdateRankingsType) {
  let playerCondition;

  if (type === 'menPDC' || type === 'menWDF') {
    playerCondition = eq(player.gender, 'male');
  } else if (type === 'womenPDC' || type === 'womenWDF') {
    playerCondition = eq(player.gender, 'female');
  } else {
    playerCondition = undefined;
  }

  return playerCondition;
}

export function getRankingType(type: UpdateRankingsType) {
  let rankingType: 'rankingPDC' | 'rankingWDF' | 'rankingElo';

  if (type === 'menPDC' || type === 'womenPDC') {
    rankingType = 'rankingPDC';
  } else if (type === 'menWDF' || type === 'womenWDF') {
    rankingType = 'rankingWDF';
  } else {
    rankingType = 'rankingElo';
  }

  return rankingType;
}

export function getUpdateMessage(type: UpdateRankingsType) {
  switch (type) {
    case 'menPDC':
      return 'PDC rankings for men';
    case 'womenPDC':
      return 'PDC rankings for women';
    case 'menWDF':
      return 'WDF rankings for men';
    case 'womenWDF':
      return 'WDF rankings for women';
    case 'elo':
      return 'Elo rankings';
  }
}
