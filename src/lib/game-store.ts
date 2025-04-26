import { Guess, Player, PlayerToFindMatches } from '@/lib/types';
import { create } from 'zustand';

type GameStore = {
  playerToFind: Player | null;
  guesses: Guess[];
  playerToFindMatches: PlayerToFindMatches;
  gameOver: boolean;
  finishGame: (playerToFind: Player) => void;
  updateGuesses: (
    guessedPlayer: Guess['guessedPlayer'],
    comparisonResult: Guess['comparisonResult']
  ) => void;
  updateMatches: (newMatches: PlayerToFindMatches) => void;
};

export const useGameStore = create<GameStore>()((set) => ({
  playerToFind: null,
  guesses: [],
  playerToFindMatches: {},
  gameOver: false,
  finishGame: (playerToFind) =>
    set(() => ({
      playerToFind,
      gameOver: true,
    })),
  updateGuesses: (guessedPlayer, comparisonResult) =>
    set((state) => ({
      guesses: [...state.guesses, { guessedPlayer, comparisonResult }],
    })),
  updateMatches: (newMatches) =>
    set((state) => ({
      playerToFindMatches: { ...state.playerToFindMatches, ...newMatches },
    })),
}));
