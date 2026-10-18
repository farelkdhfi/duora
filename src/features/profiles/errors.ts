export type ProfileErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'network'
  | 'unknown'

export class ProfileApiError extends Error {
  key: ProfileErrorKey

  constructor(key: ProfileErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'ProfileApiError'
    this.key = key
  }
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
}

const codeMap: Record<string, ProfileErrorKey> = {
  PGRST301: 'notAuthenticated', // JWT tidak valid / kedaluwarsa
  '42501': 'forbidden', // RLS / insufficient_privilege
  '22001': 'invalidInput', // string terlalu panjang
  '22P02': 'invalidInput', // format teks salah
  '23514': 'invalidInput', // check constraint
}

const NETWORK_PATTERN =
  /failed to fetch|networkerror|network request failed|load failed/i

export function toProfileError(error: SupabaseLikeError): ProfileApiError {
  if (error.code && codeMap[error.code]) {
    return new ProfileApiError(codeMap[error.code], error.message)
  }

  if (error.status === 401) {
    return new ProfileApiError('notAuthenticated', error.message)
  }

  if (error.status === 403) {
    return new ProfileApiError('forbidden', error.message)
  }

  if (error.status === 0 || NETWORK_PATTERN.test(error.message)) {
    return new ProfileApiError('network', error.message)
  }

  return new ProfileApiError('unknown', error.message)
}

export function getProfileErrorKey(error: unknown): ProfileErrorKey {
  return error instanceof ProfileApiError ? error.key : 'unknown'
}