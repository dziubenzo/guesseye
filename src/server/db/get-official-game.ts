'use server';

import type {
  AnyOfficialGame,
  ErrorObject,
  GuessWithPlayer,
} from '@/lib/types';
import { comparePlayers, obfuscate, validateScheduleId } from '@/lib/utils';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';
import { getWinnersCount } from '@/server/db/get-winners-count';
import { handleGameGivenUp } from '@/server/db/handle-game-given-up';
import { handleGameWon } from '@/server/db/handle-game-won';
import { getScheduleData } from './get-schedule-data';

export const getOfficialGame = async (scheduleId?: string) => {
  const validationResult = validateScheduleId(scheduleId);

  if ('error' in validationResult) {
    const error: ErrorObject = { error: validationResult.error };
    return error;
  }

  const validScheduleId = validationResult.validScheduleId;

  // Get schedule data together with the player to find
  // Get the existing game if it exists
  const scheduleData = await getScheduleData(validScheduleId);

  if ('error' in scheduleData) {
    const error: ErrorObject = { error: scheduleData.error };
    return error;
  }

  const existingGame =
    scheduleData.games.length === 1 ? scheduleData.games[0] : undefined;
  const playerToFind = scheduleData.playerToFind;

  // Get number of users who have found the scheduled player and the next scheduled player
  const [winnersCount, nextScheduledPlayer] = await Promise.all([
    getWinnersCount(scheduleData),
    getNextScheduledPlayer(scheduleData.endDate),
  ]);

  if ('error' in nextScheduledPlayer) {
    const error: ErrorObject = { error: nextScheduledPlayer.error };
    return error;
  }

  const gameDetails: AnyOfficialGame = {
    status: 'inProgress',
    gameId: existingGame?.id,
    mode: 'official',
    guesses: [],
    playerToFindMatches: {
      firstName: obfuscate('name', playerToFind.firstName),
      lastName: obfuscate('name', playerToFind.lastName),
    },
    hints: playerToFind.hints.slice(0, existingGame?.hintsRevealed || 0),
    obfuscatedHints: playerToFind.hints
      .slice(existingGame?.hintsRevealed || 0)
      .map((hint) => obfuscate('hint', hint.hint)),
    availableHints: playerToFind.hints.length,
    playerDifficulty: playerToFind.difficulty,
    winnersCount,
    nextPlayerStartDate: nextScheduledPlayer.startDate,
  };

  if (!existingGame) {
    return gameDetails;
  }

  if (existingGame.status === 'won') {
    const data = await handleGameWon(scheduleData, existingGame);
    return data;
  }

  if (existingGame.status === 'givenUp') {
    const data = await handleGameGivenUp(scheduleData, existingGame);
    return data;
  }

  existingGame.guesses.forEach((guess: GuessWithPlayer) => {
    const { comparisonResults } = comparePlayers(
      guess.player,
      playerToFind,
      gameDetails.playerToFindMatches
    );
    gameDetails.guesses.push({
      guessedPlayer: guess.player,
      comparisonResults,
    });
  });

  return gameDetails;
};
