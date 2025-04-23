import PlayerCard from '@/components/PlayerCard';
import PlayerForm from '@/components/PlayerForm';
import { getRatajski } from '@/server/db/get-ratajski';

export default async function Home() {
  const player = await getRatajski();

  if (!player) {
    return null;
  }

  return (
    <>
      <PlayerForm />
      <PlayerCard player={player} />
    </>
  );
}
