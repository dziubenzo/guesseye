import type {
  BestResultColumnType,
  ComparisonResults,
  Guess,
  MatchKeys,
  Player,
  PlayerToFindMatches,
  RangedMatchKeys,
  SpecialRangedMatchKeys,
} from '@/lib/types';
import type { GuessSchemaType } from '@/lib/zod/guess';
import { player } from '@/server/db/schema';
import assert, { AssertionError } from 'assert';
import { clsx, type ClassValue } from 'clsx';
import { differenceInYears } from 'date-fns';
import { getTableColumns } from 'drizzle-orm';
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

export function formatPrizeMoney(prizeMoney: number) {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    trailingZeroDisplay: 'stripIfInteger',
  }).format(prizeMoney * 1000);
}

export function normaliseGuess(guess: string) {
  return guess
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replaceAll('ł', 'l')
    .split(' ');
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
      case 'playedInWDF':
      case 'active':
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
      case 'organisation':
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
      case 'prizeMoney':
      case 'rankingPDC':
      case 'rankingWDF':
      case 'yearOfBestResultPDC':
      case 'yearOfBestResultWDF':
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
        case 'playedInWDF':
        case 'active':
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
        case 'organisation':
          currentMatches[key] = playerToFind[key];
          break;
      }
    }
  }

  function compareRangedMatch(key: RangedMatchKeys) {
    if (
      (!guessedPlayer[key] && !playerToFind[key]) ||
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
        case 'prizeMoney':
        case 'rankingPDC':
        case 'rankingWDF':
        case 'yearOfBestResultPDC':
        case 'yearOfBestResultWDF':
          currentMatches[key] = {
            type: 'match',
            value: playerToFind[key],
          };
          break;
      }
    } else if (!guessedPlayer[key] || !playerToFind[key]) {
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
    if (!guessedPlayer[key] || !playerToFind[key]) return;

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
      (!guessedPlayer[key] && !playerToFind[key]) ||
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
    } else if (!guessedPlayer[key] || !playerToFind[key]) {
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
      case 'organisation':
      case 'tourCard':
      case 'playedInWCOD':
      case 'playedInWDF':
      case 'active':
        compareMatch(key);
        break;
      // Ranged match cases
      case 'playingSince':
      case 'rankingPDC':
      case 'rankingWDF':
      case 'prizeMoney':
      case 'nineDartersPDC':
      case 'yearOfBestResultPDC':
      case 'yearOfBestResultWDF':
        compareRangedMatch(key);
        break;
      // Special ranged match cases
      case 'dateOfBirth':
      case 'dartsWeight':
      case 'bestResultPDC':
      case 'bestResultWDF':
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
    const splitGuess = guess.toLowerCase().split(' ');
    const firstName = prevGuess.guessedPlayer.firstName.toLowerCase();
    const lastName = prevGuess.guessedPlayer.lastName.toLowerCase();
    if (splitGuess.length === 1) {
      return (
        firstName.includes(splitGuess[0]) || lastName.includes(splitGuess[0])
      );
    }
    return (
      firstName.includes(splitGuess[0]) && lastName.includes(splitGuess[1])
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

export function isScheduleIdValid(scheduleId?: string) {
  const isPositiveInteger =
    Number.isInteger(Number(scheduleId)) && Number(scheduleId) > 0;

  return !isPositiveInteger ? false : true;
}
