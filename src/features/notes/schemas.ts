import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'notes.validation'>>

const TITLE_MIN = 1
const TITLE_MAX = 200
const CONTENT_MAX = 5000
const CATEGORY_MAX = 50

export function createNoteSchema(t: ValidationT) {
  return z.object({
    title: z
      .string()
      .min(TITLE_MIN, t('titleRequired'))
      .max(TITLE_MAX, t('titleMax', { max: TITLE_MAX })),

    content: z
      .string()
      .max(CONTENT_MAX, t('contentMax', { max: CONTENT_MAX }))
      .optional(),

    category: z
      .string()
      .max(CATEGORY_MAX, t('categoryMax', { max: CATEGORY_MAX }))
      .optional(),

    checklistItems: z
      .array(z.string().min(1, t('checklistItemRequired')))
      .optional(),
  })
}

export type CreateNoteFormValues = z.infer<
  ReturnType<typeof createNoteSchema>
>