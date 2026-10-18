import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'checkins.validation'>>

export const SCORE_MIN = 1
export const SCORE_MAX = 10
export const TEXT_MAX = 500

export function createDailyCheckinSchema(t: ValidationT) {
  const rangeMessage = t('scoreRange', { min: SCORE_MIN, max: SCORE_MAX })

  const score = z
    .number()
    .int(rangeMessage)
    .min(SCORE_MIN, rangeMessage)
    .max(SCORE_MAX, rangeMessage)

  const text = z
    .string()
    .max(TEXT_MAX, t('textMax', { max: TEXT_MAX }))
    .optional()

  return z.object({
    mood: z.enum(['happy', 'neutral', 'sad', 'tired', 'stressed'], {
      message: t('moodInvalid'),
    }),

    energy: score,
    stress: score,

    likedToday: text,
    dislikedToday: text,
    needsFromPartner: text,
    note: text,
  })
}

export type DailyCheckinFormValues = z.infer<
  ReturnType<typeof createDailyCheckinSchema>
>