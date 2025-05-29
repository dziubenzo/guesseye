'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GameInfo, OfficialGames } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';
import { ArrowUpDown } from 'lucide-react';
import Link from 'next/link';

export const columns: ColumnDef<OfficialGames>[] = [
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
    accessorKey: 'gameInfo.fullName',
    header: 'Darts Player',
    cell: ({ row, cell }) => {
      if (row.original.gameExists && row.original.gameInfo?.fullName) {
        const fullName = cell.getValue<GameInfo['fullName']>();
        return fullName;
      } else {
        return;
      }
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start',
    cell: ({ cell }) => {
      const startDate = cell.getValue<OfficialGames['startDate']>();
      return format(startDate, 'dd/MM/y');
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End',
    cell: ({ cell }) => {
      const endDate = cell.getValue<OfficialGames['endDate']>();
      return format(endDate, 'dd/MM/y');
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
        cell.getValue<OfficialGames['playerDifficulty']>();

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
      const sortingMap = new Map<OfficialGames['playerDifficulty'], number>();
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
    accessorKey: 'gameInfo.gameStatus',
    header: 'Status',
    cell: ({ cell }) => {
      const gameStatus = cell.getValue<GameInfo['gameStatus']>();

      if (gameStatus === 'won') {
        return (
          <Badge className="w-[80px] dark:text-black" variant={'default'}>
            Won
          </Badge>
        );
      } else if (gameStatus === 'givenUp') {
        return (
          <Badge className="w-[80px]" variant={'destructive'}>
            Given Up
          </Badge>
        );
      } else if (gameStatus === 'inProgress') {
        return (
          <Badge className="w-[80px] bg-amber-400 text-secondary-foreground dark:text-secondary">
            In Progress
          </Badge>
        );
      } else {
        return (
          <Badge className="w-[80px] bg-indigo-300 text-secondary-foreground dark:text-secondary">
            Not Played
          </Badge>
        );
      }
    },
  },
  {
    accessorKey: 'action',
    header: 'Action',
    cell: ({ row }) => {
      if (
        !row.original.gameExists ||
        row.original.gameInfo?.gameStatus === 'inProgress'
      ) {
        if (row.original.gameExists) {
          return (
            <Button
              className="cursor-pointer w-full bg-amber-400 hover:bg-amber-300 text-secondary-foreground dark:text-secondary"
              variant={!row.original.gameExists ? 'secondary' : undefined}
              asChild
            >
              <Link href={`/official/${row.original.scheduleId}`}>Resume</Link>
            </Button>
          );
        } else if (!row.original.gameExists) {
          return (
            <Button
              className="cursor-pointer w-full bg-indigo-300 hover:bg-indigo-200 text-secondary-foreground dark:text-secondary"
              variant={'secondary'}
              asChild
            >
              <Link href={`/official/${row.original.scheduleId}`}>Play</Link>
            </Button>
          );
        } else {
          return;
        }
      }
    },
  },
];
