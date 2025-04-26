'use client';

import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { guessSchema, GuessSchemaType } from '@/lib/zod/guess';
import { checkGuess } from '@/server/actions/check-guess';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import ErrorMessage from './ErrorMessage';

export default function PlayerForm() {
  const playerForm = useForm({
    resolver: zodResolver(guessSchema),
    defaultValues: {
      guess: '',
    },
    mode: 'onSubmit',
  });

  const [error, setError] = useState('');

  const { execute, isPending } = useAction(checkGuess, {
    onSuccess({ data }) {
      if (data?.error) setError(data.error);
      if (data?.success) {
        console.log(data.success);
      }
    },
  });

  function onSubmit(values: GuessSchemaType) {
    setError('');
    execute(values);
  }

  return (
    <div className="flex w-full justify-center bg-background sticky top-0 p-4">
      <Form {...playerForm}>
        <form onSubmit={playerForm.handleSubmit(onSubmit)}>
          <FormField
            control={playerForm.control}
            name="guess"
            render={({ field }) => (
              <FormItem className="flex flex-col gap-2">
                <div className="flex justify-stretch gap-4">
                  <FormControl>
                    <Input
                      className="text-md lg:text-lg h-auto p-3 text-center placeholder:text-center"
                      autoFocus
                      {...field}
                    />
                  </FormControl>
                  <Button
                    type="submit"
                    variant="default"
                    disabled={isPending}
                    className="cursor-pointer text-lg px-8 py-4 h-full"
                  >
                    {isPending ? 'Checking...' : 'Check'}
                  </Button>
                </div>
                {error && <ErrorMessage errorMessage={error} />}
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
