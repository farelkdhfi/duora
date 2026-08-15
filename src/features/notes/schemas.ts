import { z } from 'zod'

export const createNoteSchema = z.object({
  title: z
    .string()
    .min(1, 'Judul catatan wajib diisi')
    .max(200, 'Judul terlalu panjang'),

  content: z
    .string()
    .max(5000, 'Isi catatan terlalu panjang')
    .optional(),

  category: z
    .string()
    .max(50, 'Kategori terlalu panjang')
    .optional(),

  checklistItems: z
    .array(z.string().min(1))
    .optional(),
})

export type CreateNoteFormValues = z.infer<
  typeof createNoteSchema
>