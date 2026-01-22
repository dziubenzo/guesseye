'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { CompletedGameTable, Player } from '@/lib/types';
import { cn, getDifficultyColour } from '@/lib/utils';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<CompletedGameTable>[] = [
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
      return row.original.playerToFindName;
    },
  },
  {
    accessorKey: 'playerToFindDifficulty',
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
        cell.getValue<CompletedGameTable['playerToFindDifficulty']>();

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

      const rowAValue = sortingMap.get(rowA.original.playerToFindDifficulty)!;
      const rowBValue = sortingMap.get(rowB.original.playerToFindDifficulty)!;

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
    accessorKey: 'mode',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          className="cursor-pointer p-0 has-[>svg]:px-0 has-[>svg]:pr-0"
        >
          Mode
          <ArrowUpDown className="h-4 w-4" />
        </Button>
      );
    },
    cell: ({ cell }) => {
      const mode = cell.getValue<CompletedGameTable['mode']>();

      if (mode === 'official') {
        return (
          <Badge className="w-[80px] bg-lime-400 text-secondary-foreground dark:text-secondary">
            Official
          </Badge>
        );
      } else {
        return (
          <Badge className="w-[80px] bg-violet-300 text-secondary-foreground dark:text-secondary">
            Random
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End',
    cell: ({ cell }) => {
      const endDate = cell.getValue<CompletedGameTable['endDate']>();

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
    accessorKey: 'guessesCount',
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
      const guesses = cell.getValue<CompletedGameTable['guessesCount']>();

      return (
        <div>
          <p>
            {guesses} {guesses === 1 ? 'guess' : 'guesses'}
          </p>
        </div>
      );
    },
    sortingFn: (rowA, rowB) => {
      const rowAValue = rowA.original.guessesCount;
      const rowBValue = rowB.original.guessesCount;

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
      const gameStatus = cell.getValue<CompletedGameTable['status']>();

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
        <Button
          className="cursor-pointer w-full bg-amber-400 hover:bg-amber-300 text-secondary-foreground dark:text-secondary"
          variant={'secondary'}
          asChild
        >
          <Link href={`/games/${row.original.gameId}`}>Details</Link>
        </Button>
      );
    },
  },
];
