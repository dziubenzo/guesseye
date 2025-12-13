import { signIn } from '@/lib/auth-client';
import { actionClient } from '@/lib/safe-action-client';
import { loginSchema } from '@/lib/zod/login';

export const logInWithEmail = actionClient
  .schema(loginSchema)
  .action(async ({ parsedInput: { email, password } }) => {
    const { error } = await signIn.email({
      email,
      password,
    });

    if (error) {
      return { error: error.message + '.' };
    }

    return;
  });
