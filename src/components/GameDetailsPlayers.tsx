'use client';

import PlayerCard from '@/components/PlayerCard';
import PlayerDifficultyBadge from '@/components/PlayerDifficultyBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { GuessWithPlayer, Player } from '@/lib/types';
import { cn, comparePlayers } from '@/lib/utils';

type GameDetailsPlayersProps = {
  playerToFind: Player;
  guesses: GuessWithPlayer[];
};

export default function GameDetailsPlayers({
  playerToFind,
  guesses,
}: GameDetailsPlayersProps) {
  const { comparisonResults } = comparePlayers(playerToFind, playerToFind, {});
  const playerToFindFullName =
    playerToFind.firstName + ' ' + playerToFind.lastName;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-medium text-2xl text-center sm:text-start">
        Darts Player To Find:
      </h2>
      <PlayerCard
        type="guess"
        comparisonResults={comparisonResults}
        player={playerToFind}
      />
      {guesses.length > 0 && (
        <>
          <h2 className="font-medium text-2xl text-center sm:text-start">
            Guesses ({guesses.length}):
          </h2>
          <Accordion type="multiple">
            {guesses.map((guess, index) => {
              const { comparisonResults } = comparePlayers(
                guess.player,
                playerToFind,
                {}
              );
              const guessNumber = guesses.length - index;
              const guessFullName =
                guess.player.firstName + ' ' + guess.player.lastName;
              return (
                <AccordionItem
                  key={`guess-${guessNumber}`}
                  value={`guess-${guessNumber}`}
                >
                  <AccordionTrigger className="cursor-pointer text-sm sm:text-base px-2 sm:px-0 truncate">
                    <div className="flex justify-between items-center gap-2 w-full">
                      <p
                        className={cn(
                          'truncate',
                          guessFullName === playerToFindFullName &&
                            'text-good-guess'
                        )}
                      >
                        #{guessNumber} - {guessFullName}
                      </p>
                      <div>
                        <PlayerDifficultyBadge
                          difficulty={guess.player.difficulty}
                        />
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base">
                    <PlayerCard
                      type="guess"
                      comparisonResults={comparisonResults}
                      player={guess.player}
                      guessNumber={guessNumber}
                    />
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </>
      )}
    </div>
  );
}
