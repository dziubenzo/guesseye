import type { GameMode, Guess, Player, PlayerToFindMatches } from '@/lib/types';
import { create } from 'zustand';

type GameStore = {
  playerToFind: Player | null;
  guesses: Guess[];
  playerToFindMatches: PlayerToFindMatches;
  gameOver: boolean;
  gameMode: GameMode;
  finishGame: (playerToFind: Player) => void;
  setInitialGuesses: (initialGuesses: Guess[]) => void;
  updateGuesses: (
    guessedPlayer: Guess['guessedPlayer'],
    comparisonResults: Guess['comparisonResults']
  ) => void;
  updateMatches: (newMatches: PlayerToFindMatches) => void;
  resetState: () => void;
  setGameMode: (gameMode: GameMode) => void;
};

type InitialState = Pick<
  GameStore,
  'playerToFind' | 'guesses' | 'playerToFindMatches' | 'gameOver' | 'gameMode'
>;

const initialState: InitialState = {
  playerToFind: null,
  guesses: [],
  playerToFindMatches: {},
  gameOver: false,
  gameMode: 'official',
};

export const useGameStore = create<GameStore>()((set) => ({
  playerToFind: null,
  guesses: [],
  playerToFindMatches: {},
  gameOver: false,
  gameMode: 'official',
  finishGame: (playerToFind) =>
    set(() => ({
      playerToFind,
      gameOver: true,
    })),
  setInitialGuesses: (initialGuesses) =>
    set(() => ({
      guesses: initialGuesses,
    })),
  updateGuesses: (guessedPlayer, comparisonResults) =>
    set((state) => ({
      guesses: [...state.guesses, { guessedPlayer, comparisonResults }],
    })),
  updateMatches: (newMatches) =>
    set((state) => ({
      playerToFindMatches: { ...state.playerToFindMatches, ...newMatches },
    })),
  resetState: () => {
    set(initialState);
  },
  setGameMode: (gameMode) => {
    set(() => ({
      gameMode,
    }));
  },
}));
