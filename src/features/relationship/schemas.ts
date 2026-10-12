import { z } from 'zod'

export const NAME_MIN_LENGTH = 4
export const NAME_MAX_LENGTH = 17
export const MAX_YEARS_AGO = 100

// Batas tanggal paling lama (format YYYY-MM-DD, pakai waktu lokal)
export function getMinStartedAt() {
  const date = new Date()
  date.setFullYear(date.getFullYear() - MAX_YEARS_AGO)

  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const createRelationshipSchema = z.object({
  relationshipName: z
    .string()
    .trim()
    .min(1, 'Nama hubungan wajib diisi')
    .min(
      NAME_MIN_LENGTH,
      `Nama hubungan minimal ${NAME_MIN_LENGTH} karakter`,
    )
    .max(
      NAME_MAX_LENGTH,
      `Nama hubungan maksimal ${NAME_MAX_LENGTH} karakter`,
    ),

  startedAt: z
    .string()
    .min(1, 'Tanggal jadian wajib diisi')
    .refine(
      (value) => !Number.isNaN(Date.parse(value)),
      'Tanggal tidak valid',
    )
    .refine(
      (value) => value >= getMinStartedAt(),
      `Tanggal tidak boleh lebih dari ${MAX_YEARS_AGO} tahun lalu`,
    ),
})

export const joinRelationshipSchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .min(8, 'Kode undangan wajib diisi')
    .max(8, 'Kode undangan tidak valid'),
})

export type CreateRelationshipFormValues =
  z.infer<typeof createRelationshipSchema>

export type JoinRelationshipFormValues =
  z.infer<typeof joinRelationshipSchema>