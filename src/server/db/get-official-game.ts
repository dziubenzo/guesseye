'use server';

import type {
  ErrorObject,
  ExistingOfficialGame,
  GuessWithPlayer,
  GameNotPlayed,
} from '@/lib/types';
import { comparePlayers, validateScheduleId } from '@/lib/utils';
import { findOfficialGame } from '@/server/db/find-official-game';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';
import { getWinnersCount } from '@/server/db/get-winners-count';
import { handleGameGivenUp } from '@/server/db/handle-game-given-up';
import { handleGameWon } from '@/server/db/handle-game-won';

export const getOfficialGame = async (scheduleId?: string) => {
  const validationResult = validateScheduleId(scheduleId);

  if ('error' in validationResult) {
    const error: ErrorObject = { error: validationResult.error };
    return error;
  }

  const validScheduleId = validationResult.validScheduleId;

  // Get scheduled player
  const scheduledPlayer = await getScheduledPlayer(
    validScheduleId ? validScheduleId : undefined
  );

  if ('error' in scheduledPlayer) {
    const error: ErrorObject = { error: scheduledPlayer.error };
    return error;
  }

  // Get game if it exists
  const existingGame = await findOfficialGame(scheduledPlayer);

  if (existingGame && 'error' in existingGame) {
    const error: ErrorObject = { error: existingGame.error };
    return error;
  }

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
    const playerDifficulty: GameNotPlayed = {
      status: 'notPlayed',
      mode: 'official',
      playerDifficulty: scheduledPlayer.playerToFind.difficulty,
      winnersCount,
      nextPlayerStartDate: nextScheduledPlayer.startDate,
    };
    return playerDifficulty;
  }

  if (existingGame.status === 'won') {
    const data = await handleGameWon(scheduledPlayer, existingGame);
    return data;
  }

  if (existingGame.status === 'givenUp') {
    const data = await handleGameGivenUp(scheduledPlayer, existingGame);
    return data;
  }

  const gameDetails: ExistingOfficialGame = {
    status: existingGame.status,
    mode: 'official',
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
