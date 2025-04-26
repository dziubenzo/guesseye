import {
  BestResultColumnType,
  ComparisonResult,
  Player,
  PlayerToFindMatches,
} from '@/lib/types';
import { player } from '@/server/db/schema';
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
    .replaceAll('ł', 'l');
}

export function checkIfGuessCorrect(
  guessedPlayer: Player,
  playerToFind: Player
) {
  let isGuessCorrect = true;
  let key: keyof Player;

  for (key in guessedPlayer) {
    if (guessedPlayer[key] !== playerToFind[key]) {
      isGuessCorrect = false;
      break;
    }
  }

  return isGuessCorrect;
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

export function comparePlayers(guessedPlayer: Player, playerToFind: Player) {
  const comparisonResult = {} as ComparisonResult;
  const playerToFindMatches = {} as PlayerToFindMatches;
  let key: keyof Player;

  for (key in guessedPlayer) {
    if (
      key === 'id' ||
      key === 'createdAt' ||
      key === 'updatedAt' ||
      key === 'difficulty'
    ) {
      continue;
    }

    if (
      (!guessedPlayer[key] && !playerToFind[key]) ||
      guessedPlayer[key] === playerToFind[key]
    ) {
      comparisonResult[key] = 'match';
      // @ts-expect-error: key is the same, the never type should never happen
      playerToFindMatches[key] = playerToFind[key];
      continue;
    }
    if (!guessedPlayer[key] || !playerToFind[key]) {
      comparisonResult[key] = 'noMatch';
      continue;
    }

    if (
      key === 'firstName' ||
      key === 'lastName' ||
      key === 'gender' ||
      key === 'country' ||
      key === 'dartsBrand' ||
      key === 'laterality' ||
      key === 'organisation' ||
      key === 'tourCard' ||
      key === 'playedInWCOD' ||
      key === 'playedInWDF' ||
      key === 'active'
    ) {
      if (guessedPlayer[key] !== playerToFind[key]) {
        comparisonResult[key] = 'noMatch';
      } else if (guessedPlayer[key] === playerToFind[key]) {
        comparisonResult[key] = 'match';
        // @ts-expect-error: key is the same, the never type should never happen
        playerToFindMatches[key] = playerToFind[key];
      }
      continue;
    }

    // Revert higher/lower logic for ranking positions
    if (key === 'rankingPDC' || key === 'rankingWDF') {
      if (guessedPlayer[key]! < playerToFind[key]!) {
        comparisonResult[key] = 'lower';
      } else if (guessedPlayer[key]! > playerToFind[key]!) {
        comparisonResult[key] = 'higher';
      }
      continue;
    }

    if (
      key === 'nineDartersPDC' ||
      key === 'playingSince' ||
      key === 'prizeMoney' ||
      key === 'yearOfBestResultPDC' ||
      key === 'yearOfBestResultWDF'
    ) {
      if (guessedPlayer[key]! > playerToFind[key]!) {
        comparisonResult[key] = 'lower';
      } else if (guessedPlayer[key]! < playerToFind[key]!) {
        comparisonResult[key] = 'higher';
      }
      continue;
    }

    switch (key) {
      case 'dateOfBirth':
        const guessedPlayerAge = getAge(guessedPlayer[key]!);
        const playerToFindAge = getAge(playerToFind[key]!);
        if (guessedPlayerAge > playerToFindAge) {
          comparisonResult[key] = 'lower';
        } else if (guessedPlayerAge < playerToFindAge) {
          comparisonResult[key] = 'higher';
        } else {
          comparisonResult[key] = 'match';
          playerToFindMatches[key] = playerToFind[key];
        }
        continue;
      case 'dartsWeight':
        const guessedPlayerDartsWeight = parseInt(guessedPlayer[key]!);
        const playerToFindDartsWeight = parseInt(playerToFind[key]!);
        if (guessedPlayerDartsWeight > playerToFindDartsWeight) {
          comparisonResult[key] = 'lower';
        } else if (guessedPlayerDartsWeight < playerToFindDartsWeight) {
          comparisonResult[key] = 'higher';
        } else {
          comparisonResult[key] = 'match';
          playerToFindMatches[key] = playerToFind[key];
        }
        continue;
      case 'bestResultPDC':
        const guessedPlayerResultPDC = bestResultPDCMap.get(
          guessedPlayer[key]!
        );
        const playerToFindResultPDC = bestResultPDCMap.get(playerToFind[key]!);
        if (guessedPlayerResultPDC! < playerToFindResultPDC!) {
          comparisonResult[key] = 'lower';
        } else if (guessedPlayerResultPDC! > playerToFindResultPDC!) {
          comparisonResult[key] = 'higher';
        } else {
          comparisonResult[key] = 'match';
          playerToFindMatches[key] = playerToFind[key];
        }
        continue;
      case 'bestResultWDF':
        const guessedPlayerResultWDF = bestResultWDFMap.get(
          guessedPlayer[key]!
        );
        const playerToFindResultWDF = bestResultWDFMap.get(playerToFind[key]!);
        if (guessedPlayerResultWDF! < playerToFindResultWDF!) {
          comparisonResult[key] = 'lower';
        } else if (guessedPlayerResultWDF! > playerToFindResultWDF!) {
          comparisonResult[key] = 'higher';
        } else {
          comparisonResult[key] = 'match';
          playerToFindMatches[key] = playerToFind[key];
        }
        continue;
    }
  }

  return { comparisonResult, playerToFindMatches };
}
