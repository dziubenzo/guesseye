export default function SuggestHintTopSkeleton() {
  return (
    <div>
      <p>
        There are <InlineSkeleton fill={999} /> hints for{' '}
        <InlineSkeleton fill={999} /> darts players available at the moment.
      </p>
      <p>You are welcome to contribute to the game by suggesting a hint.</p>
    </div>
  );
}

type InlineSkeletonProps = {
  fill: number;
};

function InlineSkeleton({ fill }: InlineSkeletonProps) {
  return (
    <span
      className="p-1 animate-pulse rounded-md bg-muted-foreground text-muted-foreground text-base sm:text-lg select-none"
      aria-hidden="true"
    >
      {fill}
    </span>
  );
}
