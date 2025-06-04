'use client';

import { Button } from '@/components/ui/button';
import type { Leaderboard } from '@/lib/types';
import { formatGameDuration } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<Leaderboard>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer p-0 has-[>svg]:px-0 has-[>svg]:pr-0"
        >
          Rank
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    // Sort rank column by index
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
    accessorKey: 'username',
    header: 'Username',
    cell: ({ cell, row }) => {
      const username = cell.getValue<Leaderboard['username']>();
      const isCurrentUser = row.original.isCurrentUser;

      return (
        <div>
          <p className={`${isCurrentUser ? 'font-medium' : undefined}`}>
            {username}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: 'officialModeWins',
    header: () => {
      return (
        <div>
          <p>Wins</p>
          <p className="text-xs">(Official)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const officialModeWins = cell.getValue<Leaderboard['officialModeWins']>();
      return officialModeWins;
    },
  },
  {
    accessorKey: 'randomModeWins',
    header: () => {
      return (
        <div>
          <p>Wins</p>
          <p className="text-xs">(Random)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const randomModeWins = cell.getValue<Leaderboard['officialModeWins']>();
      return randomModeWins;
    },
  },
  {
    accessorKey: 'officialModeGiveUps',
    header: () => {
      return (
        <div>
          <p>Give Ups</p>
          <p className="text-xs">(Official)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const officialModeGiveUps =
        cell.getValue<Leaderboard['officialModeGiveUps']>();
      return officialModeGiveUps;
    },
  },
  {
    accessorKey: 'randomModeGiveUps',
    header: () => {
      return (
        <div>
          <p>Give Ups</p>
          <p className="text-xs">(Random)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const randomModeGiveUps =
        cell.getValue<Leaderboard['randomModeGiveUps']>();
      return randomModeGiveUps;
    },
  },
  {
    accessorKey: 'gamesInProgress',
    header: () => {
      return (
        <div>
          <p>Games</p>
          <p className="text-xs">(In Progress)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const gamesInProgress = cell.getValue<Leaderboard['gamesInProgress']>();
      return gamesInProgress;
    },
  },
  {
    accessorKey: 'fastestWin',
    header: () => {
      return (
        <div>
          <p>Win</p>
          <p className="text-xs">(Fastest)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const fastestWin = cell.getValue<Leaderboard['fastestWin']>();

      if (!fastestWin) return;

      return (
        <div>
          <p>{formatGameDuration(fastestWin)}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'fewestGuesses',
    header: () => {
      return (
        <div>
          <p>Win</p>
          <p className="text-xs">(Fewest Guesses)</p>
        </div>
      );
    },
    cell: ({ cell }) => {
      const fewestGuesses = cell.getValue<Leaderboard['fewestGuesses']>();

      if (!fewestGuesses) return;

      return (
        <div>
          <p>
            {fewestGuesses} {fewestGuesses === 1 ? 'guess' : 'guesses'}
          </p>
        </div>
      );
    },
  },
];
