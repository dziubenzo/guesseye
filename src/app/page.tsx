import ErrorPage from '@/components/ErrorPage';
import GameGivenUp from '@/components/GameGivenUp';
import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GameWon from '@/components/GameWon';
import GiveUpButton from '@/components/GiveUpButton';
import Guesses from '@/components/Guesses';
import GuessForm from '@/components/GuessForm';
import HintsButton from '@/components/HintsButton';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import TopBar from '@/components/TopBar';
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
        gameId,
        guesses,
        playerToFindMatches,
        winnersCount,
        nextPlayerStartDate,
        mode,
        playerDifficulty,
        hints,
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
          <ModeIndicator />
          <PlayerToFindInfo
            winnersCount={winnersCount}
            nextPlayerStartDate={nextPlayerStartDate}
          />
          <PlayerToFindCard />
          <Guesses
            initialGuesses={guesses}
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
  }

  const game = await getRandomGame({ isGuest: true });

  if ('error' in game) {
    return <ErrorPage errorMessage={game.error} />;
  }

  const {
    guesses,
    playerToFindMatches,
    mode,
    playerDifficulty,
    hints,
    availableHints,
  } = game;

  return (
    <div className="flex flex-col gap-4">
      <TopBar>
        <div className="flex gap-2">
          <HintsButton availableHints={availableHints} />
          <GiveUpButton />
        </div>
        <GuessForm names={names} />
      </TopBar>
      <ModeIndicator />
      <PlayerToFindCard />
      <Guesses
        initialGuesses={guesses}
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
