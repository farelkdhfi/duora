import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'planner.validation'>>

const TITLE_MIN = 2
const TITLE_MAX = 100
const DESCRIPTION_MAX = 500

export function createPlannerEventSchema(t: ValidationT) {
  return z
    .object({
      title: z
        .string()
        .min(TITLE_MIN, t('titleMin', { min: TITLE_MIN }))
        .max(TITLE_MAX, t('titleMax', { max: TITLE_MAX })),

      description: z
        .string()
        .max(DESCRIPTION_MAX, t('descriptionMax', { max: DESCRIPTION_MAX }))
        .optional(),

      category: z.enum([
        'relationship',
        'finance',
        'birthday',
        'anniversary',
        'travel',
        'health',
        'work',
        'other',
      ]),

      eventDate: z.string().min(1, t('dateRequired')),

      startTime: z.string().optional(),

      endTime: z.string().optional(),

      isAllDay: z.boolean(),
    })
    .refine(
      (data) => {
        if (data.isAllDay || !data.startTime || !data.endTime) {
          return true
        }

        return data.endTime >= data.startTime
      },
      {
        message: t('endBeforeStart'),
        path: ['endTime'],
      },
    )
}

export type CreatePlannerEventFormValues = z.infer<
  ReturnType<typeof createPlannerEventSchema>
>