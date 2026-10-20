export type DrawDifficulty = 'easy' | 'medium' | 'hard'
export type DrawRoundStatus = 'choosing' | 'drawing' | 'guessed' | 'timeout'
export type GuessResult = 'correct' | 'wrong' | 'timeout' | 'closed'

export interface DrawRound {
  round_id: string
  session_id: string
  round_number: number
  drawer_id: string
  status: DrawRoundStatus
  is_drawer: boolean
  started_at: string | null
  ends_at: string | null
  server_now: string
  secret_word: string | null // hanya terisi untuk penggambar saat drawing, atau untuk keduanya setelah ronde selesai
  guessed_by: string | null
}

export interface DrawChoice {
  word_id: string
  word: string
  difficulty: DrawDifficulty
}

export interface DrawChemistry {
  total_points: number
  correct_count: number
  words_total: number
  words_remaining: number
}

export interface DrawGuess {
  id: string
  round_id: string
  user_id: string
  guess_text: string
  is_correct: boolean
  created_at: string
}

export interface Stroke {
  id: string
  color: string
  size: number // satuan relatif terhadap lebar 600
  points: [number, number][] // koordinat ternormalisasi 0..1
}

export interface DrawClue {
  pattern: string // contoh: "b_____" lalu "b___e_"
  hint_level: number
  next_hint_in_ms: number | null // sisa waktu sampai clue berikutnya, null kalau tidak ada lagi
}