'use client';

import PlayerCard from '@/components/PlayerCard';
import { Progress } from '@/components/ui/progress';
import { ALL_MATCHES } from '@/lib/constants';
import { useGameStore } from '@/lib/game-store';
import { useUpdateProgressBar } from '@/lib/hooks';
import type { Player } from '@/lib/types';

type PlayerToFindCardProps = {
  difficulty: Player['difficulty'];
};

export default function PlayerToFindCard({
  difficulty,
}: PlayerToFindCardProps) {
  const { playerToFind, playerToFindMatches } = useGameStore();
  const fieldsFound = useUpdateProgressBar();

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl opacity-50 text-center">Fields Found</h1>
      <div className="flex justify-center items-center gap-2">
        <span>{fieldsFound}</span>
        <Progress
          className="w-[75vw] md:w-xl h-4"
          value={(fieldsFound / ALL_MATCHES) * 100}
        />
        <span>{ALL_MATCHES}</span>
      </div>
      <PlayerCard
        type={'playerToFind'}
        player={playerToFind ? playerToFind : playerToFindMatches}
        difficulty={difficulty}
      />
    </div>
  );
}
