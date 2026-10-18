export type SavingErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'network'
  | 'unknown'

export class SavingApiError extends Error {
  key: SavingErrorKey

  constructor(key: SavingErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'SavingApiError'
    this.key = key
  }
}

/** Kode error PostgREST / Postgres -> key terjemahan */
const codeMap: Record<string, SavingErrorKey> = {
  '42501': 'forbidden', // RLS / insufficient privilege
  PGRST301: 'notAuthenticated', // JWT expired / invalid
  PGRST116: 'notFound', // .single() tidak menemukan baris
  '22007': 'invalidInput',
  '22008': 'invalidInput',
  '22P02': 'invalidInput',
  '23502': 'invalidInput', // not-null violation
  '23503': 'invalidInput', // foreign key violation
  '23514': 'invalidInput', // check constraint
}

type SupabaseLikeError = {
  message: string
  code?: string
  name?: string
}

export function toSavingError(
  error: SupabaseLikeError,
  status?: number,
): SavingApiError {
  // 1. Pakai error.code (paling andal)
  if (error.code && codeMap[error.code]) {
    return new SavingApiError(codeMap[error.code], error.message)
  }

  // 2. Fallback status HTTP
  if (status === 401) return new SavingApiError('notAuthenticated', error.message)
  if (status === 403) return new SavingApiError('forbidden', error.message)

  // 3. Masalah jaringan
  if (
    status === 0 ||
    /failed to fetch|fetch failed|networkerror|network request failed/i.test(
      error.message,
    )
  ) {
    return new SavingApiError('network', error.message)
  }

  return new SavingApiError('unknown', error.message)
}

export function getSavingErrorKey(error: unknown): SavingErrorKey {
  return error instanceof SavingApiError ? error.key : 'unknown'
}