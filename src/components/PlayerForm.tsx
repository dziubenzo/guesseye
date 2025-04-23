'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';

export default function PlayerForm() {
  const playerForm = useForm();

  function onSubmit() {
    return;
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
                    className="cursor-pointer text-lg px-8 py-4 h-full"
                  >
                    Check
                  </Button>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
