'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { OfficialGamesHistory } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { format, millisecondsToMinutes, millisecondsToSeconds } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<OfficialGamesHistory>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer p-0 has-[>svg]:px-0 has-[>svg]:pr-0"
        >
          #
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    // Sort id column by index
    sortingFn: (rowA, rowB) => {
      const rowAValue = rowA.index;
      const rowBValue = rowB.index;

      if (rowAValue < rowBValue) {
        return -1;
      } else if (rowAValue > rowBValue) {
        return 1;
      } else {
        return 0;
      }
    },
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: 'playerDifficulty',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer p-0 has-[>svg]:px-0 has-[>svg]:pr-0"
        >
          Difficulty
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const playerDifficulty =
        cell.getValue<OfficialGamesHistory['playerDifficulty']>();

      if (playerDifficulty === 'easy') {
        return (
          <Badge className="w-[80px] dark:text-black" variant={'default'}>
            Easy
          </Badge>
        );
      } else if (playerDifficulty === 'medium') {
        return (
          <Badge className="w-[80px] bg-amber-400 text-secondary-foreground dark:text-secondary">
            Medium
          </Badge>
        );
      } else if (playerDifficulty === 'hard') {
        return (
          <Badge className="w-[80px] bg-red-500 text-secondary dark:text-secondary">
            Hard
          </Badge>
        );
      } else {
        return (
          <Badge className="w-[80px] bg-gray-800 text-red-500 ">
            Very Hard
          </Badge>
        );
      }
    },
    // Sort difficulty column by actual difficulty instead of alphabetically
    sortingFn: (rowA, rowB) => {
      const sortingMap = new Map<
        OfficialGamesHistory['playerDifficulty'],
        number
      >();
      sortingMap.set('easy', 1);
      sortingMap.set('medium', 2);
      sortingMap.set('hard', 3);
      sortingMap.set('very hard', 4);

      const rowAValue = sortingMap.get(rowA.original.playerDifficulty)!;
      const rowBValue = sortingMap.get(rowB.original.playerDifficulty)!;

      if (rowAValue < rowBValue) {
        return -1;
      } else if (rowAValue > rowBValue) {
        return 1;
      } else {
        return 0;
      }
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start',
    cell: ({ cell }) => {
      const startDate = cell.getValue<OfficialGamesHistory['startDate']>();

      return (
        <div>
          <p>{format(startDate, 'dd/MM/y')}</p>
          <p className="text-xs">{format(startDate, 'HH:mm')}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End',
    cell: ({ cell }) => {
      const endDate = cell.getValue<OfficialGamesHistory['endDate']>();

      return (
        <div>
          <p>{format(endDate, 'dd/MM/y')}</p>
          <p className="text-xs">{format(endDate, 'HH:mm')}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'winners',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer p-0 has-[>svg]:px-0 has-[>svg]:pr-0"
        >
          Winners
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const winners = cell.getValue<OfficialGamesHistory['winners']>();

      return (
        <div>
          <p>
            {winners} {winners === 1 ? 'winner' : 'winners'}
          </p>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const rowAValue = rowA.original.winners;
      const rowBValue = rowB.original.winners;

      // Revert logic to show games with most winners on top on the first click
      if (rowAValue < rowBValue) {
        return 1;
      } else if (rowAValue > rowBValue) {
        return -1;
      } else {
        return 0;
      }
    },
  },
  {
    accessorKey: 'firstWinner',
    header: () => {
      return (
        <div>
          <p>Winner</p>
          <p className="text-xs">(First)</p>
        </div>
      );
    },
    cell: ({ row, cell }) => {
      const firstWinner = cell.getValue<OfficialGamesHistory['firstWinner']>();
      const firstWinnerTime = row.original.firstWinnerTime;

      if (!firstWinner || !firstWinnerTime) return;

      return (
        <div>
          <p>{firstWinner}</p>
          <p className="text-xs">
            {format(firstWinnerTime, 'HH:mm (dd/MM/y)')}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'fastestWinner',
    header: () => {
      return (
        <div>
          <p>Winner</p>
          <p className="text-xs">(Fastest)</p>
        </div>
      );
    },
    cell: ({ row, cell }) => {
      const fastestWinner =
        cell.getValue<OfficialGamesHistory['fastestWinner']>();
      const fastestWinnerDuration = row.original.fastestWinnerDuration;

      if (!fastestWinner || !fastestWinnerDuration) return;

      const minutes = millisecondsToMinutes(fastestWinnerDuration);
      const seconds = millisecondsToSeconds(fastestWinnerDuration) % 60;

      return (
        <div>
          <p>{fastestWinner}</p>
          <p className="text-xs">
            {minutes > 59
              ? '> 1 hour'
              : fastestWinnerDuration <= 1000
                ? 'First try!'
                : `${minutes} min ${seconds} sec`}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'winnerWithFewestGuesses',
    header: () => {
      return (
        <div>
          <p>Winner</p>
          <p className="text-xs">(Fewest Guesses)</p>
        </div>
      );
    },
    cell: ({ row, cell }) => {
      const winnerWithFewestGuesses =
        cell.getValue<OfficialGamesHistory['winnerWithFewestGuesses']>();
      const winnerGuesses = row.original.winnerGuesses;

      if (!winnerWithFewestGuesses || !winnerGuesses) return;

      return (
        <div>
          <p>{winnerWithFewestGuesses}</p>
          <p className="text-xs">
            {winnerGuesses} {winnerGuesses === 1 ? 'guess' : 'guesses'}
          </p>
        </div>
      );
    },
  },
];
