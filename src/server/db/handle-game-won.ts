'use server';

import type {
  ErrorObject,
  GameWithGuesses,
  GameWon,
  Schedule,
} from '@/lib/types';
import { getNextScheduledPlayer } from '@/server/db/get-next-scheduled-player';

export const handleGameWon = async (
  scheduledPlayer: Schedule,
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
  const firstName = guesses[guesses.length - 1].player.firstName;
  const lastName = guesses[guesses.length - 1].player.lastName;
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
