import GamesByDayChart from '@/components/GamesByDayChart';
import GuessFrequencyChart from '@/components/GuessFrequencyChart';
import GuessesByDayChart from '@/components/GuessesByDayChart';
import Stat from '@/components/Stat';
import Tooltip from '@/components/Tooltip';
import { Separator } from '@/components/ui/separator';
import { formatGameDuration } from '@/lib/utils';
import { getUserStats } from '@/server/db/get-user-stats';
import { notFound } from 'next/navigation';

export default async function UserStats() {
  const stats = await getUserStats();

  if ('error' in stats) {
    return notFound();
  }

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
    randomGamesPlayed,
    randomModeWins,
    randomModeWinsPercentage,
    randomModeGiveUps,
    randomModeGiveUpsPercentage,
  } = stats.games;

  const { fastestWin, slowestWin } = stats.games.duration;

  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8">
        <div className="flex justify-center mt-4 md:mt-8">
          <h1 className="text-xl md:text-4xl font-medium text-center px-0 py-2 relative">
            Most Frequent Guesses
          </h1>
          <div>
            <Tooltip>
              Your most frequently guessed players in a game in any mode
              (limited to 90 players).
            </Tooltip>
          </div>
        </div>
        <GuessFrequencyChart data={stats.guessFrequency} />
        <Separator />
        <div className="flex justify-center">
          <h1 className="text-xl md:text-4xl font-medium text-center px-0 py-2 relative">
            Guesses By Day
          </h1>
          <div>
            <Tooltip>
              Your guesses in a game in any mode by day (last 90 days).
            </Tooltip>
          </div>
        </div>
        <GuessesByDayChart data={stats.guessesByDay} />
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Guesses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center p-2">
          <Stat title="Total Guesses" value={totalGuesses}>
            All guesses you have made in any mode.
          </Stat>
          <Stat title="Fewest Guesses" value={fewestGuesses}>
            The minimum number of guesses you needed to win a game in any mode.
          </Stat>
          <Stat title="Most Guesses" value={mostGuesses}>
            The maximum number of guesses you needed to win a game in any mode.
          </Stat>
          <Stat title="Avg. Guesses" value={avgGuesses}>
            The average number of guesses you made in any game (won/given up/in
            progress) in any mode.
          </Stat>
          <Stat title="Avg. Guesses To Win" value={avgGuessesToWin}>
            The average number of guesses it takes you to win a game in any
            mode.
          </Stat>
          <Stat title="Avg. Guesses To Give Up" value={avgGuessesToGiveUp}>
            The average number of guesses you made before giving up on a game in
            any mode.
          </Stat>
        </div>
        <Separator />
        <div className="flex justify-center">
          <h1 className="text-xl md:text-4xl font-medium text-center px-0 py-2 relative">
            Games By Day
          </h1>
          <div>
            <Tooltip>
              Games won/given up in any mode by day (last 90 days).
            </Tooltip>
          </div>
        </div>
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
            The number of games won/given up/in progress in the random mode.
          </Stat>
          <Stat title="Random Mode Wins" value={randomModeWins}>
            The number of games won in the random mode.
          </Stat>
          <Stat
            title="Random Mode Wins %"
            value={`${randomModeWinsPercentage + '%'}`}
          >
            The percentage of games won in the random mode compared to all
            random mode games.
          </Stat>
          <Stat title="Random Mode Give Ups" value={randomModeGiveUps}>
            The number of games given up in the random mode.
          </Stat>
          <Stat
            title="Random Mode Give Ups %"
            value={`${randomModeGiveUpsPercentage + '%'}`}
          >
            The percentage of games given up in the random mode compared to all
            random mode games.
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
          <Stat title="First Guess" value={firstOfficialGuess}>
            Your first guess in a game in an official mode.
          </Stat>
          <Stat title="Latest Guess" value={latestOfficialGuess}>
            Your latest guess in a game in an official mode.
          </Stat>
          <Stat title="First Winning Guess" value={firstOfficialWin}>
            Your first guess that won you a game in an official mode.
          </Stat>
          <Stat title="Latest Winning Guess" value={latestOfficialWin}>
            Your latest guess that won you a game in an official mode.
          </Stat>
        </div>
      </div>
    </div>
  );
}
