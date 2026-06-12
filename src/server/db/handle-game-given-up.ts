'use server';

import type {
  GameGivenUp,
  OfficialGame,
  PlayerToFindMatches,
  ScheduleWithPlayerAndGame,
} from '@/lib/types';
import { fillAllMatches } from '@/lib/utils';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';

export const handleGameGivenUp = async (
  scheduleData: ScheduleWithPlayerAndGame,
  previousGame: OfficialGame
) => {
  const nextScheduledPlayer = await getNextScheduledPlayer(
    scheduleData.endDate
  );

  if ('error' in nextScheduledPlayer) {
    throw new Error(nextScheduledPlayer.error);
  }

  const { guesses } = previousGame;
  const attempts = guesses.length;
  const previousPlayer: PlayerToFindMatches = {};

  fillAllMatches(scheduleData.playerToFind, previousPlayer);

  const gameGivenUp: GameGivenUp = {
    status: 'givenUp',
    previousPlayer,
    previousPlayerDifficulty: scheduleData.playerToFind.difficulty,
    attempts,
    nextPlayerStartDate: nextScheduledPlayer.startDate,
    nextPlayerDifficulty: nextScheduledPlayer.playerToFind.difficulty,
  };

  return gameGivenUp;
};
