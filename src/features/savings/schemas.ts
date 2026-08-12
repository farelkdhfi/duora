import { z } from 'zod'

export const createSavingSchema = z.object({
  amount: z
    .number()
    .positive(
      'Amount must be greater than 0',
    ),

  note: z
    .string()
    .max(200)
    .optional(),
})

export type CreateSavingFormValues =
  z.infer<typeof createSavingSchema>