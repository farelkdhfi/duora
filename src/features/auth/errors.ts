export type AuthErrorKey =
  | 'invalidCredentials'
  | 'emailNotConfirmed'
  | 'emailTaken'
  | 'weakPassword'
  | 'rateLimited'
  | 'invalidEmail'
  | 'signupDisabled'
  | 'userBanned'
  | 'network'
  | 'unknown'

export class AuthApiError extends Error {
  key: AuthErrorKey

  constructor(key: AuthErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'AuthApiError'
    this.key = key
  }
}

const codeMap: Record<string, AuthErrorKey> = {
  invalid_credentials: 'invalidCredentials',
  email_not_confirmed: 'emailNotConfirmed',
  user_already_exists: 'emailTaken',
  email_exists: 'emailTaken',
  weak_password: 'weakPassword',
  over_request_rate_limit: 'rateLimited',
  over_email_send_rate_limit: 'rateLimited',
  email_address_invalid: 'invalidEmail',
  signup_disabled: 'signupDisabled',
  user_banned: 'userBanned',
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
}

export function toAuthError(error: SupabaseLikeError): AuthApiError {
  // 1. Pakai error.code dari Supabase (paling andal)
  if (error.code && codeMap[error.code]) {
    return new AuthApiError(codeMap[error.code], error.message)
  }

  // 2. Fallback status HTTP
  if (error.status === 429) {
    return new AuthApiError('rateLimited', error.message)
  }

  // 3. Masalah jaringan
  if (error.name === 'AuthRetryableFetchError' || error.status === 0) {
    return new AuthApiError('network', error.message)
  }

  // 4. Fallback terakhir buat versi Supabase lama yang belum punya code
  if (/invalid login credentials/i.test(error.message)) {
    return new AuthApiError('invalidCredentials', error.message)
  }

  return new AuthApiError('unknown', error.message)
}

export function getAuthErrorKey(error: unknown): AuthErrorKey {
  return error instanceof AuthApiError ? error.key : 'unknown'
}