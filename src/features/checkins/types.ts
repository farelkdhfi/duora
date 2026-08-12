export type Mood =
  | 'happy'
  | 'neutral'
  | 'sad'
  | 'tired'
  | 'stressed'

export interface DailyCheckin { 
    id: string 
    relationship_id: string 
    user_id: string 
    checkin_date: string 
    mood: Mood 
    energy: number 
    stress: number 
    liked_today: string | null 
    disliked_today: string | null 
    needs_from_partner: string | null 
    note: string | null 
    created_at: string 
    updated_at: string 
}