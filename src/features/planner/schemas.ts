import { z } from 'zod'

export const createPlannerEventSchema = z
    .object({
        title: z
            .string()
            .min(2, 'Title is required')
            .max(100),

        description: z
            .string()
            .max(500)
            .optional(),

        category: z.enum([
            'relationship',
            'finance',
            'birthday',
            'anniversary',
            'travel',
            'health',
            'work',
            'other'
        ]),

        eventDate: z
            .string()
            .min(1, 'Date is required'),

        startTime: z
            .string()
            .optional(),

        endTime: z
            .string()
            .optional(),

        isAllDay: z.boolean(),
    })
    .refine(
        (data) => {
            if (
                data.isAllDay ||
                !data.startTime ||
                !data.endTime
            ) {
                return true
            }

            return data.endTime >= data.startTime
        },
        {
            message:
                'End time must be after start time',
            path: ['endTime'],
        },
    )

export type CreatePlannerEventFormValues =
    z.infer<typeof createPlannerEventSchema>