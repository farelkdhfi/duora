export type GoalErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'network'
  | 'unknown'

export class GoalApiError extends Error {
  key: GoalErrorKey

  constructor(key: GoalErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'GoalApiError'
    this.key = key
  }
}

/** Kode error PostgREST / Postgres -> key terjemahan */
const codeMap: Record<string, GoalErrorKey> = {
  '42501': 'forbidden', // RLS / insufficient privilege
  PGRST301: 'notAuthenticated', // JWT expired / invalid
  PGRST116: 'notFound', // .single() tidak menemukan baris
  '22007': 'invalidInput',
  '22008': 'invalidInput',
  '22P02': 'invalidInput',
  '23502': 'invalidInput', // not-null violation
  '23514': 'invalidInput', // check constraint
}

type SupabaseLikeError = {
  message: string
  code?: string
  name?: string
}

export function toGoalError(
  error: SupabaseLikeError,
  status?: number,
): GoalApiError {
  // 1. Pakai error.code (paling andal)
  if (error.code && codeMap[error.code]) {
    return new GoalApiError(codeMap[error.code], error.message)
  }

  // 2. Fallback status HTTP
  if (status === 401) return new GoalApiError('notAuthenticated', error.message)
  if (status === 403) return new GoalApiError('forbidden', error.message)

  // 3. Masalah jaringan
  if (
    status === 0 ||
    /failed to fetch|fetch failed|networkerror|network request failed/i.test(
      error.message,
    )
  ) {
    return new GoalApiError('network', error.message)
  }

  return new GoalApiError('unknown', error.message)
}

export function getGoalErrorKey(error: unknown): GoalErrorKey {
  return error instanceof GoalApiError ? error.key : 'unknown'
}