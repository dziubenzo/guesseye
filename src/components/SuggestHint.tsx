import AddHintForm from '@/components/AddHintForm';
import Bold from '@/components/Bold';
import ColouredWord from '@/components/ColouredWord';
import Italic from '@/components/Italic';
import Logo from '@/components/Logo';
import AddHintFormSkeleton from '@/components/skeletons/AddHintFormSkeleton';
import SuggestHintTopSkeleton from '@/components/skeletons/SuggestHintTopSkeleton';
import { CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Session } from '@/lib/auth';
import type { HintCounts } from '@/lib/types';
import { getHintCounts } from '@/server/db/get-hint-counts';
import { getPlayersSuggestHint } from '@/server/db/get-players-suggest-hint';
import { notFound } from 'next/navigation';
import { Suspense, use } from 'react';

type SuggestHintProps = {
  sessionPromise: Promise<Session | null>;
};

export default function SuggestHint({ sessionPromise }: SuggestHintProps) {
  const session = use(sessionPromise);

  if (!session) {
    return notFound();
  }

  const hintCountsPromise = getHintCounts();
  const playersPromise = getPlayersSuggestHint();

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Suggest Hint</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
        <Suspense fallback={<SuggestHintTopSkeleton />}>
          <SuggestHintTop hintCountsPromise={hintCountsPromise} />
        </Suspense>
        <h2 className="font-semibold text-2xl text-card-foreground">
          What makes a good hint?
        </h2>
        <ul className="list-decimal list-inside">
          <li>
            It should only point a <Logo /> user{' '}
            <Bold>in the right direction</Bold>;
          </li>
          <li>
            It shouldn&apos;t refer directly to any fields found on the{' '}
            <Bold>Player Card</Bold> (including gender, use{' '}
            <Italic>they...</Italic> or <Italic>a darts player...</Italic>);
          </li>
          <li>
            It can point to darts player&apos;s <Bold>achievements</Bold> as
            long as they are not UK Open or BDO/WDF/PDC World Championship
            related (see Point 2);
          </li>
          <li>
            It can tell a <Bold>fun fact</Bold> about a darts player;
          </li>
          <li>
            It can hint at a darts player&apos;s{' '}
            <Bold>nickname, walk-on song</Bold>, etc.
          </li>
        </ul>
        <p>
          Once a hint is reviewed and approved, your <Bold>name</Bold> will be
          shown together with the hint when it is revealed by anyone.
        </p>
        <p>Any contributions will be appreciated.</p>
        <h2 className="font-semibold text-2xl text-card-foreground">
          Suggest Hint Form
        </h2>
        <Suspense fallback={<AddHintFormSkeleton />}>
          <AddHintForm
            playersPromise={playersPromise}
            location="suggestHintPage"
          />
        </Suspense>
      </CardContent>
    </>
  );
}

type SuggestHintTopProps = {
  hintCountsPromise: Promise<HintCounts>;
};

function SuggestHintTop({ hintCountsPromise }: SuggestHintTopProps) {
  const { totalHintCount, playerHintCount } = use(hintCountsPromise);

  return (
    <div>
      <p>
        There are{' '}
        <ColouredWord colour="green" className="text-base sm:text-lg">
          {totalHintCount}
        </ColouredWord>{' '}
        approved hints for{' '}
        <ColouredWord colour="green" className="text-base sm:text-lg">
          {playerHintCount}
        </ColouredWord>{' '}
        darts players available at the moment.
      </p>
      <p>You are welcome to contribute to the game by suggesting a hint.</p>
    </div>
  );
}
