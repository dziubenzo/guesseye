'use server';

import type {
  ExistingRandomGame,
  GuessWithPlayer,
  NoRandomGame,
} from '@/lib/types';
import { comparePlayers, obfuscate } from '@/lib/utils';
import { createRandomGame } from '@/server/db/create-random-game';
import { findRandomGame } from '@/server/db/find-random-game';

export const getRandomGame = async () => {
  const existingGame = await findRandomGame();

  if (!existingGame) {
    const noGame: NoRandomGame = {
      gameId: undefined,
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
    throw new Error(game.error);
  }

  // This cannot happen, but the randomPlayerId field in game table can be null by design, so the check is necessary
  if (game.randomPlayer === null) {
    throw new Error('No player to find found in random game.');
  }

  const gameDetails: ExistingRandomGame = {
    gameId: game.id,
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
