import { z } from 'zod';

const createBookingSchema = z.object({
  body: z.object({
    vehicle_id: z.number({ required_error: 'Vehicle ID is required' }),
    rent_start_date: z.string({ required_error: 'Start date is required' }),
    rent_end_date: z.string({ required_error: 'End date is required' }),
    customer_id: z.number().optional(),
  }),
});

export const BookingValidation = {
  createBookingSchema,
};
