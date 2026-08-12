import { z } from 'zod'

export const createRelationshipSchema = z.object({
  relationshipName: z
    .string()
    .min(2, 'Relationship name is required')
    .max(50),

  startedAt: z
    .string()
    .optional(),
})

export const joinRelationshipSchema = z.object({
  inviteCode: z
    .string()
    .trim()
    .min(8, 'Invite code is required')
    .max(8, 'Invalid invite code'),
})

export type CreateRelationshipFormValues =
  z.infer<typeof createRelationshipSchema>

export type JoinRelationshipFormValues =
  z.infer<typeof joinRelationshipSchema>