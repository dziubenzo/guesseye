import GameOverConfetti from '@/components/GameOverConfetti';
import Guesses from '@/components/Guesses';
import PlayerForm from '@/components/PlayerForm';
import PlayerToFindCard from '@/components/PlayerToFindCard';

export default function Home() {
  return (
    <>
      <PlayerForm />
      <PlayerToFindCard />
      <Guesses />
      <GameOverConfetti />
    </>
  );
}
