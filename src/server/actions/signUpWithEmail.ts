'use server';

import { signUp } from '@/lib/auth-client';
import { signupSchema } from '@/lib/zod/signup';
import { z } from 'zod';

export async function signUpWithEmail(values: z.infer<typeof signupSchema>) {
  const { email, name, password } = values;
  const { data, error } = await signUp.email({
    email,
    password,
    name,
  });
  return { data, error };
}
