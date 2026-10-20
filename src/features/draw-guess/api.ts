import { createClient } from '@/lib/supabase/client'
import type {
  DrawChemistry,
  DrawChoice,
  DrawClue,
  DrawGuess,
  DrawRound,
  GuessResult,
} from './types'

export async function startDrawSession(): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('start_draw_session')
  if (error) throw new Error(error.message)
  return data?.[0]?.session_id
}

export async function getCurrentRound(): Promise<DrawRound | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_current_draw_round')
  if (error) throw new Error(error.message)
  return data?.[0] ?? null
}

export async function getDrawChoices(roundId: string): Promise<DrawChoice[]> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_draw_choices', {
    p_round_id: roundId,
  })
  if (error) throw new Error(error.message)
  return data ?? []
}

export async function chooseDrawWord(roundId: string, wordId: string) {
  const supabase = createClient()
  const { error } = await supabase.rpc('choose_draw_word', {
    p_round_id: roundId,
    p_word_id: wordId,
  })
  if (error) throw new Error(error.message)
}

export async function submitDrawGuess(
  roundId: string,
  guess: string,
): Promise<GuessResult> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('submit_draw_guess', {
    p_round_id: roundId,
    p_guess: guess,
  })
  if (error) throw new Error(error.message)
  return data as GuessResult
}

export async function expireDrawRound(roundId: string) {
  const supabase = createClient()
  const { error } = await supabase.rpc('expire_draw_round', {
    p_round_id: roundId,
  })
  if (error) throw new Error(error.message)
}

export async function nextDrawRound(sessionId: string): Promise<string> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('next_draw_round', {
    p_session_id: sessionId,
  })
  if (error) throw new Error(error.message)
  return data?.[0]?.round_id
}

export async function endDrawSession() {
  const supabase = createClient()
  const { error } = await supabase.rpc('end_draw_session')
  if (error) throw new Error(error.message)
}

export async function getDrawChemistry(): Promise<DrawChemistry | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_draw_chemistry')
  if (error) throw new Error(error.message)
  return data?.[0] ?? null
}

export async function getRoundGuesses(roundId: string): Promise<DrawGuess[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('draw_guesses')
    .select('id, round_id, user_id, guess_text, is_correct, created_at')
    .eq('round_id', roundId)
    .order('created_at', { ascending: true })
  if (error) throw new Error(error.message)
  return (data ?? []) as DrawGuess[]
}

export async function getDrawClue(roundId: string): Promise<DrawClue | null> {
  const supabase = createClient()
  const { data, error } = await supabase.rpc('get_draw_clue', { p_round_id: roundId })
  if (error) throw new Error(error.message)
  return data?.[0] ?? null
}