'use client';

import GameOverConfetti from '@/components/GameOverConfetti';
import GameOverModal from '@/components/GameOverModal';
import GiveUpButton from '@/components/GiveUpButton';
import Guesses from '@/components/Guesses';
import GuessForm from '@/components/GuessForm';
import HintsButton from '@/components/HintsButton';
import ModeIndicator from '@/components/ModeIndicator';
import PlayerToFindCard from '@/components/PlayerToFindCard';
import PlayerToFindInfo from '@/components/PlayerToFindInfo';
import TopBar from '@/components/TopBar';
import type {
  AnyOfficialGame,
  ExistingRandomGame,
  NoRandomGame,
  PlayerFullName,
  User,
} from '@/lib/types';
import { usePathname } from 'next/navigation';

type GamePageProps = {
  names: PlayerFullName[];
  scheduleId?: string;
  allowVeryHard?: boolean;
  userId?: User['id'];
} & (
  | {
      gameMode: 'random';
      game: ExistingRandomGame | NoRandomGame;
    }
  | {
      gameMode: 'official';
      game: AnyOfficialGame;
    }
);

export default function GamePage({
  gameMode,
  game,
  names,
  scheduleId,
  allowVeryHard,
  userId,
}: GamePageProps) {
  const pathname = usePathname();

  if (gameMode === 'random') {
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
      <div className="flex flex-col gap-4">
        <TopBar>
          <div className="flex gap-2">
            <HintsButton availableHints={availableHints} gameId={gameId} />
            <GiveUpButton gameId={gameId} userId={userId} />
          </div>
          <GuessForm names={names} />
        </TopBar>
        <ModeIndicator mode="random" allowVeryHard={allowVeryHard} />
        <PlayerToFindCard />
        <Guesses
          initialGuesses={guesses}
          initialObfuscatedHints={obfuscatedHints}
          initialHints={hints}
          playerToFindMatches={playerToFindMatches}
          mode={gameMode}
          playerDifficulty={playerDifficulty}
        />
        <GameOverConfetti />
        <GameOverModal gameId={gameId} userId={userId} />
      </div>
    );
  } else {
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
      <div className="flex flex-col gap-4">
        <TopBar>
          <div className="flex gap-2">
            <HintsButton availableHints={availableHints} gameId={gameId} />
            <GiveUpButton
              scheduleId={scheduleId}
              gameId={gameId}
              userId={userId}
            />
          </div>
          <GuessForm names={names} scheduleId={scheduleId} />
        </TopBar>
        <ModeIndicator mode="official" />
        <PlayerToFindInfo
          winnersCount={winnersCount}
          nextPlayerStartDate={
            pathname === '/' ? nextPlayerStartDate : undefined
          }
        />
        <PlayerToFindCard />
        <Guesses
          initialGuesses={guesses}
          initialHints={hints}
          initialObfuscatedHints={obfuscatedHints}
          playerToFindMatches={playerToFindMatches}
          mode={gameMode}
          playerDifficulty={playerDifficulty}
        />
        <GameOverConfetti />
        <GameOverModal gameId={gameId} userId={userId} />
      </div>
    );
  }
}
