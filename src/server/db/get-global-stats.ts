'use server';

import { auth } from '@/lib/auth';
import type { ErrorObject, GamesByDayObject, GlobalStats } from '@/lib/types';
import {
  calculateOtherStatsGlobal,
  countGamesByDay,
  countGamesForGlobalStats,
  countGuessedPlayers,
  countGuessesByDay,
  countHintsRevealedForGlobalStats,
  countRandomPlayers,
  countTotalGuesses,
  findFewestAndMostGuesses,
  findGlobalGuessesToWinAndGiveUp,
  findLatestGuesses,
  transformChartData,
} from '@/lib/utils';
import { getHintsCountsByPlayer } from '@/server/db/get-hints-counts-by-player';
import { db } from '@/server/db/index';
import { game, guess } from '@/server/db/schema';
import { asc } from 'drizzle-orm';
import { headers } from 'next/headers';

export const getGlobalStats = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    const error: ErrorObject = { error: 'Please log in first.' };
    return error;
  }

  // Get all games (ordered by start date in the ascending order) and guesses (ordered by id in the ascending order) with the guessed player name as well as the first and last name of the random player if it exists
  // Get counts of all approved hints by darts player
  const [games, hintsCounts] = await Promise.all([
    db.query.game.findMany({
      with: {
        user: {
          columns: { name: true },
        },
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
    }),
    getHintsCountsByPlayer(),
  ]);

  const stats: GlobalStats = {
    guesses: {
      fewestGuesses: undefined,
      mostGuesses: undefined,
      avgGuesses: undefined,
      avgGuessesUser: undefined,
      avgGuessesGuest: undefined,
      avgGuessesToWin: undefined,
      avgGuessesToWinUser: undefined,
      avgGuessesToWinGuest: undefined,
      avgGuessesToGiveUp: undefined,
      avgGuessesToGiveUpUser: undefined,
      avgGuessesToGiveUpGuest: undefined,
      totalGuesses: 0,
      totalGuessesUser: 0,
      totalGuessesGuest: 0,
    },
    games: {
      official: {
        officialGamesPlayed: 0,
        officialGamesCompleted: 0,
        officialModeWins: 0,
        officialModeGiveUps: 0,
        officialModeHintsRevealed: 0,
        officialModeHintsRevealedPercentage: 0,
      },
      random: {
        randomGamesPlayed: 0,
        randomGamesCompleted: 0,
        randomModeWins: 0,
        randomModeGiveUps: 0,
        randomModeHintsRevealed: 0,
        randomModeHintsRevealedPercentage: 0,
        randomGamesPlayedUser: 0,
        randomGamesCompletedUser: 0,
        randomModeWinsUser: 0,
        randomModeGiveUpsUser: 0,
        randomModeHintsRevealedUser: 0,
        randomModeHintsRevealedPercentageUser: 0,
        randomGamesPlayedGuest: 0,
        randomGamesCompletedGuest: 0,
        randomModeWinsGuest: 0,
        randomModeGiveUpsGuest: 0,
        randomModeHintsRevealedGuest: 0,
        randomModeHintsRevealedPercentageGuest: 0,
      },
    },
    players: {
      latestOfficialGuess: undefined,
      latestOfficialGuessName: undefined,
      latestOfficialGuessTime: undefined,
      latestRandomGuess: undefined,
      latestRandomGuessName: undefined,
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
    countGamesForGlobalStats(game, stats);
    countHintsRevealedForGlobalStats(game, hintsCountsMap, stats);
    countTotalGuesses(game, stats);
    findFewestAndMostGuesses(game, stats);
    findGlobalGuessesToWinAndGiveUp(game, stats);

    if (game.status !== 'inProgress') {
      countGamesByDay(game, gamesByDay);
      countRandomPlayers(game, randomPlayers);
    }

    if (game.guesses.length > 0) {
      game.guesses.forEach((guess) => {
        findLatestGuesses(game, guess, stats);
        countGuessedPlayers(guess, guessFrequency);
        countGuessesByDay(guess, guessesByDay);
      });
    }
  });

  calculateOtherStatsGlobal(stats, games);

  transformChartData(
    stats,
    guessFrequency,
    gamesByDay,
    guessesByDay,
    randomPlayers
  );

  return stats;
};
