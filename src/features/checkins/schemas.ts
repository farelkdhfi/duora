import { z } from 'zod'

export const dailyCheckinSchema =
    z.object({
        mood: z.enum([
            'happy',
            'neutral',
            'sad',
            'tired',
            'stressed'
        ]),

        energy: z
            .number()
            .int()
            .min(1)
            .max(10),

        stress: z
            .number()
            .int()
            .min(1)
            .max(10),

        likedToday: z
            .string()
            .max(500)
            .optional(),

        dislikedToday: z
            .string()
            .max(500)
            .optional(),

        needsFromPartner: z
            .string()
            .max(500)
            .optional(),

        note: z
            .string()
            .max(500)
            .optional(),
    })

export type DailyCheckinFormValues =
    z.infer<
        typeof dailyCheckinSchema
    >