import AddHintForm from '@/components/AddHintForm';
import Bold from '@/components/Bold';
import ColouredWord from '@/components/ColouredWord';
import Italic from '@/components/Italic';
import Logo from '@/components/Logo';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { auth } from '@/lib/auth';
import { getHintCount } from '@/server/db/get-hint-count';
import { getPlayersSuggestHint } from '@/server/db/get-players-suggest-hint';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';

export const metadata: Metadata = { title: 'Suggest Hint' };

export default async function Leaderboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [players, { totalHintCount, playerHintCount }] = await Promise.all([
    getPlayersSuggestHint(),
    getHintCount(),
  ]);

  if (!session) {
    return notFound();
  }

  return (
    <div className="flex flex-col grow-1">
      <Card className="grow-1 gap-0">
        <CardHeader>
          <CardTitle className="text-2xl">Suggest Hint</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm/6 sm:text-base/6">
          <div>
            <p>
              There are{' '}
              <ColouredWord colour="green" className="text-base sm:text-lg">
                {totalHintCount}
              </ColouredWord>{' '}
              hints for{' '}
              <ColouredWord colour="green" className="text-base sm:text-lg">
                {playerHintCount}
              </ColouredWord>{' '}
              darts players available at the moment.
            </p>
            <p>
              You are welcome to contribute to the game by suggesting a hint.
            </p>
          </div>
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
            Once a hint is reviewed and accepted, your <Bold>name</Bold> will be
            shown together with the hint when it is revealed by anyone.
          </p>
          <p>Any contributions will be appreciated.</p>
          <h2 className="font-semibold text-2xl text-card-foreground">
            Suggest Hint Form
          </h2>
          <AddHintForm players={players} location="suggestHintPage" />
        </CardContent>
      </Card>
    </div>
  );
}
