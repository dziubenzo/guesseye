'use server';

import type {
  ErrorObject,
  ExistingGame,
  GuessWithPlayer,
  NoGame,
} from '@/lib/types';
import { comparePlayers, isScheduleIdValid } from '@/lib/utils';
import { getGame } from '@/server/db/get-game';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';
import { getWinnersCount } from '@/server/db/get-winners-count';
import { handleGameGivenUp } from '@/server/db/handle-game-given-up';
import { handleGameWon } from '@/server/db/handle-game-won';

export const getOfficialGame = async (scheduleId?: string) => {
  if (scheduleId) {
    // Make sure scheduleId is a positive integer
    const isValid = isScheduleIdValid(scheduleId);

    if (!isValid) {
      const error: ErrorObject = { error: 'Invalid game.' };
      return error;
    }
  }

  const validScheduleId = Number(scheduleId);

  // Get scheduled player
  const scheduledPlayer = await getScheduledPlayer(
    validScheduleId ? validScheduleId : undefined
  );

  if ('error' in scheduledPlayer) {
    const error: ErrorObject = { error: scheduledPlayer.error };
    return error;
  }

  // Get game if it exists
  const existingGame = await getGame(scheduledPlayer);

  // Get number of users who have found the scheduled player and the next scheduled player
  const [winnersCount, nextScheduledPlayer] = await Promise.all([
    getWinnersCount(scheduledPlayer),
    getNextScheduledPlayer(scheduledPlayer.endDate),
  ]);

  if ('error' in nextScheduledPlayer) {
    const error: ErrorObject = { error: nextScheduledPlayer.error };
    return error;
  }

  if (!existingGame) {
    const playerDifficulty: NoGame = {
      noGame: true,
      playerDifficulty: scheduledPlayer.playerToFind.difficulty,
      winnersCount,
      nextPlayerStartDate: nextScheduledPlayer.startDate,
    };
    return playerDifficulty;
  }

  if (existingGame.hasWon) {
    const data = await handleGameWon(scheduledPlayer, existingGame);
    return data;
  }

  if (existingGame.hasGivenUp) {
    const data = await handleGameGivenUp(scheduledPlayer, existingGame);
    return data;
  }

  const gameDetails: ExistingGame = {
    gameInProgress: true,
    guesses: [],
    playerToFindMatches: {},
    playerDifficulty: scheduledPlayer.playerToFind.difficulty,
    winnersCount,
    nextPlayerStartDate: nextScheduledPlayer.startDate,
  };

  existingGame.guesses.forEach((guess: GuessWithPlayer) => {
    const { comparisonResults } = comparePlayers(
      guess.player,
      scheduledPlayer.playerToFind,
      gameDetails.playerToFindMatches
    );
    gameDetails.guesses.push({
      guessedPlayer: guess.player,
      comparisonResults,
    });
  });

  return gameDetails;
};
