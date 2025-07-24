import Bold from '@/components/Bold';
import ExternalLink from '@/components/ui/ExternalLink';
import { Card, CardContent } from '@/components/ui/card';
import type { Metadata } from 'next';

export const metadata: Metadata = { title: 'Contact' };

export default function Contact() {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 text-pretty">
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Contact</h2>
          <p>
            Feel free to send me an email at{' '}
            <ExternalLink href="mailto:michal@dziubany.dev">
              michal@dziubany.dev
            </ExternalLink>{' '}
            if:
          </p>
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
              you found the difficulty level of a darts player far removed from
              reality (I tried my best, though!);
            </li>
            <li>
              you would like to report any missing darts players as there are
              still many acknowledged players to add; or
            </li>
            <li>you simply would like to contact me for other reasons.</li>
          </ul>
          <p>Any feedback will be appreciated.</p>
          <p>
            Alternatively, you can submit a GitHub issue{' '}
            <ExternalLink href="https://github.com/dziubenzo/guesseye/issues/new">
              at this link
            </ExternalLink>
            .
          </p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Data Sources</h2>
          <p>
            I used the following sources of data to collect information about
            darts players:
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
              <ExternalLink href="https://www.dartsrec.com/power-rankings">
                DartsRec
              </ExternalLink>{' '}
              for Elo rankings;
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
            <li>Facebook, X, TikTok, and YouTube; and</li>
            <li>the good old Google search engine.</li>
          </ul>
          <p>You are encouraged to use them to help you in your guesses!</p>
        </section>
        <section className="flex flex-col gap-4">
          <h2 className="text-2xl font-medium">Acknowledgements</h2>
          <p>
            I&apos;d like to thank my friend <Bold>Marcin Grupiński</Bold> (
            <ExternalLink href="https://x.com/marcingrupinski">
              his X
            </ExternalLink>
            ) for sharing with me a couple of data sources on darts players,
            without which it would have been very difficult to find relevant
            information on some darts players. He actively makes contributions
            to the{' '}
            <ExternalLink href="https://world-of-darts.fandom.com/wiki/World_of_Darts_Wiki">
              World of Darts Wiki
            </ExternalLink>{' '}
            listed above.
          </p>
        </section>
      </CardContent>
    </Card>
  );
}
