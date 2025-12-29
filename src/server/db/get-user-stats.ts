'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, GamesByDayObject, UserStats } from '@/lib/types';
import {
  calculateOtherStatsUser,
  countGamesByDay,
  countGamesForUserStats,
  countGuessedPlayers,
  countGuessesByDay,
  countHintsRevealed,
  countRandomPlayers,
  findFastestWin,
  findFewestAndMostGuesses,
  findFirstAndLatestOfficialGuess as findFirstAndLatestGuesses,
  findFirstAndLatestOfficialWin,
  findSlowestWin,
  findUserGuessesToWinAndGiveUp,
  transformChartData,
} from '@/lib/utils';
import { db } from '@/server/db/index';
import { game, guess, hint, schedule } from '@/server/db/schema';
import { asc, eq, lt, sql } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getUserStats = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  // Get all games played by logged-in user (ordered by start date in the ascending order) and guesses (ordered by id in the ascending order) with the guessed player name as well as the first and last name of the random player if it exists
  // Get the count of official games up to now
  // Get counts of all approved hints by darts player
  const [games, scheduledPlayersCount, hintsCounts] = await Promise.all([
    db.query.game.findMany({
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
        scheduledPlayer: {
          columns: {
            playerToFindId: true,
          },
        },
        randomPlayer: {
          columns: { firstName: true, lastName: true },
        },
      },
      orderBy: asc(game.startDate),
      where: eq(game.userId, session.user.id),
    }),
    db.$count(schedule, lt(schedule.startDate, new Date())),
    db
      .select({
        playerId: hint.playerId,
        hintsCount: sql<number>`cast(count(${hint.playerId}) as int)`,
      })
      .from(hint)
      .where(eq(hint.isApproved, true))
      .groupBy(hint.playerId),
  ]);

  if (scheduledPlayersCount === 0) {
    const error: ErrorObject = { error: 'No official games scheduled.' };
    return error;
  }

  const stats: UserStats = {
    guesses: {
      fewestGuesses: undefined,
      mostGuesses: undefined,
      avgGuesses: undefined, // totalGuesses divided by userData.games.length
      avgGuessesToWin: undefined, // divided by officialModeWins + randomModeWins
      avgGuessesToGiveUp: undefined, // divided by officialModeGiveUps + randomModeGiveUps
      totalGuesses: 0,
    },
    games: {
      official: {
        officialGamesPlayed: 0,
        officialGamesPlayedPercentage: 0, // divided by scheduledPlayersCount
        officialGamesCompleted: 0,
        officialGamesCompletedPercentage: 0, // divided by scheduledPlayersCount
        officialModeWins: 0,
        officialModeWinsPercentage: 0, // divided by scheduledPlayersCount
        officialModeGiveUps: 0,
        officialModeGiveUpsPercentage: 0, // divided by scheduledPlayersCount
        officialModeHintsRevealed: 0,
        officialModeHintsRevealedPercentage: 0, // officialModeHintsRevealed divided by itself
      },
      random: {
        randomGamesPlayed: 0,
        randomModeWins: 0,
        randomModeWinsPercentage: 0, // divided by randomGamesPlayed
        randomModeGiveUps: 0,
        randomModeGiveUpsPercentage: 0, // divided by randomGamesPlayed
        randomModeHintsRevealed: 0,
        randomModeHintsRevealedPercentage: 0, // randomModeHintsRevealed divided by itself
      },
      duration: {
        fastestWin: undefined,
        slowestWin: undefined,
      },
    },
    players: {
      firstOfficialGuess: undefined,
      firstOfficialGuessTime: undefined,
      latestOfficialGuess: undefined,
      latestOfficialGuessTime: undefined,
      firstOfficialWin: undefined,
      firstOfficialWinTime: undefined,
      latestOfficialWin: undefined,
      latestOfficialWinTime: undefined,
      firstRandomGuess: undefined,
      firstRandomGuessTime: undefined,
      latestRandomGuess: undefined,
      latestRandomGuessTime: undefined,
    },
    guessFrequency: [],
    gamesByDay: [],
    guessesByDay: [],
    randomPlayers: [],
  };

  if (games.length === 0) return stats;

  const guessFrequency: Record<string, number> = {};
  const gamesByDay: GamesByDayObject = {};
  const guessesByDay: Record<string, number> = {};
  const randomPlayers: Record<string, number> = {};

  // Create a playerId to hintsCount map
  const hintsCountsMap = new Map<number, number>();

  for (const entry of hintsCounts) {
    hintsCountsMap.set(entry.playerId, entry.hintsCount);
  }

  // Calculate stats based on every game and guess
  games.forEach((game) => {
    stats.guesses.totalGuesses += game.guesses.length;
    countGamesForUserStats(game, stats);
    countHintsRevealed(game, hintsCountsMap, stats);
    findFirstAndLatestOfficialWin(game, stats);
    findFewestAndMostGuesses(game, stats);
    findUserGuessesToWinAndGiveUp(game, stats);

    if (game.status !== 'inProgress') {
      if (game.status === 'won') {
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
      countRandomPlayers(game, randomPlayers);
    }

    if (game.guesses.length > 0) {
      game.guesses.forEach((guess) => {
        findFirstAndLatestGuesses(game, guess, stats);
        countGuessedPlayers(guess, guessFrequency);
        countGuessesByDay(guess, guessesByDay);
      });
    }
  });

  calculateOtherStatsUser(stats, games, scheduledPlayersCount);

  transformChartData(
    stats,
    guessFrequency,
    gamesByDay,
    guessesByDay,
    randomPlayers
  );

  return stats;
};
