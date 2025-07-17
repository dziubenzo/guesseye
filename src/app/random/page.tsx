import ErrorPage from '@/components/ErrorPage';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import Guesses from '@/components/Guesses';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import { auth } from '@/lib/auth';
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

  const game = await getRandomGame();

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  const { playerDifficulty, mode } = game;

  return (
    <div className="flex flex-col gap-4">
      <PlayerForm />
      <ModeIndicator />
      <PlayerToFindCard difficulty={playerDifficulty} />
      <Guesses existingGame={game} mode={mode} />
      <GameOverConfetti />
      <GameOverModal />
    </div>
  );
}
