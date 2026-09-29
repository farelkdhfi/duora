// countdown/types.ts

export interface MeetupCountdown {
  id: string;
  relationship_id: string;

  title: string;
  description: string | null;
  location: string | null;
  meetup_date: string;

  location_user_a_id: string | null;
  location_user_a_text: string | null;

  location_user_b_id: string | null;
  location_user_b_text: string | null;

  distance_km: number | null;

  is_completed: boolean;
  completed_at: string | null;

  created_by: string;

  created_at: string;
  updated_at: string;
}

export interface CountdownMember {
  user_id: string;
  display_name: string | null;
  avatar_url: string | null;
}

export interface CreateCountdownInput {
  relationship_id: string;
  title: string;
  description?: string | null;
  location?: string | null;
  meetup_date: string;

  location_user_a_id?: string | null;
  location_user_a_text?: string | null;
  location_user_b_id?: string | null;
  location_user_b_text?: string | null;
  distance_km?: number | null;
}

export interface UpdateCountdownInput {
  id: string;
  title?: string;
  description?: string | null;
  location?: string | null;
  meetup_date?: string;
  is_completed?: boolean;
  completed_at?: string | null;
}