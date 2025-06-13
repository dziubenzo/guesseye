'use server';

import type {
  ErrorObject,
  GameGivenUp,
  OfficialGame,
  PlayerToFindMatches,
  ScheduleWithPlayer,
} from '@/lib/types';
import { fillAllMatches } from '@/lib/utils';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';

export const handleGameGivenUp = async (
  scheduledPlayer: ScheduleWithPlayer,
  previousGame: OfficialGame
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
  const previousPlayer: PlayerToFindMatches = {};
  fillAllMatches(scheduledPlayer.playerToFind, previousPlayer);

  const gameGivenUp: GameGivenUp = {
    hasGivenUp: true,
    previousPlayer,
    previousPlayerDifficulty: scheduledPlayer.playerToFind.difficulty,
    attempts,
    nextPlayerStartDate: nextScheduledPlayer.startDate,
    nextPlayerDifficulty: nextScheduledPlayer.playerToFind.difficulty,
  };

  return gameGivenUp;
};
