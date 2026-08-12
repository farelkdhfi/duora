export type PlannerEventCategory =
  |'relationship'
  |'finance'
  |'birthday'
  |'anniversary'
  |'travel'
  |'health'
  |'work'
  |'other'

export interface PlannerEvent {
  id: string
  relationship_id: string
  created_by: string
  title: string
  description: string | null
  category: PlannerEventCategory
  event_date: string
  start_time: string | null
  end_time: string | null
  is_all_day: boolean
  created_at: string
  updated_at: string
}