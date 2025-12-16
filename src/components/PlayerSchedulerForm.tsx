'use client';

import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { GroupedPlayersAdmin, PlayerAdmin } from '@/lib/types';
import {
  schedulePlayerSchema,
  type SchedulePlayerSchemaType,
} from '@/lib/zod/schedule-player';
import { schedulePlayer } from '@/server/actions/schedule-player';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';

type PlayerSchedulerFormProps = {
  players: PlayerAdmin[];
  startDate: Date;
};

export default function PlayerSchedulerForm({
  players,
  startDate,
}: PlayerSchedulerFormProps) {
  const schedulePlayerForm = useForm({
    resolver: zodResolver(schedulePlayerSchema),
    defaultValues: { startDate },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Make sure Select shows the placeholder text back after submission
  const [selectKey, setSelectKey] = useState(new Date().toString());

  // Group darts players by gender
  const playersByGender = useMemo(
    () =>
      Object.groupBy(players, ({ gender }) => gender) as GroupedPlayersAdmin,
    [players]
  );

  const hookErrors = schedulePlayerForm.formState.errors;

  const { execute, isPending } = useAction(schedulePlayer, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.message);
        return;
      }
      if (data?.type === 'success') {
        setSuccess(data.message);
        schedulePlayerForm.resetField('playerId');
        setSelectKey(new Date().toString());
        return;
      }
    },
  });

  // Make sure React Hook Form errors are caught by my error state
  useEffect(() => {
    if (hookErrors.playerId?.message) {
      setError(hookErrors.playerId?.message);
    } else if (hookErrors.startDate?.message) {
      setError(hookErrors.startDate?.message);
    } else {
      setError('');
    }
  }, [hookErrors.playerId?.message, hookErrors.startDate?.message]);

  function onSubmit(values: SchedulePlayerSchemaType) {
    setError('');
    setSuccess('');
    execute({ ...values, startDate });
  }

  return (
    <Form {...schedulePlayerForm}>
      <form
        onSubmit={schedulePlayerForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={schedulePlayerForm.control}
          name="playerId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-4">
              <Select
                key={selectKey}
                name="playerId"
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger
                  value={field.value}
                  className="cursor-pointer w-full sm:w-[300px]"
                >
                  <SelectValue placeholder="Darts Player (Occurrences) - Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel className="text-base text-blue-500">
                      MEN
                    </SelectLabel>
                    {playersByGender.male.map((player, index) => {
                      const prevDifficulty =
                        playersByGender.male[index > 0 ? index - 1 : index]
                          .difficulty;
                      return (
                        <Fragment key={player.id + 'schedulerForm'}>
                          {(index === 0 ||
                            player.difficulty !== prevDifficulty) && (
                            <SelectLabel className="text-base">
                              {player.difficulty.toUpperCase()}
                            </SelectLabel>
                          )}
                          <SelectItem
                            value={player.id.toString()}
                            className="cursor-pointer"
                          >
                            {player.firstName + ' ' + player.lastName} (
                            {player.officialModeCount}) -{' '}
                            {player.difficulty.toUpperCase()}
                          </SelectItem>
                        </Fragment>
                      );
                    })}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel className="text-base text-pink-400">
                      WOMEN
                    </SelectLabel>
                    {playersByGender.female.map((player, index) => {
                      const prevDifficulty =
                        playersByGender.female[index > 0 ? index - 1 : index]
                          .difficulty;
                      return (
                        <Fragment key={player.id}>
                          {(index === 0 ||
                            player.difficulty !== prevDifficulty) && (
                            <SelectLabel className="text-base">
                              {player.difficulty.toUpperCase()}
                            </SelectLabel>
                          )}
                          <SelectItem
                            value={player.id.toString()}
                            className="cursor-pointer"
                          >
                            {player.firstName + ' ' + player.lastName} (
                            {player.officialModeCount}) -{' '}
                            {player.difficulty.toUpperCase()}
                          </SelectItem>
                        </Fragment>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          Schedule Player
        </Button>
        {error && (
          <Message type="error">
            <p>{error}</p>
          </Message>
        )}
        {success && (
          <Message type="success" autoDismissible>
            <p>{success}</p>
          </Message>
        )}
      </form>
    </Form>
  );
}
