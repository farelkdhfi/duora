export type ActivityType =
    | 'goal_created'
    | 'goal_updated'
    | 'goal_deleted'
    | 'saving_added'
    | 'saving_deleted'
    | 'checkin_added'
    | 'checkin_updated'
    | 'plan_created'
    | 'plan_updated'
    | 'plan_deleted'
    | 'checklist_completed'
    | 'checklist_uncompleted'
    | 'note_created'
    | 'note_updated'
    | 'note_deleted'

export interface ActivityActor {
    id: string
    display_name: string | null
    username: string | null
    avatar_url: string | null
}

export interface Activity {
    id: string
    type: ActivityType
    metadata: Record<string, unknown>
    reference_id: string | null
    created_at: string
    actor: ActivityActor
}