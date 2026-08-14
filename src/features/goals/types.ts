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

export interface Saving {
  id: string
  goal_id: string
  user_id: string
  amount: number
  note: string | null
  created_at: string
}

export interface GoalWithSavings extends Goal {
  savings: Saving[]
}