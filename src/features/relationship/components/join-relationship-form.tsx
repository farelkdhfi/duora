'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  joinRelationshipSchema,
  type JoinRelationshipFormValues,
} from '../schemas'

import { joinRelationship } from '../api'
import { relationshipKeys } from '../queries'

export default function JoinRelationshipForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinRelationshipFormValues>({
    resolver: zodResolver(joinRelationshipSchema),
  })

  const mutation = useMutation({
    mutationFn: ({ inviteCode }: JoinRelationshipFormValues) =>
      joinRelationship(inviteCode),

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: relationshipKeys.all,
      })
    },
  })

  function onSubmit(values: JoinRelationshipFormValues) {
    mutation.mutate(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5"
    >
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Invite code
        </label>

        <input
          {...register('inviteCode')}
          placeholder="A83KD92F"
          maxLength={8}
          className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-center text-sm uppercase tracking-[0.2em] outline-none transition-shadow placeholder:tracking-normal placeholder:text-neutral-400 focus:border-blue-200 focus:ring-4 focus:ring-blue-50"
        />

        {errors.inviteCode && (
          <p className="mt-1.5 text-xs text-rose-500">
            {errors.inviteCode.message}
          </p>
        )}
      </div>

      {mutation.error && (
        <p className="rounded-lg bg-rose-50 px-3 py-2 text-xs text-rose-500">
          {mutation.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
        className="w-full rounded-xl bg-gradient-to-br from-neutral-900 to-neutral-800 py-2.5 text-sm font-medium text-white shadow-sm transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {mutation.isPending ? 'Joining...' : 'Join Relationship'}
      </button>
    </form>
  )
}