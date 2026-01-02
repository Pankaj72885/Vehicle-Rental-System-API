import { z } from 'zod';

const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(1).optional(),
    email: z.string().email().optional(),
    phone: z.string().min(1).optional(),
    role: z.enum(['admin', 'customer']).optional(),
  }),
});

export const UserValidation = {
  updateUserSchema,
};
