export type NoteErrorKey =
  | 'notAuthenticated'
  | 'forbidden'
  | 'invalidInput'
  | 'notFound'
  | 'network'
  | 'unknown'

export class NoteApiError extends Error {
  key: NoteErrorKey

  constructor(key: NoteErrorKey, originalMessage?: string) {
    super(originalMessage ?? key)
    this.name = 'NoteApiError'
    this.key = key
  }
}

/** Kode error PostgREST / Postgres -> key terjemahan */
const codeMap: Record<string, NoteErrorKey> = {
  '42501': 'forbidden', // RLS / insufficient privilege
  PGRST301: 'notAuthenticated', // JWT expired / invalid
  PGRST116: 'notFound', // .single() tidak menemukan baris
  '22007': 'invalidInput',
  '22008': 'invalidInput',
  '22001': 'invalidInput', // string terlalu panjang untuk kolom
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

export function toNoteError(
  error: SupabaseLikeError,
  status?: number,
): NoteApiError {
  // 1. Pakai error.code (paling andal)
  if (error.code && codeMap[error.code]) {
    return new NoteApiError(codeMap[error.code], error.message)
  }

  // 2. Fallback status HTTP
  if (status === 401) return new NoteApiError('notAuthenticated', error.message)
  if (status === 403) return new NoteApiError('forbidden', error.message)

  // 3. Masalah jaringan
  if (
    status === 0 ||
    /failed to fetch|fetch failed|networkerror|network request failed/i.test(
      error.message,
    )
  ) {
    return new NoteApiError('network', error.message)
  }

  return new NoteApiError('unknown', error.message)
}

export function getNoteErrorKey(error: unknown): NoteErrorKey {
  return error instanceof NoteApiError ? error.key : 'unknown'
}