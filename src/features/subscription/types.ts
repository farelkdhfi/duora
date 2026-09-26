// subscription/types.ts

export type SubscriptionStatus = "trialing" | "active" | "expired" | "canceled";
export type SubscriptionPlanType = "free" | "premium";

export interface MySubscription {
  subscription_id: string;
  relationship_id: string;
  status: SubscriptionStatus;
  plan_type: SubscriptionPlanType;
  plan_name: string;
  trial_ends_at: string | null;
  current_period_end: string | null;
  max_debate_messages_per_room: number | null;
  max_active_countdowns: number | null;
  max_mood_edits_per_day: number | null;
  can_customize_share_template: boolean;
  trial_modal_seen: boolean;
  has_used_trial: boolean;
  expiry_warning_shown_at: string | null;
}