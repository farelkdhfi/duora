export type PlannerErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'network'
  | 'unknown'

export class PlannerApiError extends Error {
  key: PlannerErrorKey

  constructor(key: PlannerErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'PlannerApiError'
    this.key = key
  }
}

/** Kode error PostgREST / Postgres -> key terjemahan */
const codeMap: Record<string, PlannerErrorKey> = {
  '42501': 'forbidden', // RLS / insufficient privilege
  PGRST301: 'notAuthenticated', // JWT expired / invalid
  PGRST116: 'notFound', // .single() tidak menemukan baris
  '22007': 'invalidInput', // format tanggal tidak valid
  '22008': 'invalidInput',
  '22P02': 'invalidInput', // format teks tidak valid
  '23502': 'invalidInput', // not-null violation
  '23514': 'invalidInput', // check constraint
}

type SupabaseLikeError = {
  message: string
  code?: string
  name?: string
}

export function toPlannerError(
  error: SupabaseLikeError,
  status?: number,
): PlannerApiError {
  // 1. Pakai error.code (paling andal)
  if (error.code && codeMap[error.code]) {
    return new PlannerApiError(codeMap[error.code], error.message)
  }

  // 2. Fallback status HTTP
  if (status === 401) return new PlannerApiError('notAuthenticated', error.message)
  if (status === 403) return new PlannerApiError('forbidden', error.message)

  // 3. Masalah jaringan
  if (
    status === 0 ||
    /failed to fetch|fetch failed|networkerror|network request failed/i.test(
      error.message,
    )
  ) {
    return new PlannerApiError('network', error.message)
  }

  return new PlannerApiError('unknown', error.message)
}

export function getPlannerErrorKey(error: unknown): PlannerErrorKey {
  return error instanceof PlannerApiError ? error.key : 'unknown'
}