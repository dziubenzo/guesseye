'use client';

import GameDetail from '@/components/GameDetail';
import PlayerCard from '@/components/PlayerCard';
import PlayerDifficultyBadge from '@/components/PlayerDifficultyBadge';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import type { CompletedGame, GuessWithPlayer, Player } from '@/lib/types';
import { capitalise, cn, comparePlayers } from '@/lib/utils';
import { format } from 'date-fns';
import Link from 'next/link';
import { use, type ComponentProps } from 'react';

type CompletedGameProps = {
  gameId: string;
  completedGamePromise: Promise<CompletedGame>;
};

export default function CompletedGame({
  gameId,
  completedGamePromise,
}: CompletedGameProps) {
  const completedGame = use(completedGamePromise);

  const {
    endDate,
    guesses,
    hintsRevealed,
    mode,
    playerToFind,
    startDate,
    status,
    username,
  } = completedGame;

  const { comparisonResults } = comparePlayers(playerToFind, playerToFind, {});

  return (
    <>
      <BackButtonWrapper>
        <Button className="cursor-pointer" variant="default" asChild>
          <Link href="/games">Back to Game History</Link>
        </Button>
      </BackButtonWrapper>
      <GameDetailsWrapper>
        <GameDetail title="Game No.">{gameId}</GameDetail>
        <GameDetail title="Completed By">{username}</GameDetail>
        <GameDetail title="Game Mode">{capitalise(mode)}</GameDetail>
        <GameDetail
          title="Game Status"
          className={
            status === 'won'
              ? 'text-good-guess dark:text-good-guess'
              : 'text-wrong-guess dark:text-wrong-guess'
          }
        >
          {status === 'won' ? 'Won' : 'Given Up'}
        </GameDetail>
        <GameDetail title="Started At">
          {format(startDate, 'HH:mm')} ({format(startDate, 'dd MMM y')})
        </GameDetail>
        <GameDetail title="Completed At">
          {format(endDate, 'HH:mm')} ({format(endDate, 'dd MMM y')})
        </GameDetail>
        <GameDetail title="Guesses Made">{guesses.length}</GameDetail>
        <GameDetail title="Hints Revealed">{hintsRevealed}</GameDetail>
      </GameDetailsWrapper>
      <PlayerToFindWrapper>
        <PlayerCard
          type="guess"
          comparisonResults={comparisonResults}
          player={playerToFind}
        />
        <CompletedGameGuesses playerToFind={playerToFind} guesses={guesses} />
      </PlayerToFindWrapper>
    </>
  );
}

export function BackButtonWrapper({
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div
      className="flex justify-center sm:justify-end sticky top-2 z-1"
      {...props}
    >
      {children}
    </div>
  );
}

export function GameDetailsWrapper({
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className="grid text-center sm:grid-cols-2 gap-2" {...props}>
      {children}
    </div>
  );
}

export function PlayerToFindWrapper({
  children,
  ...props
}: ComponentProps<'div'>) {
  return (
    <div className="flex flex-col gap-3" {...props}>
      <h2 className="font-medium text-2xl text-center sm:text-start">
        Darts Player To Find:
      </h2>
      {children}
    </div>
  );
}

type CompletedGameGuessesProps = {
  playerToFind: Player;
  guesses: GuessWithPlayer[];
};

function CompletedGameGuesses({
  playerToFind,
  guesses,
}: CompletedGameGuessesProps) {
  if (guesses.length === 0) return null;

  const playerToFindFullName =
    playerToFind.firstName + ' ' + playerToFind.lastName;

  return (
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
  );
}
