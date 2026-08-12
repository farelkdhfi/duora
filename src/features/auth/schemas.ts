import { z } from 'zod'

export const loginSchema = z.object({
  email: z
    .string()
    .email('Invalid email address'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters'),
})

export const registerSchema = z.object({
  username: z
    .string()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be less than 30 characters')
    .regex(
      /^[a-zA-Z0-9_]+$/,
      'Username can only contain letters, numbers, and underscores',
    ),

  displayName: z
    .string()
    .min(2, 'Display name must be at least 2 characters')
    .max(50),

  email: z
    .string()
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters'),

  confirmPassword: z
    .string(),
}).refine(
  (data) => data.password === data.confirmPassword,
  {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  },
)

export type LoginFormValues = z.infer<typeof loginSchema>

export type RegisterFormValues = z.infer<
  typeof registerSchema
>