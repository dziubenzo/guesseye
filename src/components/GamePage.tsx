'use client';

import ErrorPage from '@/components/ErrorPage';
import GameGivenUp from '@/components/GameGivenUp';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GamePageMiddle from '@/components/GamePageMiddle';
import GameWon from '@/components/GameWon';
import GiveUpButton from '@/components/GiveUpButton';
import Guesses from '@/components/Guesses';
import GuessForm from '@/components/GuessForm';
import HintsButton from '@/components/HintsButton';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerCard from '@/components/PlayerCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import ProgressBar from '@/components/ProgressBar';
import TopBar, { TopBarButtons } from '@/components/TopBar';
import { useGameStore } from '@/lib/game-store';
import type {
  OfficialGameState,
  PlayerFullName,
  RandomGameState,
  User,
} from '@/lib/types';
import { notFound, usePathname } from 'next/navigation';
import { use, type ReactNode } from 'react';

type GamePageProps = {
  namesPromise: Promise<PlayerFullName[]>;
  scheduleId?: string;
  allowVeryHard?: boolean;
  userId?: User['id'];
} & (
  | {
      gameMode: 'random';
      gamePromise: Promise<RandomGameState>;
    }
  | {
      gameMode: 'official';
      gamePromise: Promise<OfficialGameState>;
    }
);

export default function GamePage({
  gameMode,
  gamePromise,
  namesPromise,
  scheduleId,
  allowVeryHard,
  userId,
}: GamePageProps) {
  const names = use(namesPromise);
  
  const pathname = usePathname();
  const { previousMatches, currentMatches } = useGameStore();

  if (gameMode === 'random') {
    const game = use(gamePromise);

    if ('error' in game) {
      return <ErrorPage errorMessage={game.error} />;
    }

    const {
      gameId,
      guesses,
      playerToFindMatches,
      playerDifficulty,
      hints,
      obfuscatedHints,
      availableHints,
    } = game;

    return (
      <GamePageWrapper>
        <TopBar>
          <TopBarButtons>
            <HintsButton availableHints={availableHints} gameId={gameId} />
            <GiveUpButton mode="random" gameId={gameId} userId={userId} />
          </TopBarButtons>
          <GuessForm mode="random" names={names} />
        </TopBar>
        <ModeIndicator mode="random" allowVeryHard={allowVeryHard} />
        <GamePageMiddle>
          <ProgressBar />
          <PlayerCard
            type="playerToFind"
            previousMatches={previousMatches}
            currentMatches={currentMatches}
            playerDifficulty={playerDifficulty}
          />
        </GamePageMiddle>
        <Guesses
          initialGuesses={guesses}
          initialObfuscatedHints={obfuscatedHints}
          initialHints={hints}
          playerToFindMatches={playerToFindMatches}
        />
        <GameOverConfetti />
        <GameOverModal gameId={gameId} userId={userId} />
      </GamePageWrapper>
    );
  } else {
    const game = use(gamePromise);

    if ('error' in game) {
      return <ErrorPage errorMessage={game.error} />;
    }

    // Previous official games
    if (game.status !== 'inProgress' && pathname !== '/') {
      return notFound();
    }

    // Current official game
    if (game.status === 'won') {
      return <GameWon previousGame={game} />;
    }

    if (game.status === 'givenUp') {
      return <GameGivenUp previousGame={game} />;
    }

    const {
      gameId,
      guesses,
      playerToFindMatches,
      winnersCount,
      nextPlayerStartDate,
      playerDifficulty,
      hints,
      obfuscatedHints,
      availableHints,
    } = game;

    return (
      <GamePageWrapper>
        <TopBar>
          <TopBarButtons>
            <HintsButton availableHints={availableHints} gameId={gameId} />
            <GiveUpButton
              mode="official"
              scheduleId={scheduleId}
              gameId={gameId}
              userId={userId}
            />
          </TopBarButtons>
          <GuessForm mode="official" names={names} scheduleId={scheduleId} />
        </TopBar>
        <ModeIndicator mode="official" />
        <PlayerToFindInfo
          winnersCount={winnersCount}
          nextPlayerStartDate={
            pathname === '/' ? nextPlayerStartDate : undefined
          }
        />
        <GamePageMiddle>
          <ProgressBar />
          <PlayerCard
            type="playerToFind"
            previousMatches={previousMatches}
            currentMatches={currentMatches}
            playerDifficulty={playerDifficulty}
          />
        </GamePageMiddle>
        <Guesses
          initialGuesses={guesses}
          initialHints={hints}
          initialObfuscatedHints={obfuscatedHints}
          playerToFindMatches={playerToFindMatches}
        />
        <GameOverConfetti />
        <GameOverModal gameId={gameId} userId={userId} />
      </GamePageWrapper>
    );
  }
}

type GamePageWrapperProps = {
  children: ReactNode;
};

export function GamePageWrapper({ children }: GamePageWrapperProps) {
  return <div className="flex flex-col gap-4">{children}</div>;
}
