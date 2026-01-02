import { z } from 'zod';

const signupSchema = z.object({
  body: z.object({
    name: z.string({ required_error: 'Name is required' }).min(1),
    email: z
      .string({ required_error: 'Email is required' })
      .email('Invalid email address'),
    password: z
      .string({ required_error: 'Password is required' })
      .min(6, 'Password must be at least 6 characters'),
    phone: z.string({ required_error: 'Phone number is required' }).min(1),
    role: z.enum(['admin', 'customer'], {
      required_error: 'Role is required',
    }),
    address: z.string().optional(),
  }),
});

const signinSchema = z.object({
  body: z.object({
    email: z.string({ required_error: 'Email is required' }).email(),
    password: z.string({ required_error: 'Password is required' }),
  }),
});

export const AuthValidation = {
  signupSchema,
  signinSchema,
};
