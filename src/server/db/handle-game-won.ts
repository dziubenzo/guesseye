'use server';

import type {
  ErrorObject,
  GameWithGuessesWithPlayer,
  GameWon,
  ScheduleWithPlayer,
} from '@/lib/types';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';

export const handleGameWon = async (
  scheduledPlayer: ScheduleWithPlayer,
  previousGame: GameWithGuessesWithPlayer
) => {
  const nextScheduledPlayer = await getNextScheduledPlayer(
    scheduledPlayer.endDate
  );

  if ('error' in nextScheduledPlayer) {
    const error: ErrorObject = { error: nextScheduledPlayer.error };
    return error;
  }

  const { guesses } = previousGame;
  const attempts = guesses.length;
  const firstName = scheduledPlayer.playerToFind.firstName;
  const lastName = scheduledPlayer.playerToFind.lastName;
  const fullName = firstName + ' ' + lastName;

  const gameWon: GameWon = {
    hasWon: true,
    nextPlayerStartDate: nextScheduledPlayer.startDate,
    nextPlayerDifficulty: nextScheduledPlayer.playerToFind.difficulty,
    attempts,
    fullName,
  };

  return gameWon;
};
