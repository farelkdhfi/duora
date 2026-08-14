export interface Relationship {
  id: string
  relationship_name: string
  invite_code: string
  started_at: string | null
  created_at: string
  updated_at: string
}

export interface RelationshipMember {
  user_id: string
  username: string | null
  display_name: string | null
  avatar_url: string | null
  joined_at: string
}

export interface RelationshipDetails {
  relationship: {
    id: string
    name: string
    invite_code: string
    started_at: string | null
  }

  members: RelationshipMember[]
}