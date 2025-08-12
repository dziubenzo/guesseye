import Bold from '@/components/Bold';
import Italic from '@/components/Italic';
import Logo from '@/components/Logo';
import { Card, CardContent } from '@/components/ui/card';
import ExternalLink from '@/components/ExternalLink';
import { auth } from '@/lib/auth';
import { getMidnightUTC } from '@/lib/utils';
import { format } from 'date-fns';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import Link from 'next/link';

export const metadata: Metadata = { title: 'About' };

export default async function About() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 text-pretty">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">About</h2>
          <p>
            <Logo /> was inspired by{' '}
            <ExternalLink href="https://trackmadle.gearfive.org">
              a conceptually similar guessing game for Trackmania players
            </ExternalLink>
            , which was further loosely inspired by Wordle. However, I wanted to
            take the concept to another level and make it focused on the game of
            darts I&apos;ve been playing on and off for more than 10 years and I
            really enjoy.
          </p>
          <p>
            I&apos;ve spent a <Italic>lot</Italic> of time adding darts players
            to the database and finding information about them, so my goal is to
            maintain the database as up-to-date as possible. For example, you
            can expect PDC/WDF ranking and Tour Card Holder information to be
            very accurate as I&apos;ve developed some tiny tools to automate
            updating it. You can also expect updated best results after the
            PDC/WDF World Championship and UK Open every year.
          </p>
          <p>
            Still, some information will, inevitably, be updated on a
            case-by-case basis (such as any changes to darts or status). See the{' '}
            <Link
              className="font-medium underline underline-offset-2"
              href="/contact"
            >
              Contact page
            </Link>{' '}
            if you&apos;ve encountered any inaccurate information.
          </p>
          <p>
            <Logo /> is and will continue to be{' '}
            <Bold>100% free and open-source</Bold> and you can find it on{' '}
            <ExternalLink href="https://github.com/dziubenzo/guesseye">
              GitHub
            </ExternalLink>
            . You can see it as a modest contribution to darts from a fan of the
            sport.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Game Mechanics</h2>
          <p>
            Your goal is extremely simple:{' '}
            <Bold>guess the right darts player in as few tries as you can</Bold>
            . There is no limit on the number of tries. Don&apos;t expect it to
            be easy, though.
          </p>
          <p>
            Every darts player is comprised of 22 fields containing information
            about them. Most of the fields have tooltips explaining what they
            mean.
          </p>
          <p>
            All darts players are assigned a <Bold>difficulty level</Bold>, so
            you can know what to expect beforehand.
          </p>
          <p>
            When you start a game, all fields are grey. Once you make a guess, a
            field can:
          </p>
          <ul className="list-disc list-inside">
            <li>
              stay{' '}
              <span className="p-1 bg-muted-foreground text-primary-foreground dark:text-black rounded-sm">
                grey
              </span>{' '}
              if the guessed player&apos;s field is not the same as the darts
              player to find&apos;s field, and <Bold>cannot be compared </Bold>
              (fields such as Country or Status);
            </li>
            <li>
              turn{' '}
              <span className="p-1 bg-good-guess text-primary-foreground dark:text-black rounded-sm">
                green
              </span>{' '}
              if the guessed player&apos;s field is the same as the darts player
              to find&apos;s field;
            </li>
            <li className="sm:mt-1.5">
              turn{' '}
              <span className="p-1 bg-wrong-guess text-primary-foreground dark:text-black rounded-sm">
                red
              </span>{' '}
              if the guessed player&apos;s field is not the same as the darts
              player to find&apos;s field, but <Bold>can be compared</Bold>{' '}
              (fields such as Age or Best Result) (yes, Best Result fields are
              comparable).
            </li>
          </ul>
          <p>
            This continues until you either guess the right darts player (you
            win, GG!) or give up on your game, resulting in the darts player to
            find being revealed to you.
          </p>
          <p>
            You will notice some <Bold>small arrows</Bold> next to values in
            comparable fields (turning{' '}
            <span className="p-1 bg-wrong-guess text-primary-foreground dark:text-black rounded-sm">
              red
            </span>
            ). They are there to tell you that the value in a field to find
            should be <Bold>higher/lower</Bold> (or <Bold>better/worse</Bold>{' '}
            for Best Result fields) compared to the value in your guess. If you
            are confused about what the arrow tries to tell you (it can be
            confusing for rankings, for example), you can also click or tap it
            to tell you exactly what type of value is expected.
          </p>
          <p>
            To make the game <Italic>slightly</Italic> easier, comparable fields
            show the{' '}
            <Bold>closest value based on all of your previous guesses</Bold>.
            Let&apos;s say your darts player to find is 32 years old, and your
            previous guesses were darts players aged 57, 34, and 28. The closest
            value is 34, and that&apos;s the value you will see in the field. If
            your next guess happens to be a 33-year-old darts player, the field
            will be updated to this new closest value.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Game Modes</h2>
          <p>
            <Logo /> features two game modes:
          </p>
          <ul className="list-disc list-inside">
            <li>
              <Bold>official mode</Bold>, where a hand-picked darts player is
              available for you to find. It changes every single day at midnight
              UTC (which is {format(getMidnightUTC(), 'hh:mm a')} for you);
            </li>
            <li>
              <Bold>random mode</Bold>, where a darts player is selected for you
              at random, with the game ending only when you either guess the
              right darts player or give up on your game.
            </li>
          </ul>
          {!session && (
            <>
              <p>
                As you are not logged in, the only game mode available to you is
                the <Bold>random mode</Bold>, and it&apos;s a bit easier
                compared to the random mode for logged-in users. Also, your
                ongoing game might disappear when you update your browser or it
                auto-updates.
              </p>
              <section className="flex flex-col gap-4">
                <h2 className="text-2xl font-medium">Why Should I Sign Up?</h2>
                <p>
                  If you find <Logo /> fun, you might consider signing up for
                  extra and completely free features. They include:
                </p>
                <ul className="list-disc list-inside">
                  <li>
                    playing the current official mode game, as well as{' '}
                    <Bold>
                      all previous official mode games whenever you want
                    </Bold>
                    ;
                  </li>
                  <li>
                    playing random mode games where you can additionally
                    encounter darts players of hard difficulty;
                  </li>
                  <li>
                    competing on the <Bold>leaderboard</Bold> where users are
                    ranked based on their official and random mode wins and give
                    ups;
                  </li>
                  <li>
                    discovering the <Bold>official mode history</Bold>, which
                    shows how many users found the right darts player in all
                    previous official mode games, who did it first, the fastest,
                    and in fewest tries;
                  </li>
                  <li>
                    access to both your and global <Bold>game stats</Bold>,
                    showing, for example, most frequent guesses, games by day,
                    or darts players that others found/give up on in the random
                    mode;
                  </li>
                  <li>
                    access to various charts related to{' '}
                    <Bold>all darts players featured in the database</Bold>,
                    where you can, for example, learn which darts brand is used
                    the most among the best in the sport or how many left-handed
                    darts players play or played top-level darts.
                  </li>
                </ul>
              </section>
            </>
          )}
        </section>
      </CardContent>
    </Card>
  );
}
