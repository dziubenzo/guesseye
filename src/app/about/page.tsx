import ExternalLink from '@/components/ui/ExternalLink';
import { Card, CardContent } from '@/components/ui/card';

export default function About() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 text-pretty">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">About GuessEye</h2>
          <p>
            GuessEye was inspired by{' '}
            <ExternalLink href="https://trackmadle.gearfive.org">
              a conceptually similar guessing game for Trackmania players
            </ExternalLink>
            , which was further loosely inspired by Wordle. However, I wanted to
            take the concept to another level and make it focused on the game of
            darts I&apos;ve been playing on and off for more than 10 years and I
            really enjoy.
          </p>
          <p>
            I&apos;ve spent a <span className="italic">lot</span> of time adding
            darts players to the database and finding information about them, so
            my goal is to maintain the database as up-to-date as possible. For
            example, you can expect PDC/WDF ranking and Tour Card Holder
            information to be very accurate as I&apos;ve developed some tiny
            tools to automate updating it. You can also expect updated best
            results after the PDC/WDF World Championship and UK Open every year.
          </p>
          <p>
            Still, some information will, inevitably, be updated on a
            case-by-case basis (such as any changes to darts or status). See the
            Contact section below if you&apos;ve encountered any inaccurate
            information.
          </p>
          <p>
            GuessEye is and will continue to be{' '}
            <span className="font-medium">100% free and open-source</span> and
            you can find it on{' '}
            <ExternalLink href="https://github.com/dziubenzo/guesseye">
              GitHub
            </ExternalLink>
            . You can see it as a modest contribution to darts from a fan of the
            sport.
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Contact</h2>
          <p>If:</p>
          <ul className="list-disc list-inside">
            <li>
              you are a darts player featured here and would like to be removed
              from the database, or would like to provide any missing or
              up-to-date details about yourself;
            </li>
            <li>
              you would like to provide any missing or up-to-date information
              about any darts player;
            </li>
            <li>you found any bugs;</li>
            <li>
              you would like to report any missing darts players as there are
              still many acknowledged players to add;
            </li>
            <li>you simply would like to contact me for other reasons;</li>
          </ul>
          <p>
            feel free to send me an email at{' '}
            <ExternalLink href="mailto:michal@dziubany.dev">
              michal@dziubany.dev
            </ExternalLink>
            . Any feedback will be appreciated.
          </p>
          <p>
            Alternatively, you can submit a GitHub issue{' '}
            <ExternalLink href="https://github.com/dziubenzo/guesseye/issues/new">
              at this link
            </ExternalLink>
            .
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">
            Acknowledgements & Data Sources
          </h2>
          <p>
            I&apos;d like to thank my friend{' '}
            <span className="font-medium">Marcin Grupiński</span> (
            <ExternalLink href="https://x.com/marcingrupinski">
              X page
            </ExternalLink>
            ) for sharing with me a couple of data sources on darts players,
            without which it would have been very difficult to find relevant
            information on some darts players. He actively makes contributions
            to the{' '}
            <ExternalLink href="https://world-of-darts.fandom.com/wiki/World_of_Darts_Wiki">
              World of Darts Wiki
            </ExternalLink>
            , which I also utilised to create the database of darts players.
          </p>
          <p>
            With that said, I used the following sources of data to collect
            information about darts players:
          </p>
          <ul className="list-disc list-inside">
            <li>
              <ExternalLink href="https://www.dartsrankings.com/">
                Darts Rankings
              </ExternalLink>{' '}
              for PDC rankings;
            </li>
            <li>
              <ExternalLink href="https://dartswdf.com/rankings">
                WDF website
              </ExternalLink>{' '}
              for WDF rankings;
            </li>
            <li>
              <ExternalLink href="https://www.pdc.tv/">
                PDC website
              </ExternalLink>
              ;
            </li>
            <li>
              <ExternalLink href="https://www.dartn.de/">Dartn.de</ExternalLink>
              ;
            </li>
            <li>
              <ExternalLink href="https://mastercaller.com/">
                Mastercaller
              </ExternalLink>
              ;
            </li>
            <li>
              <ExternalLink href="https://pdpa.co.uk/">
                PDPA website
              </ExternalLink>
              ;
            </li>
            <li>
              <ExternalLink href="https://pdpa.co.uk/9-dart-club/">
                PDPA&apos;s 9 Dart Club
              </ExternalLink>
              ;
            </li>
            <li>
              <ExternalLink href="https://world-of-darts.fandom.com/wiki/World_of_Darts_Wiki">
                World of Darts Wiki
              </ExternalLink>
              ;
            </li>
            <li>
              <ExternalLink href="https://www.dartsdatabase.co.uk/">
                Darts Database
              </ExternalLink>
              ;
            </li>
            <li>numerous websites of darts manufacturers;</li>
            <li>numerous websites of sponsors of darts players;</li>
            <li>
              websites featuring, for example, interviews with darts players;
            </li>
            <li>English, German, and Dutch Wikipedia;</li>
            <li>Facebook, X, TikTok, and YouTube;</li>
            <li>and the good old Google search engine.</li>
          </ul>
        </section>
      </CardContent>
    </Card>
  );
}
