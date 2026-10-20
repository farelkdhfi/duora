export type QnaErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'exhausted'
  | 'network'
  | 'unknown'

export class QnaApiError extends Error {
  key: QnaErrorKey

  constructor(key: QnaErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'QnaApiError'
    this.key = key
  }
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
}

const codeMap: Record<string, QnaErrorKey> = {
  PGRST301: 'notAuthenticated', // JWT tidak valid / kedaluwarsa
  '42501': 'forbidden', // RLS / insufficient_privilege
  P0002: 'notFound', // no_data_found
  '22P02': 'invalidInput', // format teks salah
  '23514': 'invalidInput', // check constraint
}

// Pesan custom dari RAISE EXCEPTION di fungsi SQL.
// Teks harus sama persis dengan yang ada di SQL.
const messageMap: [string, QnaErrorKey][] = [
  ['QNA_EXHAUSTED', 'exhausted'],
]

const NETWORK_PATTERN =
  /failed to fetch|networkerror|network request failed|load failed/i

export function toQnaError(error: SupabaseLikeError): QnaApiError {
  for (const [needle, key] of messageMap) {
    if (error.message.includes(needle)) {
      return new QnaApiError(key, error.message)
    }
  }

  if (error.code && codeMap[error.code]) {
    return new QnaApiError(codeMap[error.code], error.message)
  }

  if (error.status === 401) {
    return new QnaApiError('notAuthenticated', error.message)
  }

  if (error.status === 403) {
    return new QnaApiError('forbidden', error.message)
  }

  if (error.status === 0 || NETWORK_PATTERN.test(error.message)) {
    return new QnaApiError('network', error.message)
  }

  return new QnaApiError('unknown', error.message)
}

export function getQnaErrorKey(error: unknown): QnaErrorKey {
  return error instanceof QnaApiError ? error.key : 'unknown'
}