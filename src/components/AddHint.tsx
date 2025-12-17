import AddHintForm from '@/components/AddHintForm';
import type { PlayerAdmin } from '@/lib/types';

type AddHintProps = {
  players: PlayerAdmin[];
};

export default async function AddHint({ players }: AddHintProps) {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-xl font-medium">Add Hint</h1>
      <AddHintForm players={players} location="adminPage" />
    </div>
  );
}
