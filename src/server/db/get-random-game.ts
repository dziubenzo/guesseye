'use server';

import type {
  ErrorObject,
  ExistingRandomGame,
  GuessWithPlayer,
} from '@/lib/types';
import { comparePlayers } from '@/lib/utils';
import { createRandomGame } from '@/server/db/create-random-game';
import { findRandomGame } from '@/server/db/find-random-game';

export const getRandomGame = async () => {
  const existingGame = await findRandomGame();

  const game = existingGame ? existingGame : await createRandomGame();

  if ('error' in game) {
    const error: ErrorObject = { error: game.error };
    return error;
  }

  if (game.randomPlayer === null) {
    const error: ErrorObject = { error: 'No player to find found.' };
    return error;
  }

  const gameDetails: ExistingRandomGame = {
    mode: 'random',
    guesses: [],
    playerToFindMatches: {},
    playerDifficulty: game.randomPlayer.difficulty,
  };

  game.guesses.forEach((guess: GuessWithPlayer) => {
    const { comparisonResults } = comparePlayers(
      guess.player,
      game.randomPlayer!, // it must exist
      gameDetails.playerToFindMatches
    );
    gameDetails.guesses.push({
      guessedPlayer: guess.player,
      comparisonResults,
    });
  });

  return gameDetails;
};
