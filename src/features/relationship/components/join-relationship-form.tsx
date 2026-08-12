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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: relationshipKeys.mine(),
      })
    },
  })

  function onSubmit(values: JoinRelationshipFormValues) {
    mutation.mutate(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <label>
          Invite code
        </label>

        <input
          {...register('inviteCode')}
          placeholder="A83KD92F"
          maxLength={8}
          className="uppercase"
        />

        {errors.inviteCode && (
          <p>
            {errors.inviteCode.message}
          </p>
        )}
      </div>

      {mutation.error && (
        <p>
          {mutation.error.message}
        </p>
      )}

      <button
        type="submit"
        disabled={mutation.isPending}
      >
        {mutation.isPending
          ? 'Joining...'
          : 'Join Relationship'}
      </button>
    </form>
  )
}