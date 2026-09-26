// screen-time/types.ts

export type IconTheme = "flame" | "heart" | "star" | "moon";

export interface ScreenTimeTracking {
  id: string;
  relationship_id: string;
  total_seconds: number;
  icon_theme: IconTheme;
}

export interface TierInfo {
  level: number;
  name: string;
  minHours: number;
  maxHours: number | null;
}