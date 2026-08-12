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

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: relationshipKeys.mine(),
      })
    },
  })

  function onSubmit(values: CreateRelationshipFormValues) {
    mutation.mutate(values)
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
    >
      <div>
        <label>
          Relationship name
        </label>

        <input
          {...register('relationshipName')}
          placeholder="Farel & Aisyah"
        />

        {errors.relationshipName && (
          <p>
            {errors.relationshipName.message}
          </p>
        )}
      </div>

      <div>
        <label>
          When did your relationship start?
        </label>

        <input
          {...register('startedAt')}
          type="date"
        />

        {errors.startedAt && (
          <p>
            {errors.startedAt.message}
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
          ? 'Creating...'
          : 'Create Relationship'}
      </button>
    </form>
  )
}