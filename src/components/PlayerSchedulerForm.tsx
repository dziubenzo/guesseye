'use client';

import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
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
import type { PlayerWithCount } from '@/lib/types';
import {
  schedulePlayerSchema,
  type SchedulePlayerSchemaType,
} from '@/lib/zod/schedule-player';
import { schedulePlayer } from '@/server/actions/schedule-player';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type PlayerSchedulerFormProps = {
  players: PlayerWithCount[];
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

  const router = useRouter();

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Make sure Select shows the placeholder text back after submission
  const [selectKey, setSelectKey] = useState(new Date().toString());

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
        router.refresh();
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
                    <SelectLabel>Men</SelectLabel>
                    {players.map((player) => {
                      if (player.gender === 'male') {
                        return (
                          <SelectItem
                            key={player.id}
                            value={player.id.toString()}
                            className="cursor-pointer"
                          >
                            {player.firstName + ' ' + player.lastName} (
                            {player.officialModeCount}) -{' '}
                            {player.difficulty.toUpperCase()}
                          </SelectItem>
                        );
                      }
                    })}
                  </SelectGroup>
                  <SelectSeparator />
                  <SelectGroup>
                    <SelectLabel>Women</SelectLabel>
                    {players.map((player) => {
                      if (player.gender === 'female') {
                        return (
                          <SelectItem
                            key={player.id}
                            value={player.id.toString()}
                            className="cursor-pointer"
                          >
                            {player.firstName + ' ' + player.lastName} (
                            {player.officialModeCount}) -{' '}
                            {player.difficulty.toUpperCase()}
                          </SelectItem>
                        );
                      }
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
        {error && <ErrorMessage errorMessage={error} />}
        {success && <SuccessMessage successMessage={success} />}
      </form>
    </Form>
  );
}
