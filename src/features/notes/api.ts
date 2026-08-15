import { createClient } from '@/lib/supabase/client'
import type { NoteWithDetails } from './types'
import type { CreateNoteFormValues } from './schemas'

export async function getNotes(
  relationshipId: string,
): Promise<NoteWithDetails[]> {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase.rpc(
    'get_relationship_notes',
    {
      p_relationship_id: relationshipId,
    },
  )

  if (error) {
    throw new Error(error.message)
  }

  return (data as NoteWithDetails[]) ?? []
}

export async function createNote({
  relationshipId,
  values,
}: {
  relationshipId: string
  values: CreateNoteFormValues
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data: note,
    error,
  } = await supabase
    .from('notes')
    .insert({
      relationship_id: relationshipId,
      created_by: user.id,
      last_edited_by: user.id,
      title: values.title,
      content: values.content || null,
      category: values.category || null,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  if (values.checklistItems?.length) {
    const {
      error: checklistError,
    } = await supabase
      .from('note_checklist_items')
      .insert(
        values.checklistItems.map(
          (content, index) => ({
            note_id: note.id,
            content,
            position: index,
          }),
        ),
      )

    if (checklistError) {
      throw new Error(checklistError.message)
    }
  }

  return note
}

export async function updateNote({
  noteId,
  values,
}: {
  noteId: string
  values: Pick<
    CreateNoteFormValues,
    'title' | 'content' | 'category'
  >
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    throw new Error('Not authenticated')
  }

  const {
    data,
    error,
  } = await supabase
    .from('notes')
    .update({
      title: values.title,
      content: values.content || null,
      category: values.category || null,
      last_edited_by: user.id,
    })
    .eq('id', noteId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteNote(noteId: string) {
  const supabase = createClient()

  const { error } = await supabase
    .from('notes')
    .delete()
    .eq('id', noteId)

  if (error) {
    throw new Error(error.message)
  }

  return noteId
}

export async function toggleNotePin({
  noteId,
  isPinned,
}: {
  noteId: string
  isPinned: boolean
}) {
  const supabase = createClient()

  const { error } = await supabase
    .from('notes')
    .update({ is_pinned: isPinned })
    .eq('id', noteId)

  if (error) {
    throw new Error(error.message)
  }

  return noteId
}

export async function toggleNoteFavorite({
  noteId,
  isFavorite,
}: {
  noteId: string
  isFavorite: boolean
}) {
  const supabase = createClient()

  const { error } = await supabase
    .from('notes')
    .update({ is_favorite: isFavorite })
    .eq('id', noteId)

  if (error) {
    throw new Error(error.message)
  }

  return noteId
}

export async function addChecklistItem({
  noteId,
  content,
  position,
}: {
  noteId: string
  content: string
  position: number
}) {
  const supabase = createClient()

  const {
    data,
    error,
  } = await supabase
    .from('note_checklist_items')
    .insert({
      note_id: noteId,
      content,
      position,
    })
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function toggleChecklistItem({
  itemId,
  isCompleted,
}: {
  itemId: string
  isCompleted: boolean
}) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const {
    data,
    error,
  } = await supabase
    .from('note_checklist_items')
    .update({
      is_completed: isCompleted,
      completed_by: isCompleted
        ? user?.id ?? null
        : null,
      completed_at: isCompleted
        ? new Date().toISOString()
        : null,
    })
    .eq('id', itemId)
    .select()
    .single()

  if (error) {
    throw new Error(error.message)
  }

  return data
}

export async function deleteChecklistItem(
  itemId: string,
) {
  const supabase = createClient()

  const { error } = await supabase
    .from('note_checklist_items')
    .delete()
    .eq('id', itemId)

  if (error) {
    throw new Error(error.message)
  }

  return itemId
}