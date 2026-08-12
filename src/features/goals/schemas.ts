import { z } from 'zod'

export const createGoalSchema = z.object({
  title: z
    .string()
    .min(2, 'Goal title is required')
    .max(100),

  description: z
    .string()
    .max(500)
    .optional(),

  category: z.enum([
    'wedding',
    'house',
    'vacation',
    'education',
    'business',
    'savings',
    'personal',
    'other',
  ]),

  targetAmount: z
    .number()
    .positive('Target amount must be greater than 0')
    .optional(),

  deadline: z
    .string()
    .optional(),
})

export type CreateGoalFormValues =
  z.infer<typeof createGoalSchema>

export const createChecklistSchema = z.object({
  title: z
    .string()
    .min(1, 'Checklist title is required')
    .max(150),
})

export type CreateChecklistFormValues =
  z.infer<typeof createChecklistSchema>