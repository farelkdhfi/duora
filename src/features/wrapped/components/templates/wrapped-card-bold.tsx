// wrapped/components/templates/wrapped-card-bold.tsx

"use client";

import { forwardRef } from "react";
import {
  getTotalDaysLdr,
  moodEmoji,
  moodLabel,
  formatRupiah,
  goalCategoryEmoji,
} from "../../utils";
import type {
  MoodSummaryItem,
  GoalsWrappedSummary,
  MeetupSummary,
} from "../../types";

interface WrappedCardBoldProps {
  relationshipName: string;
  startedAt: string;
  moodSummary: MoodSummaryItem[];
  goalsSummary: GoalsWrappedSummary;
  meetupSummary: MeetupSummary;
  milestoneLabel: string;
  showMood: boolean;
  showMeetup: boolean;
  showGoals: boolean;
  // Custom warna, khusus template ini (premium only)
  customColorPrimary?: string | null;
  customColorSecondary?: string | null;
}

const DEFAULT_GRADIENT = "from-purple-600 via-fuchsia-500 to-pink-500";

export const WrappedCardBold = forwardRef<HTMLDivElement, WrappedCardBoldProps>(
  (
    {
      relationshipName,
      startedAt,
      moodSummary,
      goalsSummary,
      meetupSummary,
      milestoneLabel,
      showMood,
      showMeetup,
      showGoals,
      customColorPrimary,
      customColorSecondary,
    },
    ref
  ) => {
    const totalDays = getTotalDaysLdr(startedAt);
    const topMood = moodSummary[0] ?? null;
    const totalCheckins = moodSummary.reduce((sum, m) => sum + m.count, 0);

    const topGoals = [...goalsSummary.goals]
      .sort((a, b) => b.totalSaved - a.totalSaved)
      .slice(0, 3);

    const hasCustomColor = customColorPrimary && customColorSecondary;

    const customStyle = hasCustomColor
      ? {
          backgroundImage: `linear-gradient(to bottom right, ${customColorPrimary}, ${customColorSecondary})`,
        }
      : undefined;

    return (
      <div
        ref={ref}
        style={customStyle}
        className={`relative flex aspect-[9/16] w-[540px] flex-col justify-between overflow-hidden p-9 text-white ${
          hasCustomColor ? "" : `bg-gradient-to-br ${DEFAULT_GRADIENT}`
        }`}
      >
        {/* Decorative blobs */}
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full bg-white/10" />

        {/* Header */}
        <div className="relative z-10">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/70">
            LDR Wrapped · {milestoneLabel}
          </p>
          <h1 className="mt-2 text-2xl font-bold capitalize">
            {relationshipName}
          </h1>
        </div>

        {/* Total hari - headline utama */}
        <div className="relative z-10 text-center">
          <p className="text-8xl font-extrabold leading-none">{totalDays}</p>
          <p className="mt-2 text-sm uppercase tracking-widest text-white/80">
            Hari LDR
          </p>
        </div>

        {/* Meetup summary */}
        {showMeetup && meetupSummary.totalMeetups > 0 && (
          <div className="relative z-10 grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold leading-none">
                {meetupSummary.totalMeetups}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-white/70">
                Kali Ketemu
              </p>
            </div>
            <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
              <p className="text-3xl font-extrabold leading-none">
                {Math.round(meetupSummary.totalDistanceKm).toLocaleString("id-ID")}
              </p>
              <p className="mt-1 text-[10px] uppercase tracking-wide text-white/70">
                KM Dilewati
              </p>
            </div>
          </div>
        )}

        {/* Mood paling sering */}
        {showMood && topMood && (
          <div className="relative z-10 rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
            <p className="text-[10px] uppercase tracking-widest text-white/70">
              Mood Paling Sering
            </p>
            <p className="mt-1 text-4xl">{moodEmoji[topMood.mood]}</p>
            <p className="mt-1 text-base font-semibold">
              {moodLabel[topMood.mood]}
            </p>
            <p className="mt-0.5 text-[10px] text-white/70">
              {topMood.count}x dari {totalCheckins} check-in
            </p>
          </div>
        )}

        {/* Couple Goals - Total Tabungan */}
        {showGoals && goalsSummary.totalGoalsCount > 0 && (
          <div className="relative z-10 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
            <p className="text-center text-[10px] uppercase tracking-widest text-white/70">
              Total Tabungan Bersama
            </p>
            <p className="mt-1 text-center text-2xl font-extrabold">
              {formatRupiah(goalsSummary.totalSavedAllGoals)}
            </p>
            <p className="mt-0.5 text-center text-[10px] text-white/70">
              dari {goalsSummary.totalGoalsCount} couple goals
            </p>

            <div className="mt-3 space-y-1.5">
              {topGoals.map((goal) => (
                <div
                  key={goal.goalId}
                  className="flex items-center justify-between rounded-lg bg-white/10 px-2.5 py-1.5"
                >
                  <span className="flex items-center gap-1.5 truncate text-xs">
                    <span>{goalCategoryEmoji[goal.category] ?? "✨"}</span>
                    <span className="truncate">{goal.title}</span>
                  </span>
                  <span className="shrink-0 text-xs font-semibold">
                    {formatRupiah(goal.totalSaved)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Footer branding */}
        <div className="relative z-10 text-center text-[10px] uppercase tracking-widest text-white/60">
          made with duora
        </div>
      </div>
    );
  }
);

WrappedCardBold.displayName = "WrappedCardBold";