'use client';

import GameDetailsModal from '@/components/GameDetailsModal';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CompletedGame, Player } from '@/lib/types';
import { cn, getDifficultyColour } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';

export const columns: ColumnDef<CompletedGame>[] = [
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
      const gameNo = row.original.gameNo;
      return <div className="font-medium">{gameNo}</div>;
    },
  },
  {
    accessorKey: 'dartsPlayer',
    header: 'Darts Player',
    cell: ({ row }) => {
      const fullName =
        row.original.playerToFind.firstName +
        ' ' +
        row.original.playerToFind.lastName;
      return fullName;
    },
  },
  {
    accessorKey: 'playerToFind.difficulty',
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
        cell.getValue<CompletedGame['playerToFind']['difficulty']>();
        
      if (playerDifficulty === 'easy') {
        return (
          <Badge className={cn('w-[80px]', getDifficultyColour('easy'))}>
            Easy
          </Badge>
        );
      } else if (playerDifficulty === 'medium') {
        return (
          <Badge className={cn('w-[80px]', getDifficultyColour('medium'))}>
            Medium
          </Badge>
        );
      } else if (playerDifficulty === 'hard') {
        return (
          <Badge className={cn('w-[80px]', getDifficultyColour('hard'))}>
            Hard
          </Badge>
        );
      } else {
        return (
          <Badge className={cn('w-[80px]', getDifficultyColour('very hard'))}>
            Very Hard
          </Badge>
        );
      }
    },
    // Sort difficulty column by actual difficulty instead of alphabetically
    sortingFn: (rowA, rowB) => {
      const sortingMap = new Map<Player['difficulty'], number>();
      sortingMap.set('easy', 1);
      sortingMap.set('medium', 2);
      sortingMap.set('hard', 3);
      sortingMap.set('very hard', 4);

      const rowAValue = sortingMap.get(rowA.original.playerToFind.difficulty)!;
      const rowBValue = sortingMap.get(rowB.original.playerToFind.difficulty)!;

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
      const startDate = cell.getValue<CompletedGame['startDate']>();

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
      const endDate = cell.getValue<CompletedGame['endDate']>();

      if (!endDate) return;

      return (
        <div>
          <p>{format(endDate, 'dd/MM/y')}</p>
          <p className="text-xs">{format(endDate, 'HH:mm')}</p>
        </div>
      );
    },
  },
  {
    accessorKey: 'guesses',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer p-0 has-[>svg]:px-0 has-[>svg]:pr-0"
        >
          Guesses
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const guesses = cell.getValue<CompletedGame['guesses']>().length;

      return (
        <div>
          <p>
            {guesses} {guesses === 1 ? 'guess' : 'guesses'}
          </p>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const rowAValue = rowA.original.guesses.length;
      const rowBValue = rowB.original.guesses.length;

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
    accessorKey: 'status',
    header: 'Status',
    cell: ({ cell }) => {
      const gameStatus = cell.getValue<CompletedGame['status']>();

      if (gameStatus === 'won') {
        return (
          <Badge className="w-[80px] dark:text-black" variant={'default'}>
            Won
          </Badge>
        );
      } else {
        return (
          <Badge className="w-[80px]" variant={'destructive'}>
            Given Up
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: 'details',
    header: 'Details',
    cell: ({ row }) => {
      return (
        <GameDetailsModal
          playerToFind={row.original.playerToFind}
          guesses={row.original.guesses}
        />
      );
    },
  },
];
