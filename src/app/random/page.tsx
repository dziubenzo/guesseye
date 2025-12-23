import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GiveUpButton from '@/components/GiveUpButton';
import Guesses from '@/components/Guesses';
import GuessForm from '@/components/GuessForm';
import HintsButton from '@/components/HintsButton';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import TopBar from '@/components/TopBar';
import { auth } from '@/lib/auth';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Random Game' };

export default async function RandomGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return notFound();
  }

  const [game, names] = await Promise.all([
    getRandomGame(),
    getPlayerFullNames(),
  ]);

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  const {
    gameId,
    guesses,
    playerToFindMatches,
    mode,
    playerDifficulty,
    hints,
    obfuscatedHints,
    availableHints,
  } = game;

  return (
    <div className="flex flex-col gap-4">
      <TopBar>
        <div className="flex gap-2">
          <HintsButton availableHints={availableHints} gameId={gameId} />
          <GiveUpButton />
        </div>
        <GuessForm names={names} />
      </TopBar>
      <ModeIndicator allowVeryHard={session.user.allowVeryHard} />
      <PlayerToFindCard />
      <Guesses
        initialGuesses={guesses}
        initialObfuscatedHints={obfuscatedHints}
        initialHints={hints}
        playerToFindMatches={playerToFindMatches}
        mode={mode}
        playerDifficulty={playerDifficulty}
      />
      <GameOverConfetti />
      <GameOverModal />
    </div>
  );
}
