export interface SavingTransaction {
  id: string
  relationship_id: string
  goal_id: string
  user_id: string
  amount: number
  note: string | null
  created_at: string
}

export interface SavingTransactionWithProfile
  extends SavingTransaction {
  profile: {
    display_name: string | null
    username: string | null
    avatar_url: string | null
  } | null
}