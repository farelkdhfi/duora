import { z } from 'zod'
import type { useTranslations } from 'next-intl'

type ValidationT = ReturnType<typeof useTranslations<'auth.validation'>>

export function createLoginSchema(t: ValidationT) {
  return z.object({
    email: z.string().email(t('invalidEmail')),
    password: z.string().min(6, t('passwordMin', { min: 6 })),
  })
}

export function createRegisterSchema(t: ValidationT) {
  return z
    .object({
      username: z
        .string()
        .min(3, t('usernameMin', { min: 3 }))
        .max(30, t('usernameMax', { max: 30 }))
        .regex(/^[a-zA-Z0-9_]+$/, t('usernameFormat')),

      displayName: z
        .string()
        .min(2, t('displayNameMin', { min: 2 }))
        .max(50, t('displayNameMax', { max: 50 })),

      email: z.string().email(t('invalidEmail')),

      password: z.string().min(8, t('passwordMin', { min: 8 })),

      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('passwordMismatch'),
      path: ['confirmPassword'],
    })
}

export type LoginFormValues = z.infer<ReturnType<typeof createLoginSchema>>
export type RegisterFormValues = z.infer<ReturnType<typeof createRegisterSchema>>