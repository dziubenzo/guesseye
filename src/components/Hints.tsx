import HintsForm from '@/components/HintsForm';
import type { PlayerAdmin } from '@/lib/types';

type HintsProps = {
  players: PlayerAdmin[];
};

export default async function Hints({ players }: HintsProps) {
  return (
    <div className="flex flex-col gap-2">
      <h1 className="text-xl font-medium">Add Hint</h1>
      <HintsForm players={players} location="adminPage" />
    </div>
  );
}
