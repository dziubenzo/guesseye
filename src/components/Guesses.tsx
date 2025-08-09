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
import { useEffect, useMemo, useState } from 'react';

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

  // Set initial state when a game is fetched
  useEffect(() => {
    updateMode(mode);
    updateDifficulty(playerDifficulty);
    setInitialGuesses(initialGuesses);
    updatePreviousMatches(playerToFindMatches);
    updateCurrentMatches(playerToFindMatches);
  }, []);

  const reversedGuesses = useMemo(() => guesses.toReversed(), [guesses]);

  // Scroll to the latest guess when a guess has been made
  useEffect(() => {
    if (!api) return;

    api.scrollTo(0);
  }, [api, reversedGuesses]);

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
      <Carousel className="max-w-full lg:max-w-4xl" setApi={setApi}>
        <CarouselContent>
          {reversedGuesses.map((guess) => (
            <CarouselItem
              key={guess.guessedPlayer.id}
              className="flex justify-center items-center"
            >
              <PlayerCard
                type={'guess'}
                player={guess.guessedPlayer}
                comparisonResults={guess.comparisonResults}
                guessNumber={guesses.indexOf(guess) + 1}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
        {guesses.length > 0 && (
          <>
            <CarouselPrevious className="cursor-pointer hidden lg:flex" />
            <CarouselNext className="cursor-pointer hidden lg:flex" />
          </>
        )}
      </Carousel>
    </div>
  );
}
