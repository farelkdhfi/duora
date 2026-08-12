export interface Goal {
  id: string
  relationship_id: string
  created_by: string
  title: string
  description: string | null
  category:
    | 'wedding'
    | 'house'
    | 'vacation'
    | 'education'
    | 'business'
    | 'savings'
    | 'personal'
    | 'other'
  target_amount: number | null
  deadline: string | null
  cover_image_url: string | null
  created_at: string
  updated_at: string
}

export interface GoalChecklist {
  id: string
  goal_id: string
  title: string
  is_completed: boolean
  completed_by: string | null
  completed_at: string | null
  position: number
  created_at: string
  updated_at: string
}