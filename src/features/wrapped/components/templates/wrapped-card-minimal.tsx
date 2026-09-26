// wrapped/components/templates/wrapped-card-minimal.tsx

"use client";

import { forwardRef } from "react";
import { getTotalDaysLdr, moodLabel, formatRupiah } from "../../utils";
import type {
  MoodSummaryItem,
  GoalsWrappedSummary,
  MeetupSummary,
} from "../../types";

interface WrappedCardMinimalProps {
  relationshipName: string;
  startedAt: string;
  moodSummary: MoodSummaryItem[];
  goalsSummary: GoalsWrappedSummary;
  meetupSummary: MeetupSummary;
  milestoneLabel: string;
  showMood: boolean;
  showMeetup: boolean;
  showGoals: boolean;
}

// Tentukan SATU highlight paling signifikan untuk ditampilkan
// Prioritas: goals (paling emosional/konkret) > meetup > mood
function getSingleHighlight(
  showMood: boolean,
  showMeetup: boolean,
  showGoals: boolean,
  moodSummary: MoodSummaryItem[],
  meetupSummary: MeetupSummary,
  goalsSummary: GoalsWrappedSummary
): { label: string; value: string; caption: string } | null {
  if (showGoals && goalsSummary.totalGoalsCount > 0) {
    return {
      label: "Ditabung Bersama",
      value: formatRupiah(goalsSummary.totalSavedAllGoals),
      caption: `${goalsSummary.totalGoalsCount} couple goals`,
    };
  }

  if (showMeetup && meetupSummary.totalMeetups > 0) {
    return {
      label: "Sudah Bertemu",
      value: `${meetupSummary.totalMeetups}x`,
      caption: `${Math.round(meetupSummary.totalDistanceKm).toLocaleString("id-ID")} km dilewati`,
    };
  }

  if (showMood && moodSummary.length > 0) {
    const topMood = moodSummary[0];
    const totalCheckins = moodSummary.reduce((sum, m) => sum + m.count, 0);
    return {
      label: "Perasaan Paling Sering",
      value: moodLabel[topMood.mood],
      caption: `${topMood.count} dari ${totalCheckins} check-in`,
    };
  }

  return null;
}

export const WrappedCardMinimal = forwardRef<HTMLDivElement, WrappedCardMinimalProps>(
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
    },
    ref
  ) => {
    const totalDays = getTotalDaysLdr(startedAt);

    const highlight = getSingleHighlight(
      showMood,
      showMeetup,
      showGoals,
      moodSummary,
      meetupSummary,
      goalsSummary
    );

    return (
      <div
        ref={ref}
        className="relative flex aspect-[9/16] w-[540px] flex-col justify-between overflow-hidden bg-[#fafaf8] px-12 py-16 text-[#141414]"
      >
        {/* Header - sangat kecil, hampir tidak terlihat, disengaja */}
        <div className="flex items-center justify-between">
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">
            {milestoneLabel}
          </p>
          <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-neutral-400">
            Duora
          </p>
        </div>

        {/* Center - fokus utama, nama & total hari */}
        <div className="flex flex-1 flex-col items-center justify-center text-center">
          <p className="text-xs font-medium capitalize tracking-wide text-neutral-400">
            {relationshipName}
          </p>

          <p className="mt-6 text-[9.5rem] font-light leading-[0.85] tracking-tighter text-neutral-900">
            {totalDays}
          </p>

          <p className="mt-4 text-sm font-light uppercase tracking-[0.35em] text-neutral-400">
            hari terpisah jarak
          </p>
        </div>

        {/* Bottom - satu highlight saja, sangat sederhana */}
        {highlight && (
          <div className="border-t border-neutral-200 pt-8 text-center">
            <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-neutral-400">
              {highlight.label}
            </p>
            <p className="mt-3 text-4xl font-light tracking-tight text-neutral-900">
              {highlight.value}
            </p>
            <p className="mt-1 text-[11px] text-neutral-400">
              {highlight.caption}
            </p>
          </div>
        )}

        {/* Footer minimal */}
        <div className="mt-10 text-center">
          <p className="text-[9px] font-light italic text-neutral-300">
            still, together.
          </p>
        </div>
      </div>
    );
  }
);

WrappedCardMinimal.displayName = "WrappedCardMinimal";