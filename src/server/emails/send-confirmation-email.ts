'use server';

import ConfirmationEmail from '@/components/ConfirmationEmail';
import * as dotenvx from '@dotenvx/dotenvx';
import { Resend } from 'resend';

const resend = new Resend(dotenvx.get('RESEND_API_KEY'));

export const sendConfirmationEmail = async (
  email: string,
  name: string,
  url: string
) => {
  const { data, error } = await resend.emails.send({
    from: 'GuessEye <onboarding@resend.dev>',
    to: email,
    subject: 'GuessEye - Confirmation Link',
    react: ConfirmationEmail({ name, url }),
    text: `Welcome, ${name}! Thank you for creating a GuessEye account. Click the following link to verify your account: ${url}. The confirmation link is valid for 1 hour.`,
  });

  if (error) {
    return error;
  }

  return data;
};
