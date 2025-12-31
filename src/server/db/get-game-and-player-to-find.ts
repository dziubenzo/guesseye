'use server';

import type {
  ErrorObject,
  Game,
  GameMode,
  OfficialGame,
  PlayerWithHints,
  RandomGame,
} from '@/lib/types';
import { createOfficialGame } from '@/server/db/create-official-game';
import { createRandomGame } from '@/server/db/create-random-game';
import { findRandomGame } from '@/server/db/find-random-game';
import { getScheduleData } from '@/server/db/get-schedule-data';

export const getGameAndPlayerToFind = async (
  mode: GameMode,
  scheduleId?: number
) => {
  let game: OfficialGame | RandomGame | Game | ErrorObject;
  let playerToFind: PlayerWithHints;

  if (mode === 'official') {
    const scheduleData = await getScheduleData(scheduleId);

    if ('error' in scheduleData) {
      const error: ErrorObject = { error: scheduleData.error };
      return error;
    }

    const existingGame =
      scheduleData.games.length === 1 ? scheduleData.games[0] : undefined;

    game = existingGame ? existingGame : await createOfficialGame(scheduleData);

    playerToFind = scheduleData.playerToFind;
  } else {
    const existingGame = await findRandomGame();

    game = existingGame ? existingGame : await createRandomGame();

    if ('randomPlayer' in game && game.randomPlayer) {
      playerToFind = game.randomPlayer;
    } else {
      const error: ErrorObject = { error: 'No player to find found.' };
      return error;
    }
  }

  return { game, playerToFind };
};
