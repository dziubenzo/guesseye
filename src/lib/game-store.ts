import type { GameHint, Guess, Player, PlayerToFindMatches } from '@/lib/types';
import { create } from 'zustand';

type GameStore = {
  playerToFind: Player | null;
  guesses: Guess[];
  hints: GameHint[];
  obfuscatedHints: string[];
  previousMatches: PlayerToFindMatches;
  currentMatches: PlayerToFindMatches;
  gameOver: boolean;
  finishGame: (playerToFind: Player) => void;
  setInitialGuesses: (initialGuesses: Guess[]) => void;
  setInitialHints: (initialHints: GameHint[]) => void;
  setInitialObfuscatedHints: (initialObfuscatedHints: string[]) => void;
  updateGuesses: (
    guessedPlayer: Guess['guessedPlayer'],
    comparisonResults: Guess['comparisonResults']
  ) => void;
  updateHints: (revealedHint: GameHint) => void;
  updatePreviousMatches: (lastMatches: PlayerToFindMatches) => void;
  updateCurrentMatches: (newMatches: PlayerToFindMatches) => void;
  resetState: () => void;
};

type InitialState = Pick<
  GameStore,
  | 'playerToFind'
  | 'hints'
  | 'obfuscatedHints'
  | 'guesses'
  | 'previousMatches'
  | 'currentMatches'
  | 'gameOver'
>;

const initialState: InitialState = {
  playerToFind: null,
  guesses: [],
  hints: [],
  obfuscatedHints: [],
  previousMatches: {},
  currentMatches: {},
  gameOver: false,
};

export const useGameStore = create<GameStore>()((set) => ({
  playerToFind: null,
  guesses: [],
  hints: [],
  obfuscatedHints: [],
  previousMatches: {},
  currentMatches: {},
  gameOver: false,
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
  setInitialObfuscatedHints: (initialObfuscatedHints) =>
    set(() => ({
      obfuscatedHints: initialObfuscatedHints,
    })),
  updateGuesses: (guessedPlayer, comparisonResults) =>
    set((state) => ({
      guesses: [{ guessedPlayer, comparisonResults }, ...state.guesses],
    })),
  updateHints: (revealedHint) =>
    set((state) => ({
      hints: [...state.hints, revealedHint],
      obfuscatedHints: state.obfuscatedHints.slice(1),
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
}));
