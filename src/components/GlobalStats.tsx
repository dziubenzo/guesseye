import ChartHeading from '@/components/ChartHeading';
import GamesByDayChart from '@/components/charts/GamesByDayChart';
import GuessesByDayChart from '@/components/charts/GuessesByDayChart';
import GuessFrequencyChart from '@/components/charts/GuessFrequencyChart';
import RandomPlayersChart from '@/components/charts/RandomPlayersChart';
import Stat from '@/components/Stat';
import { Separator } from '@/components/ui/separator';
import type { GlobalStats } from '@/lib/types';

type GlobalStatsProps = {
  stats: GlobalStats;
};

export default async function GlobalStats({ stats }: GlobalStatsProps) {
  const {
    fewestGuesses,
    mostGuesses,
    avgGuesses,
    avgGuessesUser,
    avgGuessesGuest,
    avgGuessesToWin,
    avgGuessesToWinUser,
    avgGuessesToWinGuest,
    avgGuessesToGiveUp,
    avgGuessesToGiveUpUser,
    avgGuessesToGiveUpGuest,
    totalGuesses,
    totalGuessesUser,
    totalGuessesGuest,
  } = stats.guesses;

  const {
    latestOfficialGuess,
    latestOfficialGuessName,
    latestOfficialGuessTime,
    latestRandomGuess,
    latestRandomGuessName,
    latestRandomGuessTime,
  } = stats.players;

  const {
    officialGamesPlayed,
    officialGamesCompleted,
    officialModeWins,
    officialModeGiveUps,
    officialModeHintsRevealed,
    officialModeHintsRevealedPercentage,
  } = stats.games.official;

  const {
    randomGamesPlayed,
    randomGamesCompleted,
    randomModeWins,
    randomModeGiveUps,
    randomModeHintsRevealed,
    randomModeHintsRevealedPercentage,
    randomGamesPlayedUser,
    randomGamesCompletedUser,
    randomModeWinsUser,
    randomModeGiveUpsUser,
    randomModeHintsRevealedUser,
    randomModeHintsRevealedPercentageUser,
    randomGamesPlayedGuest,
    randomGamesCompletedGuest,
    randomModeWinsGuest,
    randomModeGiveUpsGuest,
    randomModeHintsRevealedGuest,
    randomModeHintsRevealedPercentageGuest,
  } = stats.games.random;

  return (
    <div>
      <div className="flex flex-col gap-4 md:gap-8 mt-4 md:mt-8">
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Guesses
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center p-2">
          <div className="grid grid-cols-1 md:grid-cols-2 md:col-span-3 gap-8">
            <Stat title="Fewest Guesses To Win" value={fewestGuesses}>
              The lowest number of guesses needed to win a game in any mode by
              either a user or a guest.
            </Stat>
            <Stat title="Most Guesses To Win" value={mostGuesses}>
              The highest number of guesses needed to win a game in any mode by
              either a user or a guest.
            </Stat>
          </div>
          <Stat title="Total Guesses" value={totalGuesses}>
            All guesses made by both users and guests in any mode.
          </Stat>
          <Stat title="Total Guesses (Users)" value={totalGuessesUser}>
            All guesses made by users in any mode.
          </Stat>
          <Stat title="Total Guesses (Guests)" value={totalGuessesGuest}>
            All guesses made by guests in the random mode.
          </Stat>
          <Stat title="Avg. Guesses" value={avgGuesses}>
            The average number of guesses made by both users and guests in any
            game (won/given up/in progress) in any mode.
          </Stat>
          <Stat title="Avg. Guesses (Users)" value={avgGuessesUser}>
            The average number of guesses made by users in any game (won/given
            up/in progress) in any mode.
          </Stat>
          <Stat title="Avg. Guesses (Guests)" value={avgGuessesGuest}>
            The average number of guesses made by guests in any game (won/given
            up/in progress) in the random mode.
          </Stat>
          <Stat title="Avg. Guesses To Win" value={avgGuessesToWin}>
            The average number of guesses it takes both users and guests to win
            a game in any mode.
          </Stat>
          <Stat title="Avg. Guesses To Win (Users)" value={avgGuessesToWinUser}>
            The average number of guesses it takes users to win a game in any
            mode.
          </Stat>
          <Stat
            title="Avg. Guesses To Win (Guests)"
            value={avgGuessesToWinGuest}
          >
            The average number of guesses it takes guests to win a game in the
            random mode.
          </Stat>
          <Stat title="Avg. Guesses To Give Up" value={avgGuessesToGiveUp}>
            The average number of guesses made by both users and guests before
            giving up on a game in any mode.
          </Stat>
          <Stat
            title="Avg. Guesses To Give Up (Users)"
            value={avgGuessesToGiveUpUser}
          >
            The average number of guesses made by users before giving up on a
            game in any mode.
          </Stat>
          <Stat
            title="Avg. Guesses To Give Up (Guests)"
            value={avgGuessesToGiveUpGuest}
          >
            The average number of guesses made by guests before giving up on a
            game in the random mode.
          </Stat>
        </div>
        <Separator />
        <ChartHeading title="Most Frequent Guesses">
          Most frequently guessed players by both users and guests in a game in
          any mode (limited to 30 players).
        </ChartHeading>
        <GuessFrequencyChart data={stats.guessFrequency} />
        <Separator />
        <ChartHeading title="Guesses By Day">
          Guesses by both users and guests in a game in any mode by day (last 30
          days).
        </ChartHeading>
        <GuessesByDayChart data={stats.guessesByDay} />
        <Separator />
        <ChartHeading title="Games By Day">
          Games won/given up by both users and guests in any mode by day (last
          30 days).
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
          <Stat title="Official Games Completed" value={officialGamesCompleted}>
            The number of games won and given up in the official mode.
          </Stat>
          <Stat title="Official Mode Wins" value={officialModeWins}>
            The number of games won in the official mode.
          </Stat>
          <Stat title="Official Mode Give Ups" value={officialModeGiveUps}>
            The number of games given up in the official mode.
          </Stat>
          <Stat title="Hints Revealed" value={officialModeHintsRevealed}>
            The number of hints revealed in all official mode games.
          </Stat>
          <Stat
            title="Hints Revealed %"
            value={`${officialModeHintsRevealedPercentage + '%'}`}
          >
            The percentage of hints revealed in all official mode games.
          </Stat>
        </div>
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Games - Random Mode
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat title="Random Games Played" value={randomGamesPlayed}>
            The number of games won/given up/in progress by both users and
            guests in the random mode.
          </Stat>
          <Stat title="Random Games Completed" value={randomGamesCompleted}>
            The number of games won and given up by both users and guests in the
            random mode.
          </Stat>
          <Stat title="Random Mode Wins" value={randomModeWins}>
            The number of games won by both users and guests in the random mode.
          </Stat>
          <Stat title="Random Mode Give Ups" value={randomModeGiveUps}>
            The number of games given up by both users and guests in the random
            mode.
          </Stat>
          <Stat title="Hints Revealed" value={randomModeHintsRevealed}>
            The number of hints revealed in all random mode games.
          </Stat>
          <Stat
            title="Hints Revealed %"
            value={`${randomModeHintsRevealedPercentage + '%'}`}
          >
            The percentage of hints revealed in all random mode games.
          </Stat>
        </div>
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Games - Random Mode (Users)
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat
            title="Random Games Played (Users)"
            value={randomGamesPlayedUser}
          >
            The number of games won/given up/in progress by users in the random
            mode.
          </Stat>
          <Stat
            title="Random Games Completed (Users)"
            value={randomGamesCompletedUser}
          >
            The number of games won and given up by users in the random mode.
          </Stat>
          <Stat title="Random Mode Wins (Users)" value={randomModeWinsUser}>
            The number of games won by users in the random mode.
          </Stat>
          <Stat
            title="Random Mode Give Ups (Users)"
            value={randomModeGiveUpsUser}
          >
            The number of games given up by users in the random mode.
          </Stat>
          <Stat title="Hints Revealed" value={randomModeHintsRevealedUser}>
            The number of hints revealed by users in random mode games.
          </Stat>
          <Stat
            title="Hints Revealed %"
            value={`${randomModeHintsRevealedPercentageUser + '%'}`}
          >
            The percentage of hints revealed by users in random mode games.
          </Stat>
        </div>
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Games - Random Mode (Guests)
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center p-2">
          <Stat
            title="Random Games Played (Guests)"
            value={randomGamesPlayedGuest}
          >
            The number of games won/given up/in progress by guests in the random
            mode.
          </Stat>
          <Stat
            title="Random Games Completed (Guests)"
            value={randomGamesCompletedGuest}
          >
            The number of games won and given up by guests in the random mode.
          </Stat>
          <Stat title="Random Mode Wins (Guests)" value={randomModeWinsGuest}>
            The number of games won by guests in the random mode.
          </Stat>
          <Stat
            title="Random Mode Give Ups (Guests)"
            value={randomModeGiveUpsGuest}
          >
            The number of games given up by guests in the random mode.
          </Stat>
          <Stat title="Hints Revealed" value={randomModeHintsRevealedGuest}>
            The number of hints revealed by guests in random mode games.
          </Stat>
          <Stat
            title="Hints Revealed %"
            value={`${randomModeHintsRevealedPercentageGuest + '%'}`}
          >
            The percentage of hints revealed by guests in random mode games.
          </Stat>
        </div>
        <Separator />
        <ChartHeading title="Darts Players in Random Games">
          The frequency of darts players assigned to be guessed in random mode
          in games won/given up by all users and guests (limited to 30 most
          frequent darts players).
        </ChartHeading>
        <RandomPlayersChart data={stats.randomPlayers} />
        <Separator />
        <h1 className="text-xl md:text-4xl font-medium text-center p-2">
          Latest Guesses
        </h1>
        <div className="grid grid-cols-1 gap-8 text-center p-2">
          <Stat
            title="Latest Official Guess"
            value={latestOfficialGuess}
            name={latestOfficialGuessName}
            time={latestOfficialGuessTime}
          >
            The latest guess in a game in the official mode.
          </Stat>
          <Stat
            title="Latest Random Guess"
            value={latestRandomGuess}
            name={latestRandomGuessName}
            time={latestRandomGuessTime}
          >
            The latest guess in a game in the random mode.
          </Stat>
        </div>
      </div>
    </div>
  );
}
