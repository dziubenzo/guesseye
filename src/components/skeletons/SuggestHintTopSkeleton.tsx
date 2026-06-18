import InlineSkeleton from '@/components/skeletons/InlineSkeleton';

export default function SuggestHintTopSkeleton() {
  return (
    <div>
      <p>
        There are <InlineSkeleton className="text-base sm:text-lg" fill={999} />{' '}
        approved hints for{' '}
        <InlineSkeleton className="text-base sm:text-lg" fill={999} /> darts
        players available at the moment.
      </p>
      <p>You are welcome to contribute to the game by suggesting a hint.</p>
    </div>
  );
}
