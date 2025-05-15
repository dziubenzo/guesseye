'use server';

import type {
  ErrorObject,
  GameGivenUp,
  GameWithGuesses,
  ScheduleWithPlayer,
} from '@/lib/types';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';

export const handleGameGivenUp = async (
  scheduledPlayer: ScheduleWithPlayer,
  previousGame: GameWithGuesses
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

  const gameGivenUp: GameGivenUp = {
    hasGivenUp: true,
    previousPlayer: scheduledPlayer.playerToFind,
    attempts,
    nextPlayerStartDate: nextScheduledPlayer.startDate,
    nextPlayerDifficulty: nextScheduledPlayer.playerToFind.difficulty,
  };

  return gameGivenUp;
};
