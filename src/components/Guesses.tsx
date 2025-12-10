'use client';

import PlayerCard from '@/components/PlayerCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { useGameStore } from '@/lib/game-store';
import type {
  GameMode,
  Guess,
  PlayerDifficultyField,
  PlayerToFindMatches,
} from '@/lib/types';
import { useEffect, useState } from 'react';

type GuessesProps = {
  initialGuesses: Guess[];
  playerToFindMatches: PlayerToFindMatches;
  mode: GameMode;
  playerDifficulty: PlayerDifficultyField;
};

export default function Guesses({
  initialGuesses,
  playerToFindMatches,
  mode,
  playerDifficulty,
}: GuessesProps) {
  const {
    guesses,
    setInitialGuesses,
    updatePreviousMatches,
    updateCurrentMatches,
    updateMode,
    updateDifficulty,
  } = useGameStore();
  const [api, setApi] = useState<CarouselApi>();

  // Set initial state when a game is fetched and a random game is won/given up
  useEffect(() => {
    updateMode(mode);
    updateDifficulty(playerDifficulty);
    setInitialGuesses(initialGuesses);
    updatePreviousMatches(playerToFindMatches);
    updateCurrentMatches(playerToFindMatches);
  }, [mode, playerDifficulty, initialGuesses, playerToFindMatches]);

  // Scroll to the latest guess when a guess has been made
  useEffect(() => {
    if (!api) return;

    api.scrollTo(0);
  }, [api, guesses]);

  return (
    <div className="flex flex-col items-center gap-4">
      {guesses.length > 0 && (
        <h1 className="text-2xl opacity-50 text-center">
          Previous Guesses{' '}
          {guesses.length === 1
            ? `(${guesses.length} player)`
            : `(${guesses.length} players)`}
        </h1>
      )}
      <Carousel
        className="min-w-full max-w-full hover:cursor-grab select-none"
        setApi={setApi}
      >
        <CarouselContent>
          {guesses.map((guess, index) => (
            <CarouselItem
              key={guess.guessedPlayer.id}
              className="flex justify-center items-center"
            >
              <PlayerCard
                type={'guess'}
                player={guess.guessedPlayer}
                comparisonResults={guess.comparisonResults}
                guessNumber={guesses.length - index}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {guesses.length > 0 && (
          <>
            <CarouselPrevious className="cursor-pointer hidden xl:flex" />
            <CarouselNext className="cursor-pointer hidden xl:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
}
