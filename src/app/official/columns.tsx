'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { GameInfo, OfficialGames } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { format } from 'date-fns';

export const columns: ColumnDef<OfficialGames>[] = [
  {
    accessorKey: '',
    header: '#',
    cell: ({ row }) => {
      return <div className="font-medium">{row.index + 1}</div>;
    },
  },
  {
    accessorKey: 'gameInfo.fullName',
    header: 'Player',
    cell: ({ row, cell }) => {
      if (row.original.gameExists && row.original.gameInfo?.fullName) {
        const fullName = cell.getValue<GameInfo['fullName']>();
        return <div>{fullName}</div>;
      } else {
        return <div>???</div>;
      }
    },
  },
  {
    accessorKey: 'startDate',
    header: 'Start',
    cell: ({ cell }) => {
      const startDate = cell.getValue<OfficialGames['startDate']>();
      return <div>{format(startDate, 'dd/MM/y')}</div>;
    },
  },
  {
    accessorKey: 'endDate',
    header: 'End',
    cell: ({ cell }) => {
      const endDate = cell.getValue<OfficialGames['endDate']>();
      return <div>{format(endDate, 'dd/MM/y')}</div>;
    },
  },
  {
    accessorKey: 'playerDifficulty',
    header: 'Difficulty',
  },
  {
    accessorKey: 'gameInfo.gameStatus',
    header: 'Status',
    cell: ({ cell }) => {
      const gameStatus = cell.getValue<GameInfo['gameStatus']>();

      if (!gameStatus) {
        return (
          <Badge className="w-[80px] bg-indigo-300 text-secondary-foreground dark:text-secondary">
            Not Played
          </Badge>
        );
      }

      if (gameStatus === 'won') {
        return (
          <Badge className="w-[80px]" variant={'default'}>
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
      }
    },
  },
  {
    accessorKey: '',
    header: 'Action',
    cell: ({ row }) => {
      if (
        !row.original.gameExists ||
        row.original.gameInfo?.gameStatus === 'inProgress'
      ) {
        if (row.original.gameExists) {
          return (
            <Button
              className="cursor-pointer w-full h-full bg-amber-400 hover:bg-amber-300 text-secondary-foreground dark:text-secondary"
              variant={!row.original.gameExists ? 'secondary' : undefined}
              onClick={() => {
                console.log(row.original.scheduleId);
              }}
            >
              Resume
            </Button>
          );
        } else if (!row.original.gameExists) {
          return (
            <Button
              className="cursor-pointer w-full h-full bg-indigo-300 hover:bg-indigo-200 text-secondary-foreground dark:text-secondary"
              variant={'secondary'}
              onClick={() => {
                console.log(row.original.scheduleId);
              }}
            >
              Play
            </Button>
          );
        } else {
          return;
        }
      }
    },
  },
];
