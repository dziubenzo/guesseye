import { z } from 'zod';

export const schedulePlayerSchema = z.object({
  playerId: z.number({ message: 'No darts player chosen.' }),
  startDate: z.date(),
});

export type SchedulePlayerSchemaType = z.infer<typeof schedulePlayerSchema>;
