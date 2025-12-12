import ErrorPage from '@/components/ErrorPage';
import GameGivenUp from '@/components/GameGivenUp';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GameWon from '@/components/GameWon';
import Guesses from '@/components/Guesses';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import { auth } from '@/lib/auth';
import { getOfficialGame } from '@/server/db/get-official-game';
import { getPlayerFullNames } from '@/server/db/get-player-full-names';
import { getRandomGame } from '@/server/db/get-random-game';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

export const metadata: Metadata = { title: 'GuessEye' };

export default async function CurrentGame() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const names = await getPlayerFullNames();

  if (session) {
    const game = await getOfficialGame();

    if ('error' in game) {
      return <ErrorPage errorMessage={game.error} />;
    }

    if (game.status === 'won') {
      return <GameWon previousGame={game} />;
    }

    if (game.status === 'givenUp') {
      return <GameGivenUp previousGame={game} />;
    }

    if (game) {
      const {
        guesses,
        playerToFindMatches,
        winnersCount,
        nextPlayerStartDate,
        mode,
        playerDifficulty,
      } = game;

      return (
        <div className="flex flex-col gap-4">
          <PlayerForm names={names} />
          <ModeIndicator />
          <PlayerToFindInfo
            winnersCount={winnersCount}
            nextPlayerStartDate={nextPlayerStartDate}
          />
          <PlayerToFindCard />
          <Guesses
            initialGuesses={guesses}
            playerToFindMatches={playerToFindMatches}
            mode={mode}
            playerDifficulty={playerDifficulty}
          />
          <GameOverConfetti />
          <GameOverModal />
        </div>
      );
    }
  }

  const game = await getRandomGame({ isGuest: true });

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  const { guesses, playerToFindMatches, mode, playerDifficulty } = game;

  return (
    <div className="flex flex-col gap-4">
      <PlayerForm names={names} />
      <ModeIndicator />
      <PlayerToFindCard />
      <Guesses
        initialGuesses={guesses}
        playerToFindMatches={playerToFindMatches}
        mode={mode}
        playerDifficulty={playerDifficulty}
      />
      <GameOverConfetti />
      <GameOverModal />
    </div>
  );
}
