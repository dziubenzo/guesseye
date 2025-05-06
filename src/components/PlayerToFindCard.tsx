'use client';

import { Progress } from '@/components/ui/progress';
import { ALL_MATCHES } from '@/lib/constants';
import { useGameStore } from '@/lib/game-store';
import { useUpdateProgressBar } from '@/lib/hooks';
import type { Player } from '@/lib/types';
import PlayerCard from './PlayerCard';

type PlayerToFindCardProps = {
  difficulty: Player['difficulty'];
};

export default function PlayerToFindCard({
  difficulty,
}: PlayerToFindCardProps) {
  const { playerToFind, playerToFindMatches } = useGameStore();
  const [fieldsFound] = useUpdateProgressBar();

  return (
    <>
      <h1 className="text-2xl opacity-50">Player To Find</h1>
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
    </>
  );
}
