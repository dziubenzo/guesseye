'use server';

import EmailTemplate from '@/components/EmailTemplate';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = async (email: string, name: string, url: string) => {
  const { data, error } = await resend.emails.send({
    from: 'GuessEye <onboarding@resend.dev>',
    to: email,
    subject: 'GuessEye - Confirmation Link',
    react: EmailTemplate({ name, url }),
    text: `Welcome, ${name}! Thank you for creating a GuessEye account. Click the following link to verify your account: ${url}. The confirmation link is valid for 30 minutes.`,
  });

  if (error) {
    return error;
  }

  return data;
};
