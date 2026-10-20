import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  chooseDrawWord,
  endDrawSession,
  expireDrawRound,
  getCurrentRound,
  getDrawChemistry,
  getDrawChoices,
  getRoundGuesses,
  nextDrawRound,
  startDrawSession,
  submitDrawGuess,
} from './api'

export const drawKeys = {
  all: ['draw-guess'] as const,
  round: () => [...drawKeys.all, 'round'] as const,
  choices: (roundId: string) => [...drawKeys.all, 'choices', roundId] as const,
  guesses: (roundId: string) => [...drawKeys.all, 'guesses', roundId] as const,
  chemistry: () => [...drawKeys.all, 'chemistry'] as const,
}

export function useCurrentRound() {
  return useQuery({ queryKey: drawKeys.round(), queryFn: getCurrentRound })
}

export function useDrawChoices(roundId: string | undefined, enabled: boolean) {
  return useQuery({
    queryKey: drawKeys.choices(roundId ?? ''),
    queryFn: () => getDrawChoices(roundId as string),
    enabled: !!roundId && enabled,
    staleTime: Infinity, // pilihan tidak boleh berubah selama ronde
  })
}

export function useRoundGuesses(roundId: string | undefined) {
  return useQuery({
    queryKey: drawKeys.guesses(roundId ?? ''),
    queryFn: () => getRoundGuesses(roundId as string),
    enabled: !!roundId,
  })
}

export function useDrawChemistry() {
  return useQuery({ queryKey: drawKeys.chemistry(), queryFn: getDrawChemistry })
}

function useInvalidateRound() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: drawKeys.round() })
    qc.invalidateQueries({ queryKey: drawKeys.chemistry() })
  }
}

export function useStartDrawSession() {
  const invalidate = useInvalidateRound()
  return useMutation({ mutationFn: startDrawSession, onSuccess: invalidate })
}

export function useChooseDrawWord() {
  const invalidate = useInvalidateRound()
  return useMutation({
    mutationFn: ({ roundId, wordId }: { roundId: string; wordId: string }) =>
      chooseDrawWord(roundId, wordId),
    onSuccess: invalidate,
  })
}

export function useSubmitDrawGuess() {
  const invalidate = useInvalidateRound()
  return useMutation({
    mutationFn: ({ roundId, guess }: { roundId: string; guess: string }) =>
      submitDrawGuess(roundId, guess),
    onSuccess: (_r, v) => {
      invalidate()
    },
  })
}

export function useExpireDrawRound() {
  const invalidate = useInvalidateRound()
  return useMutation({ mutationFn: expireDrawRound, onSuccess: invalidate })
}

export function useNextDrawRound() {
  const invalidate = useInvalidateRound()
  return useMutation({ mutationFn: nextDrawRound, onSuccess: invalidate })
}

export function useEndDrawSession() {
  const invalidate = useInvalidateRound()
  return useMutation({ mutationFn: endDrawSession, onSuccess: invalidate })
}