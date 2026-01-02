import { z } from 'zod';

const createVehicleSchema = z.object({
  body: z.object({
    vehicle_name: z
      .string({ required_error: 'Vehicle name is required' })
      .min(1),
    type: z.enum(['car', 'bike', 'van', 'SUV'], {
      required_error: 'Vehicle type is required',
    }),
    registration_number: z
      .string({ required_error: 'Registration number is required' })
      .min(1),
    daily_rent_price: z
      .number({ required_error: 'Daily rent price is required' })
      .positive('Daily rent price must be a positive number'),
    availability_status: z
      .enum(['available', 'booked'])
      .optional()
      .default('available'),
  }),
});

const updateVehicleSchema = z.object({
  body: z.object({
    vehicle_name: z.string().min(1).optional(),
    type: z.enum(['car', 'bike', 'van', 'SUV']).optional(),
    registration_number: z.string().min(1).optional(),
    daily_rent_price: z.number().positive().optional(),
    availability_status: z.enum(['available', 'booked']).optional(),
  }),
});

export const VehicleValidation = {
  createVehicleSchema,
  updateVehicleSchema,
};
