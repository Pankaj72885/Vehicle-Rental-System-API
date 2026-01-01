import { z } from 'zod';

const signupSchema = z.object({
  body: z.object({
    name: z.string().min(1, 'Name is required'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(1, 'Phone number is required'),
    role: z.enum(['admin', 'customer']),
    address: z.string().optional(),
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});

export const AuthValidation = {
  signupSchema,
  signinSchema,
};
