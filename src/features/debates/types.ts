export type DebateStatus =
  | 'active'
  | 'pending_verdict'
  | 'resolved'
  | 'archived'

export type DebateMessageRole = 'user' | 'ai'

export interface DebateAnalysis {
  facts: string[]
  opinions: string[]
  common_ground: string
  summary: string
  stronger_argument?: string
}

export interface DebateMessageSender {
  display_name: string | null
  username: string | null
  avatar_url: string | null
}

export type AiProvider = 'openrouter' | 'groq'

export interface DebateMessage {
  id: string
  debate_id: string
  sender_id: string | null
  role: DebateMessageRole
  content: string
  ai_analysis: DebateAnalysis | null
  is_final_verdict: boolean
  ai_provider: AiProvider | null
  created_at: string
  profiles?: DebateMessageSender | null
}

export interface Debate {
  id: string
  relationship_id: string
  created_by: string
  title: string
  status: DebateStatus
  max_messages: number
  resolved_at: string | null
  ai_processing_requested_by: string | null
  ai_processing_started_at: string | null
  created_at: string
  updated_at: string
}