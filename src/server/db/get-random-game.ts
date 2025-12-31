'use server';

import type {
  ErrorObject,
  ExistingRandomGame,
  GuessWithPlayer,
  NoRandomGame,
} from '@/lib/types';
import { comparePlayers, obfuscate } from '@/lib/utils';
import { createRandomGame } from '@/server/db/create-random-game';
import { findRandomGame } from '@/server/db/find-random-game';

type GetRandomGameOptions = {
  isGuest: boolean;
};

export const getRandomGame = async (options?: GetRandomGameOptions) => {
  const existingGame = await findRandomGame();

  // Do not create a random game automatically for guests
  if (options?.isGuest && !existingGame) {
    const noGame: NoRandomGame = {
      status: 'noGame',
      gameId: undefined,
      mode: 'random',
      guesses: [],
      playerToFindMatches: {},
      hints: [],
      obfuscatedHints: [],
      availableHints: 0,
      playerDifficulty: '???',
    };

    return noGame;
  }

  const game = existingGame ? existingGame : await createRandomGame();

  if ('error' in game) {
    const error: ErrorObject = { error: game.error };
    return error;
  }

  // This cannot happen, but the randomPlayerId field in game table can be null by design, so the check is necessary
  if (game.randomPlayer === null) {
    const error: ErrorObject = {
      error: 'No player to find found in random game.',
    };
    return error;
  }

  const gameDetails: ExistingRandomGame = {
    status: 'inProgress',
    gameId: game.id,
    mode: 'random',
    guesses: [],
    playerToFindMatches: {
      firstName: obfuscate('name', game.randomPlayer.firstName),
      lastName: obfuscate('name', game.randomPlayer.lastName),
    },
    hints: game.randomPlayer.hints.slice(0, game.hintsRevealed),
    obfuscatedHints: game.randomPlayer.hints
      .slice(game.hintsRevealed)
      .map((hint) => obfuscate('hint', hint.hint)),
    availableHints: game.randomPlayer.hints.length,
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
