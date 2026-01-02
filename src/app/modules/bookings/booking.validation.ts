import { z } from 'zod';

const updateBookingSchema = z.object({
  body: z.object({
    status: z.enum(['active', 'cancelled', 'returned']).optional(),
  }),
});

export const BookingValidation = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createBookingSchema: z.object({
    body: z.object({
      vehicle_id: z.number({ required_error: 'Vehicle ID is required' }),
      rent_start_date: z.string({ required_error: 'Start date is required' }),
      rent_end_date: z.string({ required_error: 'End date is required' }),
      customer_id: z.number().optional(),
    }),
  }) as any,
  updateBookingSchema,
};
