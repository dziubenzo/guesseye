'use client';

import PlayerCard from '@/components/PlayerCard';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { useGameStore } from '@/lib/game-store';
import type { ExistingGame } from '@/lib/types';
import { useEffect, useMemo } from 'react';

type GuessesProps = {
  existingGame?: ExistingGame;
};

export default function Guesses({ existingGame }: GuessesProps) {
  const { guesses, setInitialGuesses, updateMatches } = useGameStore();

  useEffect(() => {
    if (existingGame) {
      setInitialGuesses(existingGame.guesses);
      updateMatches(existingGame.playerToFindMatches);
    }
  }, [existingGame]);

  const reversedGuesses = useMemo(() => guesses.toReversed(), [guesses]);

  return (
    <div className="flex flex-col items-center gap-4">
      <h1 className="text-2xl opacity-50 text-center">
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
    </div>
  );
}
