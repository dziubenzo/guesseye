'use client';

import ErrorMessage from '@/components/ErrorMessage';
import SuccessMessage from '@/components/SuccessMessage';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  updateNameSchema,
  type UpdateNameSchemaType,
} from '@/lib/zod/update-name';
import { updateName } from '@/server/actions/update-name';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type UpdateNameFormProps = {
  currentName: string;
};

export default function UpdateNameForm({ currentName }: UpdateNameFormProps) {
  const updateNameForm = useForm({
    resolver: zodResolver(updateNameSchema),
    defaultValues: {
      newName: currentName,
    },
    mode: 'onSubmit',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { execute, isPending } = useAction(updateName, {
    onSuccess({ data }) {
      if (data?.type === 'error') {
        setError(data.message);
        return;
      }
      if (data?.type === 'success') {
        setSuccess(data.message);
        return;
      }
    },
  });

  function onSubmit(values: UpdateNameSchemaType) {
    if (values.newName === currentName) return;
    setError('');
    setSuccess('');
    execute(values);
  }

  return (
    <div className="">
      <Form {...updateNameForm}>
        <form onSubmit={updateNameForm.handleSubmit(onSubmit)}>
          <FormField
            control={updateNameForm.control}
            name="newName"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 md:w-[400px]">
                    <FormLabel className="cursor-pointer text-accent-foreground flex flex-col gap-1 items-start">
                      <span>New Name</span>
                      <span className="text-[0.65rem] text-muted-foreground">
                        (max. 16 characters)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="h-auto p-2"
                        disabled={isPending}
                        autoFocus
                        maxLength={16}
                        {...field}
                      />
                    </FormControl>
                    <Button
                      type="submit"
                      variant="default"
                      disabled={isPending}
                      className={`cursor-pointer text-lg px-4 py-4`}
                    >
                      {isPending ? (
                        <Loader2 className="animate-spin size-7 h-full" />
                      ) : (
                        'Update Name'
                      )}
                    </Button>
                    {error && <ErrorMessage errorMessage={error} />}
                    {success && <SuccessMessage successMessage={success} />}
                  </div>
                </div>
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
