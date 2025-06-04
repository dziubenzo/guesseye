'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, UserStats } from '@/lib/types';
import {
  countGamesByDay,
  countGamesForStats,
  countGuessedPlayers,
  countGuessesByDay,
  findFastestWin,
  findFewestAndMostGuesses,
  findFirstAndLatestOfficialGuess,
  findFirstAndLatestOfficialWin,
  findGuessesToWinAndGiveUp,
  findSlowestWin,
  roundToNthDecimalPlace,
  transformGamesByDay,
  transformGuessesByDay,
  transformGuessFrequency,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { game, guess, schedule, user } from '@/server/db/schema';
import { asc, eq, lt } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getStats = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  // Get logged-in user with their games (ordered by start date in the ascending order) and guesses (ordered in the ascending order) with guessed player
  // Get the count of official games up to now
  const [userData, scheduledPlayersCount] = await Promise.all([
    db.query.user.findFirst({
      columns: { name: true },
      with: {
        games: {
          with: {
            guesses: {
              with: {
                player: {
                  columns: {
                    firstName: true,
                    lastName: true,
                  },
                },
              },
              orderBy: asc(guess.id),
            },
          },
          orderBy: asc(game.startDate),
        },
      },
      where: eq(user.id, session.user.id),
    }),
    db.$count(schedule, lt(schedule.startDate, new Date())),
  ]);

  if (!userData) {
    const error: ErrorObject = { error: 'No user found.' };
    return error;
  }

  if (scheduledPlayersCount === 0) {
    const error: ErrorObject = { error: 'No official games scheduled.' };
    return error;
  }

  const stats: UserStats = {
    username: userData.name,
    guesses: {
      fewestGuesses: undefined,
      mostGuesses: undefined,
      avgGuesses: undefined, // totalGuesses divided by userData.games.length
      avgGuessesToWin: undefined, // divided by officialModeWins + randomModeWins
      avgGuessesToGiveUp: undefined, // divided by officialModeGiveUps + randomModeGiveUps
      totalGuesses: 0,
    },
    games: {
      officialGamesPlayed: 0,
      officialGamesPlayedPercentage: 0, // divided by scheduledPlayersCount
      officialGamesCompleted: 0,
      officialGamesCompletedPercentage: 0, // divided by scheduledPlayersCount
      officialModeWins: 0,
      officialModeWinsPercentage: 0, // divided by scheduledPlayersCount
      officialModeGiveUps: 0,
      officialModeGiveUpsPercentage: 0, // divided by scheduledPlayersCount
      randomGamesPlayed: 0,
      randomModeWins: 0,
      randomModeWinsPercentage: 0, // divided by randomGamesPlayed
      randomModeGiveUps: 0,
      randomModeGiveUpsPercentage: 0, // divided by randomGamesPlayed
      duration: {
        fastestWin: undefined,
        slowestWin: undefined,
      },
    },
    players: {
      firstOfficialGuess: undefined,
      latestOfficialGuess: undefined,
      firstOfficialWin: undefined,
      latestOfficialWin: undefined,
    },
    guessFrequency: [],
    gamesByDay: [],
    guessesByDay: [],
  };

  if (userData.games.length === 0) return stats;

  const guessFrequency: Record<string, number> = {};
  const gamesByDay: Record<string, number> = {};
  const guessesByDay: Record<string, number> = {};

  // Calculate stats based on every game and guess
  userData.games.forEach((game) => {
    stats.guesses.totalGuesses += game.guesses.length;
    countGamesForStats(game, stats);
    findFirstAndLatestOfficialWin(game, stats);
    findFewestAndMostGuesses(game, stats);
    findGuessesToWinAndGiveUp(game, stats);
    if (game.hasWon || game.hasGivenUp) {
      if (game.hasWon) {
        stats.games.duration.fastestWin = findFastestWin(
          game,
          stats.games.duration.fastestWin
        );
        stats.games.duration.slowestWin = findSlowestWin(
          game,
          stats.games.duration.slowestWin
        );
      }
      countGamesByDay(game, gamesByDay);
    }

    if (game.guesses.length > 0) {
      game.guesses.forEach((guess) => {
        findFirstAndLatestOfficialGuess(game, guess, stats);
        countGuessedPlayers(guess, guessFrequency);
        countGuessesByDay(guess, guessesByDay);
      });
    }
  });

  // Calculate the remaining stats (percentages and averages)
  const avgGuesses = stats.guesses.totalGuesses / userData.games.length;
  stats.guesses.avgGuesses = roundToNthDecimalPlace(avgGuesses);

  if (stats.guesses.avgGuessesToWin) {
    const avgGuessesToWin =
      stats.guesses.avgGuessesToWin /
      (stats.games.officialModeWins + stats.games.randomModeWins);
    stats.guesses.avgGuessesToWin = roundToNthDecimalPlace(avgGuessesToWin);
  }

  if (stats.guesses.avgGuessesToGiveUp) {
    const avgGuessesToGiveUp =
      stats.guesses.avgGuessesToGiveUp /
      (stats.games.officialModeGiveUps + stats.games.randomModeGiveUps);
    stats.guesses.avgGuessesToGiveUp =
      roundToNthDecimalPlace(avgGuessesToGiveUp);
  }

  if (stats.games.officialGamesPlayed > 0) {
    const officialGamesPlayedPercentage =
      (stats.games.officialGamesPlayed / scheduledPlayersCount) * 100;
    stats.games.officialGamesPlayedPercentage = roundToNthDecimalPlace(
      officialGamesPlayedPercentage
    );
  }

  if (stats.games.officialGamesCompleted > 0) {
    const officialGamesCompletedPercentage =
      (stats.games.officialGamesCompleted / scheduledPlayersCount) * 100;
    stats.games.officialGamesCompletedPercentage = roundToNthDecimalPlace(
      officialGamesCompletedPercentage
    );
  }

  if (stats.games.officialModeWins > 0) {
    const officialModeWinsPercentage =
      (stats.games.officialModeWins / scheduledPlayersCount) * 100;
    stats.games.officialModeWinsPercentage = roundToNthDecimalPlace(
      officialModeWinsPercentage
    );
  }

  if (stats.games.officialModeGiveUps > 0) {
    const officialModeGiveUpsPercentage =
      (stats.games.officialModeGiveUps / scheduledPlayersCount) * 100;
    stats.games.officialModeGiveUpsPercentage = roundToNthDecimalPlace(
      officialModeGiveUpsPercentage
    );
  }

  if (stats.games.randomGamesPlayed > 0) {
    const randomModeWinsPercentage =
      (stats.games.randomGamesPlayed / stats.games.randomModeWins) * 100;
    stats.games.randomModeWinsPercentage = roundToNthDecimalPlace(
      randomModeWinsPercentage
    );

    const randomModeGiveUpsPercentage =
      (stats.games.randomGamesPlayed / stats.games.randomModeGiveUps) * 100;
    stats.games.randomModeGiveUpsPercentage = roundToNthDecimalPlace(
      randomModeGiveUpsPercentage
    );
  }

  stats.guessFrequency = transformGuessFrequency(guessFrequency, 90);
  stats.gamesByDay = transformGamesByDay(gamesByDay, 90);
  stats.guessesByDay = transformGuessesByDay(guessesByDay, 90);

  return stats;
};
