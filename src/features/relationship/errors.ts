export type RelationshipErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'noRelationship'
  | 'alreadyInRelationship'
  | 'invalidInviteCode'
  | 'relationshipFull'
  | 'confirmationMismatch'
  | 'partnerAlreadyJoined'
  | 'network'
  | 'unknown'

export class RelationshipApiError extends Error {
  key: RelationshipErrorKey

  constructor(key: RelationshipErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'RelationshipApiError'
    this.key = key
  }
}

type SupabaseLikeError = {
  message: string
  code?: string
  status?: number
  name?: string
}

const codeMap: Record<string, RelationshipErrorKey> = {
  // PostgREST
  PGRST301: 'notAuthenticated', // JWT tidak valid / kedaluwarsa
  PGRST116: 'notFound', // 0 baris untuk .single()
  // Postgres
  '42501': 'forbidden', // insufficient_privilege / RLS
  P0002: 'notFound', // no_data_found
  '22001': 'invalidInput', // string terlalu panjang
  '22007': 'invalidInput', // format tanggal salah
  '22023': 'invalidInput', // invalid_parameter_value
  '22P02': 'invalidInput', // format teks salah
  '23514': 'invalidInput', // check constraint
}

// Pesan custom dari RAISE EXCEPTION di fungsi SQL (SQLSTATE P0001).
// Teks harus sama persis dengan yang ada di SQL.
const messageMap: [string, RelationshipErrorKey][] = [
  ['CONFIRMATION_MISMATCH', 'confirmationMismatch'],
  ['PARTNER_ALREADY_JOINED', 'partnerAlreadyJoined'],
  ['Not authenticated', 'notAuthenticated'],
  ['User is not part of any relationship', 'noRelationship'],
  ['User already belongs to a relationship', 'alreadyInRelationship'],
  ['Invalid invite code', 'invalidInviteCode'],
  ['This relationship already has two members', 'relationshipFull'],
  ['Relationship name cannot be empty', 'invalidInput'],
]

const NETWORK_PATTERN =
  /failed to fetch|networkerror|network request failed|load failed/i

export function toRelationshipError(
  error: SupabaseLikeError,
): RelationshipApiError {
  // 1. Pesan custom dari fungsi SQL
  for (const [needle, key] of messageMap) {
    if (error.message.includes(needle)) {
      return new RelationshipApiError(key, error.message)
    }
  }

  // 2. Kode error Postgres / PostgREST
  if (error.code && codeMap[error.code]) {
    return new RelationshipApiError(codeMap[error.code], error.message)
  }

  // 3. Fallback status HTTP
  if (error.status === 401) {
    return new RelationshipApiError('notAuthenticated', error.message)
  }

  if (error.status === 403) {
    return new RelationshipApiError('forbidden', error.message)
  }

  // 4. Masalah jaringan
  if (error.status === 0 || NETWORK_PATTERN.test(error.message)) {
    return new RelationshipApiError('network', error.message)
  }

  return new RelationshipApiError('unknown', error.message)
}

export function getRelationshipErrorKey(error: unknown): RelationshipErrorKey {
  return error instanceof RelationshipApiError ? error.key : 'unknown'
}