export type CheckinErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'network'
  | 'unknown'

export class CheckinApiError extends Error {
  key: CheckinErrorKey

  constructor(key: CheckinErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'CheckinApiError'
    this.key = key
  }
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
}

const codeMap: Record<string, CheckinErrorKey> = {
  PGRST301: 'notAuthenticated', // JWT tidak valid / kedaluwarsa
  '42501': 'forbidden', // RLS / insufficient_privilege
  '22001': 'invalidInput', // string terlalu panjang
  '22P02': 'invalidInput', // format teks salah
  '23514': 'invalidInput', // check constraint
}

const NETWORK_PATTERN =
  /failed to fetch|networkerror|network request failed|load failed/i

export function toCheckinError(error: SupabaseLikeError): CheckinApiError {
  if (error.code && codeMap[error.code]) {
    return new CheckinApiError(codeMap[error.code], error.message)
  }

  if (error.status === 401) {
    return new CheckinApiError('notAuthenticated', error.message)
  }

  if (error.status === 403) {
    return new CheckinApiError('forbidden', error.message)
  }

  if (error.status === 0 || NETWORK_PATTERN.test(error.message)) {
    return new CheckinApiError('network', error.message)
  }

  return new CheckinApiError('unknown', error.message)
}

export function getCheckinErrorKey(error: unknown): CheckinErrorKey {
  return error instanceof CheckinApiError ? error.key : 'unknown'
}