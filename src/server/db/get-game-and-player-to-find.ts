'use server';

import type {
  ErrorObject,
  Game,
  GameMode,
  OfficialGame,
  Player,
  RandomGame,
} from '@/lib/types';
import { createOfficialGame } from '@/server/db/create-official-game';
import { createRandomGame } from '@/server/db/create-random-game';
import { findOfficialGame } from '@/server/db/find-official-game';
import { findRandomGame } from '@/server/db/find-random-game';
import { getScheduledPlayer } from '@/server/db/get-scheduled-player';

export const getGameAndPlayerToFind = async (
  gameMode: GameMode,
  scheduleId?: number
) => {
  let game: OfficialGame | RandomGame | Game | ErrorObject;
  let playerToFind: Player;

  if (gameMode === 'official') {
    const scheduledPlayer = await getScheduledPlayer(
      scheduleId ? scheduleId : undefined
    );

    if ('error' in scheduledPlayer) {
      const error: ErrorObject = { error: scheduledPlayer.error };
      return error;
    }

    const existingGame = await findOfficialGame(scheduledPlayer);

    // Make sure the official game is not already completed
    if (existingGame && (existingGame.hasGivenUp || existingGame.hasWon)) {
      const error: ErrorObject = {
        error: 'This official game has already been completed.',
      };
      return error;
    }

    game = existingGame
      ? existingGame
      : await createOfficialGame(scheduledPlayer);

    playerToFind = scheduledPlayer.playerToFind;
  } else {
    const existingGame = await findRandomGame();

    game = existingGame ? existingGame : await createRandomGame();

    if ('error' in game) {
      const error: ErrorObject = { error: game.error };
      return error;
    }

    if ('randomPlayer' in game && game.randomPlayer) {
      playerToFind = game.randomPlayer;
    } else {
      const error: ErrorObject = { error: 'No player to find found.' };
      return error;
    }
  }

  return { game, playerToFind };
};
