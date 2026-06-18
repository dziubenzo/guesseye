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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { PlayerGroupedByHints, PlayerSuggestHint } from '@/lib/types';
import { getFullName } from '@/lib/utils';
import { addHintSchema, type AddHintSchemaType } from '@/lib/zod/add-hint';
import { addHint } from '@/server/actions/add-hint';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { use, useState } from 'react';
import { useForm } from 'react-hook-form';

type AddHintProps =
  | {
      playersPromise: Promise<PlayerGroupedByHints[]>;
      location: 'suggestHintPage';
    }
  | { playersPromise: Promise<PlayerGroupedByHints[]>; location: 'adminPage' };

export default function AddHintForm({
  playersPromise,
  location,
}: AddHintProps) {
  const players = use(playersPromise);

  const addHintForm = useForm({
    resolver: zodResolver(addHintSchema),
    defaultValues: {
      hint: '',
      isApproved: location === 'adminPage' ? true : false,
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { execute, isPending } = useAction(addHint, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.message);
        return;
      }
      if (data?.type === 'success') {
        const submittedPlayerId = addHintForm.getValues('playerId');
        const fullName = getFullName(submittedPlayerId, players);
        addHintForm.resetField('hint');
        setSuccess(`${data.message} ${fullName}.`);
        return;
      }
    },
  });

  function onSubmit(values: AddHintSchemaType) {
    setError('');
    setSuccess('');
    execute(values);
  }

  return (
    <Form {...addHintForm}>
      <form
        onSubmit={addHintForm.handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
      >
        <FormField
          control={addHintForm.control}
          name="playerId"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <Combobox
                name="playerId"
                items={players}
                itemToStringLabel={(player: PlayerSuggestHint) =>
                  player.fullName
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
                  placeholder="Select a darts player..."
                  disabled={isPending}
                  showClear
                />
                <ComboboxContent>
                  <ComboboxEmpty>No darts players found.</ComboboxEmpty>
                  <ComboboxList>
                    {(group: PlayerGroupedByHints, index) => (
                      <ComboboxGroup key={group.value} items={group.items}>
                        <ComboboxLabel>{group.value}</ComboboxLabel>
                        <ComboboxCollection>
                          {(player: PlayerSuggestHint) => (
                            <ComboboxItem key={player.id} value={player}>
                              {player.fullName}
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
        <FormField
          control={addHintForm.control}
          name="hint"
          render={({ field }) => (
            <FormItem className="flex flex-col gap-2">
              <Label htmlFor="hint-textarea" className="cursor-pointer">
                Hint:
              </Label>
              <Textarea
                id="hint-textarea"
                minLength={8}
                disabled={isPending}
                {...field}
              />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isPending} className="cursor-pointer">
          {location === 'adminPage' ? 'Add' : 'Suggest'} Hint
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
