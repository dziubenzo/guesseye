import PlayerCard from '@/components/PlayerCard';
import PlayerForm from '@/components/PlayerForm';
import { getPlayers } from '@/server/db/get-players';

export default async function Home() {
  const players = await getPlayers();

  if (players.length === 0) {
    return null;
  }

  return (
    <>
      <PlayerForm />
      {players.map((player) => (
        <PlayerCard key={player.id} player={player} />
      ))}
    </>
  );
}
