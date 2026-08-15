export interface NoteChecklistItem {
  id: string
  note_id: string
  content: string
  is_completed: boolean
  completed_by: string | null
  completed_at: string | null
  position: number
  created_at: string
  updated_at: string
}

export interface NoteProfile {
  id: string
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

export interface Note {
  id: string
  relationship_id: string
  created_by: string
  last_edited_by: string | null
  title: string
  content: string | null
  category: string | null
  is_favorite: boolean
  is_pinned: boolean
  created_at: string
  updated_at: string
}

export interface NoteWithDetails extends Note {
  checklist_items: NoteChecklistItem[]
  creator: NoteProfile | null
  editor: NoteProfile | null
}