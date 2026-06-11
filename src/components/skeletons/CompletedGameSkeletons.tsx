import {
  BackButtonWrapper,
  GameDetailsWrapper,
  PlayerToFindWrapper,
} from '@/components/CompletedGame';
import GameDetail from '@/components/GameDetail';
import { PlayerCardSkeleton } from '@/components/skeletons/GamePageSkeletons';
import InlineSkeleton from '@/components/skeletons/InlineSkeleton';
import { Skeleton } from '@/components/ui/skeleton';

export default function CompletedGameSkeleton() {
  return (
    <>
      <BackButtonSkeleton />
      <GameDetailsSkeleton />
      <PlayerToFindWrapper>
        <PlayerCardSkeleton type="completedGame" />
      </PlayerToFindWrapper>
    </>
  );
}

function BackButtonSkeleton() {
  return (
    <BackButtonWrapper>
      <Skeleton className="w-42.5 h-9" />
    </BackButtonWrapper>
  );
}

function GameDetailsSkeleton() {
  return (
    <GameDetailsWrapper>
      <GameDetail title="Game No.">
        <InlineSkeleton className="h-7 sm:h-8 w-full p-0" fill={999} />
      </GameDetail>
      <GameDetail title="Completed By">
        <InlineSkeleton className="h-7 sm:h-8 w-full p-0" fill="Test User" />
      </GameDetail>
      <GameDetail title="Game Mode">
        <InlineSkeleton className="h-7 sm:h-8 w-full p-0" fill="Official" />
      </GameDetail>
      <GameDetail title="Game Status">
        <InlineSkeleton className="h-7 sm:h-8 w-full p-0" fill="Won" />
      </GameDetail>
      <GameDetail title="Started At">
        <InlineSkeleton
          className="h-7 sm:h-8 w-full p-0"
          fill="09:23 (10 Jun 2026)"
        />
      </GameDetail>
      <GameDetail title="Completed At">
        <InlineSkeleton
          className="h-7 sm:h-8 w-full p-0"
          fill="21:37 (11 Jun 2026)"
        />
      </GameDetail>
      <GameDetail title="Guesses Made">
        <InlineSkeleton className="h-7 sm:h-8 w-full p-0" fill={10} />
      </GameDetail>
      <GameDetail title="Hints Revealed">
        <InlineSkeleton className="h-7 sm:h-8 w-full p-0" fill={3} />
      </GameDetail>
    </GameDetailsWrapper>
  );
}
