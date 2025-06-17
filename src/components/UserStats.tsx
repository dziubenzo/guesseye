import ChartHeading from '@/components/ChartHeading';
import GamesByDayChart from '@/components/charts/GamesByDayChart';
import GuessesByDayChart from '@/components/charts/GuessesByDayChart';
import GuessFrequencyChart from '@/components/charts/GuessFrequencyChart';
import Stat from '@/components/Stat';
import { Separator } from '@/components/ui/separator';
import type { UserStats } from '@/lib/types';
import { formatGameDuration } from '@/lib/utils';

type UserStatsProps = {
  stats: UserStats;
};

export default async function UserStats({ stats }: UserStatsProps) {
  const {
    fewestGuesses,
    mostGuesses,
    avgGuesses,
    avgGuessesToWin,
    avgGuessesToGiveUp,
    totalGuesses,
  } = stats.guesses;

  const {
    firstOfficialGuess,
    firstOfficialWin,
    latestOfficialGuess,
    latestOfficialWin,
  } = stats.players;

  const {
    officialGamesPlayed,
    officialGamesPlayedPercentage,
    officialGamesCompleted,
    officialGamesCompletedPercentage,
    officialModeWins,
    officialModeWinsPercentage,
    officialModeGiveUps,
    officialModeGiveUpsPercentage,
  } = stats.games.official;

  const {
    randomGamesPlayed,
    randomModeWins,
    randomModeWinsPercentage,
    randomModeGiveUps,
    randomModeGiveUpsPercentage,
  } = stats.games.random;

  const { fastestWin, slowestWin } = stats.games.duration;

  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8 mt-4 md:mt-8">
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Guesses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center p-2">
          <div className="grid grid-cols-1 md:grid-cols-1 md:col-span-3 gap-8">
            <Stat title="Total Guesses" value={totalGuesses}>
              All guesses you made in any mode.
            </Stat>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-3 gap-8">
            <Stat title="Fewest Guesses To Win" value={fewestGuesses}>
              The minimum number of guesses you needed to win a game in any
              mode.
            </Stat>
            <Stat title="Most Guesses To Win" value={mostGuesses}>
              The maximum number of guesses you needed to win a game in any
              mode.
            </Stat>
          </div>
          <Stat title="Avg. Guesses" value={avgGuesses}>
            The average number of guesses you make in any game (won/given up/in
            progress) in any mode.
          </Stat>
          <Stat title="Avg. Guesses To Win" value={avgGuessesToWin}>
            The average number of guesses it takes you to win a game in any
            mode.
          </Stat>
          <Stat title="Avg. Guesses To Give Up" value={avgGuessesToGiveUp}>
            The average number of guesses you make before giving up on a game in
            any mode.
          </Stat>
        </div>
        <Separator />
        <ChartHeading title="Most Frequent Guesses">
          Your most frequently guessed players in a game in any mode (limited to
          30 players).
        </ChartHeading>
        <GuessFrequencyChart data={stats.guessFrequency} />
        <Separator />
        <ChartHeading title="Guesses By Day">
          Your guesses in a game in any mode by day (last 30 days).
        </ChartHeading>
        <GuessesByDayChart data={stats.guessesByDay} />
        <Separator />
        <ChartHeading title="Games By Day">
          Games that you won/gave up on in any mode by day (last 30 days).
        </ChartHeading>
        <GamesByDayChart data={stats.gamesByDay} />
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Games - Official Mode
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat title="Official Games Played" value={officialGamesPlayed}>
            The number of games won/given up/in progress in the official mode.
          </Stat>
          <Stat
            title="Official Games Played %"
            value={`${officialGamesPlayedPercentage + '%'}`}
          >
            The percentage of games won/given up/in progress in the official
            mode compared to all official mode games.
          </Stat>
          <Stat title="Official Games Completed" value={officialGamesCompleted}>
            The number of games won and given up in the official mode.
          </Stat>
          <Stat
            title="Official Games Completed %"
            value={`${officialGamesCompletedPercentage + '%'}`}
          >
            The percentage of games won and given up in the official mode
            compared to all official mode games.
          </Stat>
          <Stat title="Official Mode Wins" value={officialModeWins}>
            The number of games won in the official mode.
          </Stat>
          <Stat
            title="Official Mode Wins %"
            value={`${officialModeWinsPercentage + '%'}`}
          >
            The percentage of games won in the official mode compared to all
            official mode games.
          </Stat>
          <Stat title="Official Mode Give Ups" value={officialModeGiveUps}>
            The number of games given up in the official mode.
          </Stat>
          <Stat
            title="Official Mode Give Ups %"
            value={`${officialModeGiveUpsPercentage + '%'}`}
          >
            The percentage of games given up in the official mode compared to
            all official mode games.
          </Stat>
        </div>
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Games - Random Mode
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat
            className="md:col-span-2"
            title="Random Games Played"
            value={randomGamesPlayed}
          >
            The number of games you won/given up/in progress in the random mode.
          </Stat>
          <Stat title="Random Mode Wins" value={randomModeWins}>
            The number of games you won in the random mode.
          </Stat>
          <Stat
            title="Random Mode Wins %"
            value={`${randomModeWinsPercentage + '%'}`}
          >
            The percentage of games you won in the random mode compared to all
            random mode games.
          </Stat>
          <Stat title="Random Mode Give Ups" value={randomModeGiveUps}>
            The number of games you gave up on in the random mode.
          </Stat>
          <Stat
            title="Random Mode Give Ups %"
            value={`${randomModeGiveUpsPercentage + '%'}`}
          >
            The percentage of games you gave up on in the random mode compared
            to all random mode games.
          </Stat>
        </div>
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Games - Duration
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat
            title="Fastest Win"
            value={fastestWin ? formatGameDuration(fastestWin) : undefined}
          >
            Your fastest win in a game in any mode (limited to 1 hour).
          </Stat>
          <Stat
            title="Slowest Win"
            value={slowestWin ? formatGameDuration(slowestWin) : undefined}
          >
            Your slowest win in a game in any mode (limited to 1 hour).
          </Stat>
        </div>
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          First and Latest
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat title="First Official Guess" value={firstOfficialGuess}>
            Your first guess in a game in the official mode.
          </Stat>
          <Stat title="Latest Official Guess" value={latestOfficialGuess}>
            Your latest guess in a game in the official mode.
          </Stat>
          <Stat title="First Winning Official Guess" value={firstOfficialWin}>
            Your first guess that won you a game in the official mode.
          </Stat>
          <Stat title="Latest Winning Official Guess" value={latestOfficialWin}>
            Your latest guess that won you a game in the official mode.
          </Stat>
        </div>
      </div>
    </div>
  );
}
