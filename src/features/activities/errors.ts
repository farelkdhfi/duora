export type ActivityErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'network'
  | 'unknown'

export class ActivityApiError extends Error {
  key: ActivityErrorKey

  constructor(key: ActivityErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'ActivityApiError'
    this.key = key
  }
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
}

const codeMap: Record<string, ActivityErrorKey> = {
  PGRST301: 'notAuthenticated', // JWT tidak valid / kedaluwarsa
  '42501': 'forbidden', // RLS / insufficient_privilege
}

const NETWORK_PATTERN =
  /failed to fetch|networkerror|network request failed|load failed/i

export function toActivityError(error: SupabaseLikeError): ActivityApiError {
  if (error.code && codeMap[error.code]) {
    return new ActivityApiError(codeMap[error.code], error.message)
  }

  if (error.status === 401) {
    return new ActivityApiError('notAuthenticated', error.message)
  }

  if (error.status === 403) {
    return new ActivityApiError('forbidden', error.message)
  }

  if (error.status === 0 || NETWORK_PATTERN.test(error.message)) {
    return new ActivityApiError('network', error.message)
  }

  return new ActivityApiError('unknown', error.message)
}

export function getActivityErrorKey(error: unknown): ActivityErrorKey {
  return error instanceof ActivityApiError ? error.key : 'unknown'
}