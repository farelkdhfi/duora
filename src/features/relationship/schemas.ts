import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'relationship.validation'>>

export const NAME_MIN_LENGTH = 4
export const NAME_MAX_LENGTH = 17
export const MAX_YEARS_AGO = 100

// Batas tanggal paling lama (format YYYY-MM-DD, pakai waktu lokal)
function formatLocalDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function getMinStartedAt() {
  const date = new Date()
  date.setFullYear(date.getFullYear() - MAX_YEARS_AGO)

  return formatLocalDate(date)
}

export function getMaxStartedAt() {
  return formatLocalDate(new Date())
}

export function createRelationshipSchema(t: ValidationT) {
  return z.object({
    relationshipName: z
      .string()
      .trim()
      .min(1, t('nameRequired'))
      .min(NAME_MIN_LENGTH, t('nameMin', { min: NAME_MIN_LENGTH }))
      .max(NAME_MAX_LENGTH, t('nameMax', { max: NAME_MAX_LENGTH })),

    startedAt: z
      .string()
      .min(1, t('startedAtRequired'))
      .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        t('startedAtInvalid'),
      )
      .refine(
        (value) => value >= getMinStartedAt(),
        t('startedAtTooOld', { years: MAX_YEARS_AGO }),
      )
      .refine(
        (value) => value <= getMaxStartedAt(),
        t('startedAtFuture'),
      ),
  })
}

export function createJoinRelationshipSchema(t: ValidationT) {
  return z.object({
    inviteCode: z
      .string()
      .trim()
      .min(8, t('inviteCodeRequired'))
      .max(8, t('inviteCodeInvalid')),
  })
}

export type CreateRelationshipFormValues = z.infer<
  ReturnType<typeof createRelationshipSchema>
>

export type JoinRelationshipFormValues = z.infer<
  ReturnType<typeof createJoinRelationshipSchema>
>