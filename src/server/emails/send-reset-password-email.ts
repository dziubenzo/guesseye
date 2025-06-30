'use server';

import ResetPasswordEmail from '@/components/ResetPasswordEmail';
import * as dotenvx from '@dotenvx/dotenvx';
import { Resend } from 'resend';

const resend = new Resend(dotenvx.get('RESEND_API_KEY'));

export const sendResetPasswordEmail = async (
  email: string,
  name: string,
  url: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'GuessEye <onboarding@resend.dev>',
    to: email,
    subject: 'GuessEye - Reset Password',
    react: ResetPasswordEmail({ name, url }),
    text: `Hi, ${name}! Click the following link to reset your password: ${url}. The reset password link is valid for 15 minutes. If you did not request this email, please ignore it.`,
  });

  if (error) {
    return error;
  }

  return data;
};
