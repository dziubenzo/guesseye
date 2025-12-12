'use client';

import Message from '@/components/Message';
import { Checkbox } from '@/components/ui/checkbox';
import { Form, FormControl, FormField, FormItem } from '@/components/ui/form';
import { Label } from '@/components/ui/label';
import {
  updateVeryHardSchema,
  type UpdateVeryHardSchemaType,
} from '@/lib/zod/update-very-hard';
import { updateVeryHard } from '@/server/actions/update-very-hard';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'next-safe-action/hooks';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

type UpdateVeryHardFormProps = {
  currentSetting: boolean;
};

export default function UpdateVeryHardForm({
  currentSetting,
}: UpdateVeryHardFormProps) {
  const updateVeryHardForm = useForm({
    resolver: zodResolver(updateVeryHardSchema),
    defaultValues: {
      newValue: currentSetting,
    },
    mode: 'onSubmit',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { execute, isPending } = useAction(updateVeryHard, {
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

  function onSubmit(values: UpdateVeryHardSchemaType) {
    setError('');
    setSuccess('');
    execute(values);
    return;
  }

  return (
    <div className="">
      <Form {...updateVeryHardForm}>
        <form onSubmit={updateVeryHardForm.handleSubmit(onSubmit)}>
          <FormField
            control={updateVeryHardForm.control}
            name="newValue"
            render={({ field }) => (
              <FormItem>
                <div className="flex flex-col gap-2">
                  <div className="flex flex-col gap-2 md:w-[400px]">
                    <FormControl>
                      <div className="flex flex-col gap-2">
                        <div className="flex gap-3">
                          <Checkbox
                            type="submit"
                            className="cursor-pointer h-6 w-6"
                            id="veryHardSetting"
                            disabled={isPending}
                            checked={field.value}
                            onCheckedChange={(checked) =>
                              field.onChange(checked)
                            }
                          />
                          <Label
                            htmlFor="veryHardSetting"
                            className="cursor-pointer"
                          >
                            Allow Very Hard Difficulty in Random Mode
                          </Label>
                        </div>
                        <p className="text-muted-foreground text-sm">
                          Unchecked by default.
                        </p>
                        <p className="text-muted-foreground text-sm">
                          If unchecked, you can only encounter darts players of
                          easy, medium, or hard difficulty in random mode.
                        </p>
                        <p className="text-muted-foreground text-sm">
                          If checked, you can additionally encounter darts
                          players of very hard difficulty in random mode.
                        </p>
                      </div>
                    </FormControl>
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
