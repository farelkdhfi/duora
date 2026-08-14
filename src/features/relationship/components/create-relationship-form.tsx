'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'

import {
  createRelationshipSchema,
  type CreateRelationshipFormValues,
} from '../schemas'

import { createRelationship } from '../api'
import { relationshipKeys } from '../queries'

export default function CreateRelationshipForm() {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateRelationshipFormValues>({
    resolver: zodResolver(createRelationshipSchema),
  })

  const mutation = useMutation({
    mutationFn: createRelationship,

    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: relationshipKeys.all,
      })
    },
  })

  function onSubmit(values: CreateRelationshipFormValues) {
    mutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          Relationship name
        </label>

        <input
          {...register('relationshipName')}
          placeholder="Michael & Claudia"
          className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm outline-none transition-shadow placeholder:text-neutral-400 focus:border-pink-200 focus:ring-4 focus:ring-pink-50"
        />

        {errors.relationshipName && (
          <p className="mt-1.5 text-xs text-rose-500">
            {errors.relationshipName.message}
          </p>
        )}
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-neutral-700">
          When did your relationship start?
        </label>

        <input
          {...register('startedAt')}
          type="date"
          className="w-full rounded-xl border border-black/[0.08] bg-white px-4 py-2.5 text-sm text-neutral-700 outline-none transition-shadow focus:border-pink-200 focus:ring-4 focus:ring-pink-50"
        />

        {errors.startedAt && (
          <p className="mt-1.5 text-xs text-rose-500">
            {errors.startedAt.message}
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
        {mutation.isPending ? 'Creating...' : 'Create Relationship'}
      </button>
    </form>
  )
}