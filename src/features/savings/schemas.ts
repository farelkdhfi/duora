import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'savings.validation'>>

const NOTE_MAX = 200

export function createSavingSchema(t: ValidationT) {
  return z.object({
    amount: z
      .number({ message: t('amountRequired') })
      .positive(t('amountPositive')),

    note: z
      .string()
      .max(NOTE_MAX, t('noteMax', { max: NOTE_MAX }))
      .optional(),
  })
}

export type CreateSavingFormValues = z.infer<
  ReturnType<typeof createSavingSchema>
>