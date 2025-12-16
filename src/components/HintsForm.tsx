'use client';

import Message from '@/components/Message';
import { Button } from '@/components/ui/button';
import { Form, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { Player, PlayerAdmin } from '@/lib/types';
import { addHintSchema, type AddHintSchemaType } from '@/lib/zod/add-hint';
import { addHint } from '@/server/actions/add-hint';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';

type HintsFormProps =
  | { players: Player[]; location: 'other' }
  | { players: PlayerAdmin[]; location: 'adminPage' };

export default function HintsForm({ players, location }: HintsFormProps) {
  const addHintForm = useForm({
    resolver: zodResolver(addHintSchema),
    defaultValues: {
      hint: '',
      isApproved: location === 'adminPage' ? true : false,
    },
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  // Make sure Select shows the placeholder text back after submission
  const [selectKey, setSelectKey] = useState(new Date().toString());

  const { execute, isPending } = useAction(addHint, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.message);
        return;
      }
      if (data?.type === 'success') {
        setSuccess(data.message);
        addHintForm.resetField('playerId');
        addHintForm.resetField('hint');
        setSelectKey(new Date().toString());
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
              <Select
                key={selectKey}
                name="playerId"
                onValueChange={(value) => field.onChange(parseInt(value))}
              >
                <SelectTrigger
                  value={field.value}
                  className="cursor-pointer w-full sm:w-[300px]"
                >
                  <SelectValue
                    placeholder={
                      location === 'adminPage'
                        ? 'Darts Player (Hints)'
                        : 'Darts Player'
                    }
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {players.map((player, index) => {
                      const prevDifficulty =
                        players[index > 0 ? index - 1 : index].difficulty;
                      return location === 'adminPage' ? (
                        <Fragment key={player.id + 'hintForm'}>
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
                            {player.firstName + ' ' + player.lastName}{' '}
                            {'hints' in player ? `(${player.hints})` : null}
                          </SelectItem>
                        </Fragment>
                      ) : (
                        <SelectItem
                          key={player.id}
                          value={player.id.toString()}
                          className="cursor-pointer"
                        >
                          {player.firstName + ' ' + player.lastName}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
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
              <Textarea id="hint-textarea" minLength={8} {...field} />
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
