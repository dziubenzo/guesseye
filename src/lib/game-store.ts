import type {
  GameHint,
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
  hints: GameHint[];
  previousMatches: PlayerToFindMatches;
  currentMatches: PlayerToFindMatches;
  gameOver: boolean;
  mode: GameMode;
  playerDifficulty: PlayerDifficultyField;
  finishGame: (playerToFind: Player) => void;
  setInitialGuesses: (initialGuesses: Guess[]) => void;
  setInitialHints: (hints: GameHint[]) => void;
  updateGuesses: (
    guessedPlayer: Guess['guessedPlayer'],
    comparisonResults: Guess['comparisonResults']
  ) => void;
  updateHints: (revealedHint: GameHint) => void;
  updatePreviousMatches: (lastMatches: PlayerToFindMatches) => void;
  updateCurrentMatches: (newMatches: PlayerToFindMatches) => void;
  resetState: () => void;
  updateMode: (mode: GameMode) => void;
  updateDifficulty: (playerDifficulty: PlayerDifficultyField) => void;
};

type InitialState = Pick<
  GameStore,
  | 'playerToFind'
  | 'hints'
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
  hints: [],
  previousMatches: {},
  currentMatches: {},
  gameOver: false,
  mode: 'random',
  playerDifficulty: '???',
};

export const useGameStore = create<GameStore>()((set) => ({
  playerToFind: null,
  guesses: [],
  hints: [],
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
  setInitialHints: (initialHints) =>
    set(() => ({
      hints: initialHints,
    })),
  updateGuesses: (guessedPlayer, comparisonResults) =>
    set((state) => ({
      guesses: [{ guessedPlayer, comparisonResults }, ...state.guesses],
    })),
  updateHints: (revealedHint) =>
    set((state) => ({
      hints: [...state.hints, revealedHint],
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
