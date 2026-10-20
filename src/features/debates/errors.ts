export type DebateErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'roomLimitReached'
  | 'rateLimited'
  | 'aiFailed'
  | 'network'
  | 'unknown'

export type DebateErrorParams = Record<string, string | number>

export class DebateApiError extends Error {
  key: DebateErrorKey
  params?: DebateErrorParams

  constructor(
    key: DebateErrorKey,
    options?: { message?: string; params?: DebateErrorParams },
  ) {
    super(options?.message ?? key)
    this.name = 'DebateApiError'
    this.key = key
    this.params = options?.params
  }
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
  // FunctionsHttpError membawa Response di sini
  context?: unknown
}

const codeMap: Record<string, DebateErrorKey> = {
  PGRST301: 'notAuthenticated', // JWT tidak valid / kedaluwarsa
  PGRST116: 'notFound', // 0 baris untuk .single()
  '42501': 'forbidden', // RLS / insufficient_privilege
  P0002: 'notFound', // no_data_found
  '22001': 'invalidInput', // string terlalu panjang
  '22P02': 'invalidInput', // format teks salah
  '23514': 'invalidInput', // check constraint
}

const NETWORK_PATTERN =
  /failed to fetch|networkerror|network request failed|load failed/i

function contextStatus(context: unknown): number | undefined {
  if (context && typeof context === 'object' && 'status' in context) {
    const status = (context as { status: unknown }).status
    return typeof status === 'number' ? status : undefined
  }
  return undefined
}

export function toDebateError(error: SupabaseLikeError): DebateApiError {
  const make = (key: DebateErrorKey) =>
    new DebateApiError(key, { message: error.message })

  // 1. Edge Function: gagal menjangkau server
  if (error.name === 'FunctionsFetchError') return make('network')

  // 2. Status HTTP (database/storage atau Edge Function)
  const status = error.status ?? contextStatus(error.context)

  if (status === 401) return make('notAuthenticated')
  if (status === 403) return make('forbidden')
  if (status === 429) return make('rateLimited')

  // 3. Kode error Postgres / PostgREST
  if (error.code && codeMap[error.code]) return make(codeMap[error.code])

  // 4. Edge Function lain yang gagal = AI gagal merespons
  if (
    error.name === 'FunctionsHttpError' ||
    error.name === 'FunctionsRelayError'
  ) {
    return make('aiFailed')
  }

  // 5. Masalah jaringan
  if (status === 0 || NETWORK_PATTERN.test(error.message)) {
    return make('network')
  }

  return make('unknown')
}

export function getDebateErrorKey(error: unknown): DebateErrorKey {
  return error instanceof DebateApiError ? error.key : 'unknown'
}

export function getDebateErrorParams(
  error: unknown,
): DebateErrorParams | undefined {
  return error instanceof DebateApiError ? error.params : undefined
}