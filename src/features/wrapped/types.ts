// wrapped/types.ts

import type { Mood } from "../checkins/types";

export interface MeetupSummary {
  totalMeetups: number;
  totalDistanceKm: number;
}

export interface MoodSummaryItem {
  mood: Mood;
  count: number;
}

export interface GoalSavingsSummaryItem {
  goalId: string;
  title: string;
  category: string;
  targetAmount: number | null;
  totalSaved: number;
  progressPercentage: number | null;
}

export interface GoalsWrappedSummary {
  totalSavedAllGoals: number;
  totalGoalsCount: number;
  goals: GoalSavingsSummaryItem[];
}

export type MilestoneType = "100_days" | "6_months" | "1_year" | "custom";

export type WrappedTemplateId = "soft" | "bold" | "minimal";

export interface WrappedPreference {
  id: string;
  relationship_id: string;
  template_id: WrappedTemplateId;
  show_mood: boolean;
  show_meetup: boolean;
  show_goals: boolean;
  show_screen_time: boolean;
  custom_color_primary: string | null;
  custom_color_secondary: string | null;
}

export interface WrappedTemplateInfo {
  id: WrappedTemplateId;
  name: string;
  description: string;
  isPremium: boolean;
  supportsCustomColor: boolean;
}

export interface ScreenTimeWrappedSummary {
  totalSeconds: number;
  tierLevel: number;
  tierName: string;
  iconTheme: "flame" | "heart" | "star" | "moon";
}