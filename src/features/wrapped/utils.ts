// wrapped/utils.ts

import type { MilestoneType, ScreenTimeWrappedSummary } from "./types";

import type { GoalWithSavings } from "../goals/types";
import type { GoalsWrappedSummary, GoalSavingsSummaryItem } from "./types";
import type { MeetupSummary } from "./types";
import { getTierFromSeconds } from "../screen-time/tiers";

export function getTotalDaysLdr(startedAt: string): number {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export function getReachedMilestones(totalDays: number): MilestoneType[] {
  const milestones: MilestoneType[] = [];

  if (totalDays >= 100) milestones.push("100_days");
  if (totalDays >= 182) milestones.push("6_months");
  if (totalDays >= 365) milestones.push("1_year");

  return milestones;
}

export function getCurrentMilestoneLabel(totalDays: number): string {
  const years = Math.floor(totalDays / 365);
  const remainingDaysAfterYears = totalDays % 365;
  const months = Math.floor(remainingDaysAfterYears / 30);

  if (years >= 1) {
    if (months === 0) {
      return years === 1 ? "1 Tahun" : `${years} Tahun`;
    }
    return years === 1
      ? `1 Tahun ${months} Bulan`
      : `${years} Tahun ${months} Bulan`;
  }

  if (totalDays >= 182) {
    const months = Math.floor(totalDays / 30);
    return `${months} Bulan`;
  }

  if (totalDays >= 100) {
    return "100 Hari";
  }

  return `${totalDays} Hari`;
}

export const milestoneLabels: Record<MilestoneType, string> = {
  "100_days": "100 Hari",
  "6_months": "6 Bulan",
  "1_year": "1 Tahun",
  custom: "Custom",
};

export const moodEmoji: Record<string, string> = {
  happy: "😄",
  neutral: "😐",
  sad: "😢",
  tired: "😴",
  stressed: "😩",
};

export const moodLabel: Record<string, string> = {
  happy: "Bahagia",
  neutral: "Biasa aja",
  sad: "Sedih",
  tired: "Capek",
  stressed: "Stres",
};

export function summarizeGoalsForWrapped(
  goalsWithSavings: GoalWithSavings[]
): GoalsWrappedSummary {
  const goals: GoalSavingsSummaryItem[] = goalsWithSavings.map((goal) => {
    const totalSaved = goal.savings.reduce((sum, s) => sum + s.amount, 0);
    const progressPercentage =
      goal.target_amount && goal.target_amount > 0
        ? Math.min((totalSaved / goal.target_amount) * 100, 100)
        : null;

    return {
      goalId: goal.id,
      title: goal.title,
      category: goal.category,
      targetAmount: goal.target_amount,
      totalSaved,
      progressPercentage,
    };
  });

  const totalSavedAllGoals = goals.reduce((sum, g) => sum + g.totalSaved, 0);

  return {
    totalSavedAllGoals,
    totalGoalsCount: goals.length,
    goals,
  };
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const goalCategoryEmoji: Record<string, string> = {
  wedding: "💍",
  house: "🏠",
  vacation: "🏖️",
  education: "🎓",
  business: "💼",
  savings: "💰",
  personal: "🎯",
  other: "✨",
};

interface CompletedMeetupRow {
  distance_km: number | null;
}

export function summarizeMeetupsForWrapped(
  completedMeetups: CompletedMeetupRow[]
): MeetupSummary {
  const totalMeetups = completedMeetups.length;
  const totalDistanceKm = completedMeetups.reduce(
    (sum, m) => sum + (m.distance_km ?? 0),
    0
  );

  return { totalMeetups, totalDistanceKm };
}

export function summarizeScreenTimeForWrapped(
  data: { total_seconds: number; icon_theme: string } | null
): ScreenTimeWrappedSummary | null {
  if (!data) return null;

  const tier = getTierFromSeconds(data.total_seconds);

  return {
    totalSeconds: data.total_seconds,
    tierLevel: tier.level,
    tierName: tier.name,
    iconTheme: data.icon_theme as ScreenTimeWrappedSummary["iconTheme"],
  };
}