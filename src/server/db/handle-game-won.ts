'use server';

import type {
  ErrorObject,
  GameWon,
  OfficialGame,
  ScheduleWithPlayerAndGame,
} from '@/lib/types';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';

export const handleGameWon = async (
  scheduleData: ScheduleWithPlayerAndGame,
  previousGame: OfficialGame
) => {
  const nextScheduledPlayer = await getNextScheduledPlayer(
    scheduleData.endDate
  );

  if ('error' in nextScheduledPlayer) {
    const error: ErrorObject = { error: nextScheduledPlayer.error };
    return error;
  }

  const { guesses } = previousGame;
  const attempts = guesses.length;
  const firstName = scheduleData.playerToFind.firstName;
  const lastName = scheduleData.playerToFind.lastName;
  const fullName = firstName + ' ' + lastName;

  const gameWon: GameWon = {
    status: 'won',
    nextPlayerStartDate: nextScheduledPlayer.startDate,
    nextPlayerDifficulty: nextScheduledPlayer.playerToFind.difficulty,
    attempts,
    fullName,
  };

  return gameWon;
};
