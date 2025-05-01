'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGameStore } from '@/lib/game-store';
import { useMemo } from 'react';
import PlayerCard from './PlayerCard';

export default function Guesses() {
  const { guesses } = useGameStore();

  const reversedGuesses = useMemo(() => guesses.toReversed(), [guesses]);

  return (
    <>
      <h1 className="text-2xl opacity-50">
        Previous Guesses{' '}
        {guesses.length > 0 &&
          (guesses.length === 1
            ? `(${guesses.length} player)`
            : `(${guesses.length} players)`)}
      </h1>
      <Carousel className="max-w-4xl xl:max-w-5xl">
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
    </>
  );
}
