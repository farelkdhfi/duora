// screen-time/tiers.ts

import type { TierInfo } from "./types";

export const SCREEN_TIME_TIERS: TierInfo[] = [
  { level: 1, name: "Spark", minHours: 0, maxHours: 5 },
  { level: 2, name: "Ember", minHours: 5, maxHours: 20 },
  { level: 3, name: "Flame", minHours: 20, maxHours: 50 },
  { level: 4, name: "Blaze", minHours: 50, maxHours: 100 },
  { level: 5, name: "Inferno", minHours: 100, maxHours: 200 },
  { level: 6, name: "Wildfire", minHours: 200, maxHours: 400 },
  { level: 7, name: "Eternal Flame", minHours: 400, maxHours: null },
];

export function getTierFromSeconds(totalSeconds: number): TierInfo {
  const hours = totalSeconds / 3600;

  for (const tier of SCREEN_TIME_TIERS) {
    if (tier.maxHours === null || hours < tier.maxHours) {
      return tier;
    }
  }

  return SCREEN_TIME_TIERS[SCREEN_TIME_TIERS.length - 1];
}

export function getProgressToNextTier(totalSeconds: number): {
  currentTier: TierInfo;
  nextTier: TierInfo | null;
  progressPercentage: number;
  hoursUntilNextTier: number | null;
} {
  const hours = totalSeconds / 3600;
  const currentTier = getTierFromSeconds(totalSeconds);
  const currentIndex = SCREEN_TIME_TIERS.findIndex((t) => t.level === currentTier.level);
  const nextTier = SCREEN_TIME_TIERS[currentIndex + 1] ?? null;

  if (!nextTier) {
    return {
      currentTier,
      nextTier: null,
      progressPercentage: 100,
      hoursUntilNextTier: null,
    };
  }

  const rangeStart = currentTier.minHours;
  const rangeEnd = nextTier.minHours;
  const progress = ((hours - rangeStart) / (rangeEnd - rangeStart)) * 100;

  return {
    currentTier,
    nextTier,
    progressPercentage: Math.min(Math.max(progress, 0), 100),
    hoursUntilNextTier: Math.max(rangeEnd - hours, 0),
  };
}

export function formatHours(totalSeconds: number): string {
  const hours = totalSeconds / 3600;
  if (hours < 1) {
    const minutes = Math.floor(totalSeconds / 60);
    return `${minutes} menit`;
  }
  return `${hours.toFixed(1)} jam`;
}