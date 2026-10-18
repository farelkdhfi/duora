import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'goals.validation'>>

const TITLE_MIN = 2
const TITLE_MAX = 100
const DESCRIPTION_MAX = 500

export function createGoalSchema(t: ValidationT) {
  return z.object({
    title: z
      .string()
      .min(TITLE_MIN, t('titleMin', { min: TITLE_MIN }))
      .max(TITLE_MAX, t('titleMax', { max: TITLE_MAX })),

    description: z
      .string()
      .max(DESCRIPTION_MAX, t('descriptionMax', { max: DESCRIPTION_MAX }))
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
      .positive(t('targetAmountPositive'))
      .optional(),

    deadline: z.string().optional(),
  })
}

export type CreateGoalFormValues = z.infer<
  ReturnType<typeof createGoalSchema>
>