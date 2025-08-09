import type {
  GameMode,
  Guess,
  Player,
  PlayerDifficultyField,
  PlayerToFindMatches,
} from '@/lib/types';
import { create } from 'zustand';

type GameStore = {
  playerToFind: Player | null;
  guesses: Guess[];
  previousMatches: PlayerToFindMatches;
  currentMatches: PlayerToFindMatches;
  gameOver: boolean;
  mode: GameMode;
  playerDifficulty: PlayerDifficultyField;
  finishGame: (playerToFind: Player) => void;
  setInitialGuesses: (initialGuesses: Guess[]) => void;
  updateGuesses: (
    guessedPlayer: Guess['guessedPlayer'],
    comparisonResults: Guess['comparisonResults']
  ) => void;
  updatePreviousMatches: (lastMatches: PlayerToFindMatches) => void;
  updateCurrentMatches: (newMatches: PlayerToFindMatches) => void;
  resetState: () => void;
  updateMode: (mode: GameMode) => void;
  updateDifficulty: (playerDifficulty: PlayerDifficultyField) => void;
};

type InitialState = Pick<
  GameStore,
  | 'playerToFind'
  | 'guesses'
  | 'previousMatches'
  | 'currentMatches'
  | 'gameOver'
  | 'mode'
  | 'playerDifficulty'
>;

const initialState: InitialState = {
  playerToFind: null,
  guesses: [],
  previousMatches: {},
  currentMatches: {},
  gameOver: false,
  mode: 'random',
  playerDifficulty: '???',
};

export const useGameStore = create<GameStore>()((set) => ({
  playerToFind: null,
  guesses: [],
  previousMatches: {},
  currentMatches: {},
  gameOver: false,
  mode: 'random',
  playerDifficulty: '???',
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
  updatePreviousMatches: (lastMatches) =>
    set((state) => ({
      previousMatches: { ...state.previousMatches, ...lastMatches },
    })),
  updateCurrentMatches: (newMatches) =>
    set((state) => ({
      currentMatches: { ...state.currentMatches, ...newMatches },
    })),
  resetState: () => {
    set(initialState);
  },
  updateMode: (mode) => {
    set(() => ({ mode }));
  },
  updateDifficulty: (playerDifficulty) => {
    set(() => ({ playerDifficulty }));
  },
}));
