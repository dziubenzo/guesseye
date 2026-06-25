'use client';

import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from '@/components/ui/combobox';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import type {
  ErrorObject,
  LastScheduledPlayer,
  PlayerGroupedByDifficulty,
  PlayerSchedulePlayer,
} from '@/lib/types';
import { getFullName, hasBirthdayOn } from '@/lib/utils';
import {
  schedulePlayerSchema,
  type SchedulePlayerSchemaType,
} from '@/lib/zod/schedule-player';
import { schedulePlayer } from '@/server/actions/schedule-player';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { useAction } from 'next-safe-action/hooks';
import { use, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type PlayerSchedulerFormProps = {
  playersPromise: Promise<PlayerGroupedByDifficulty[]>;
  startDate: Date;
};

export default function PlayerSchedulerForm({
  playersPromise,
  startDate,
}: PlayerSchedulerFormProps) {
  const players = use(playersPromise);

  const schedulePlayerForm = useForm({
    resolver: zodResolver(schedulePlayerSchema),
    defaultValues: { startDate },
    reValidateMode: 'onSubmit',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Make sure Combobox shows the placeholder text back after submission
  const [selectKey, setSelectKey] = useState(new Date().toString());

  const { execute, isPending } = useAction(schedulePlayer, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.message);
        return;
      }
      if (data?.type === 'success') {
        const submittedPlayerId = schedulePlayerForm.getValues('playerId');
        const fullName = getFullName(submittedPlayerId, players);
        setSuccess(`${fullName} ${data.message}.`);
        schedulePlayerForm.resetField('playerId');
        setSelectKey(new Date().toString());
        return;
      }
    },
  });

  const hookErrors = schedulePlayerForm.formState.errors;

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
    <>
      <p>
        Schedule player for{' '}
        <span className="font-medium">{format(startDate, 'dd MMMM y')}</span>
      </p>
      <Form {...schedulePlayerForm}>
        <form
          onSubmit={schedulePlayerForm.handleSubmit(onSubmit)}
          className="flex flex-col gap-4"
        >
          <FormField
            key={selectKey}
            control={schedulePlayerForm.control}
            name="playerId"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <Combobox
                  name="playerId"
                  items={players}
                  itemToStringLabel={(player: PlayerSchedulePlayer) =>
                    `${player.fullName} (${player.officialModeCount}) (${player.difficulty.toUpperCase()}, ${player.approvedHintsCount} ${
                      player.approvedHintsCount === 1 ? 'hint' : 'hints'
                    })`
                  }
                  onValueChange={(player) => {
                    if (!player) {
                      field.onChange(undefined);
                      return;
                    }
                    field.onChange(player.id);
                  }}
                  required
                  highlightItemOnHover
                  autoHighlight
                >
                  <ComboboxInput
                    className="cursor-pointer w-full sm:w-[350px]"
                    placeholder="Darts Player (Occurrences) (Difficulty, Hints)"
                    disabled={isPending}
                    showClear
                  />
                  <ComboboxContent>
                    <ComboboxEmpty>No darts players found.</ComboboxEmpty>
                    <ComboboxList>
                      {(group: PlayerGroupedByDifficulty, index) => (
                        <ComboboxGroup key={group.value} items={group.items}>
                          <ComboboxLabel className="text-sm">
                            {group.value.toUpperCase()}
                          </ComboboxLabel>
                          <ComboboxCollection>
                            {(player: PlayerSchedulePlayer) => (
                              <ComboboxItem
                                className="cursor-pointer"
                                key={player.id}
                                value={player}
                              >
                                {player.fullName} ({player.officialModeCount}) (
                                {player.difficulty.toUpperCase()},{' '}
                                {player.approvedHintsCount}{' '}
                                {player.approvedHintsCount === 1
                                  ? 'hint'
                                  : 'hints'}
                                )
                                {hasBirthdayOn(startDate, player.dateOfBirth)
                                  ? ' 🎂'
                                  : null}
                              </ComboboxItem>
                            )}
                          </ComboboxCollection>
                          {index < players.length - 1 && <ComboboxSeparator />}
                        </ComboboxGroup>
                      )}
                    </ComboboxList>
                  </ComboboxContent>
                </Combobox>
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
    </>
  );
}

type PlayerSchedulerFormWrapperProps = {
  playersPromise: Promise<PlayerGroupedByDifficulty[]>;
  lastScheduledPlayerPromise: Promise<ErrorObject | LastScheduledPlayer>;
};

export function PlayerSchedulerFormWrapper({
  playersPromise,
  lastScheduledPlayerPromise,
}: PlayerSchedulerFormWrapperProps) {
  const lastScheduledPlayer = use(lastScheduledPlayerPromise);

  if ('error' in lastScheduledPlayer) {
    return null;
  }

  return (
    <>
      <Separator />
      <PlayerSchedulerForm
        playersPromise={playersPromise}
        startDate={lastScheduledPlayer.endDate}
      />
    </>
  );
}
