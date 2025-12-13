import { signUp } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';
import { signupSchema } from '@/lib/zod/signup';

export const signUpWithEmail = actionClient
  .schema(signupSchema)
  .action(async ({ parsedInput: { email, password, name } }) => {
    const { data, error } = await signUp.email({
      email,
      password,
      name,
    });

    if (error) return { error: error.message };

    return { success: data.user };
  });
