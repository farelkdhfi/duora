// wrapped/components/templates/wrapped-card-soft.tsx

"use client";

import { forwardRef } from "react";
import Image from "next/image";

import {
  getTotalDaysLdr,
  moodLabel,
  formatRupiah,
} from "../../utils";

import type {
  MoodSummaryItem,
  GoalsWrappedSummary,
  MeetupSummary,
  ScreenTimeWrappedSummary,
} from "../../types";

import happyEmot from "@/assets/emoticon/happy-emot.png";
import neutralEmot from "@/assets/emoticon/neutral-emot.png";
import sadEmot from "@/assets/emoticon/sad-emot.png";
import stressedEmot from "@/assets/emoticon/stressed-emot.png";
import tiredEmot from "@/assets/emoticon/tired-emot.png";
import logoImg from "@/assets/duora-logo3.png";
import { TierIcon } from "@/features/screen-time/components/tier-icon";
import { formatHours } from "@/features/screen-time/tiers";

interface WrappedCardSoftProps {
  relationshipName: string;
  startedAt: string;
  moodSummary: MoodSummaryItem[];
  goalsSummary: GoalsWrappedSummary;
  meetupSummary: MeetupSummary;
  milestoneLabel: string;
  showMood: boolean;
  showMeetup: boolean;
  showGoals: boolean;
  showScreenTime: boolean;
  screenTimeSummary: ScreenTimeWrappedSummary | null;
}

const moodImages: Record<string, typeof happyEmot> = {
  happy: happyEmot,
  neutral: neutralEmot,
  sad: sadEmot,
  stressed: stressedEmot,
  tired: tiredEmot,
};

export const WrappedCardSoft = forwardRef<HTMLDivElement, WrappedCardSoftProps>(
  (
    {
      relationshipName,
      startedAt,
      moodSummary,
      goalsSummary,
      meetupSummary,
      screenTimeSummary,
      milestoneLabel,
      showMood,
      showMeetup,
      showGoals,
      showScreenTime,
    },
    ref
  ) => {
    const totalDays = getTotalDaysLdr(startedAt);

    const topMood = moodSummary[0] ?? null;

    const totalCheckins = moodSummary.reduce((sum, mood) => sum + mood.count, 0);

    const topGoals = [...goalsSummary.goals].sort((a, b) => b.totalSaved - a.totalSaved).slice(0, 3);

    const moodImage = topMood ? moodImages[topMood.mood] ?? happyEmot : happyEmot;

    return (
      <div ref={ref} className="relative aspect-[9/16] w-[540px] overflow-hidden bg-[#f7f5f1] text-[#171717] shadow-[0_35px_100px_rgba(0,0,0,0.14)]">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -bottom-[12%] -right-[25%] h-[42%] w-[75%] rounded-full bg-[#c7d8f0]/45 blur-[105px]" />

          <div className="absolute left-[15%] top-[30%] h-[40%] w-[70%] rounded-full bg-white/75 blur-[90px]" />

          <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#111_0.6px,transparent_0.6px)] [background-size:5px_5px]" />
        </div>

        <div className="relative flex h-full flex-col px-[8%] py-[6%]">
          <header className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-[#d987a2]" />

                <p className="text-[8px] font-semibold uppercase tracking-[0.26em] text-neutral-500">
                  LDR Wrapped
                </p>
              </div>

              <p className="mt-2 text-[9px] font-medium text-neutral-600">
                {milestoneLabel}
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-x-1">
                <Image src={logoImg} alt="logo" width={17} height={17} />

                <p className="text-[15px] font-bold tracking-[-0.05em] text-neutral-900">
                  Duora
                </p>
              </div>

              <p className="mt-1 text-[6px] font-semibold uppercase tracking-[0.24em] text-neutral-500">
                made for two
              </p>
            </div>
          </header>

          <section className="mt-[8%]">
            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              A little story about
            </p>

            <h1 className="mt-3 max-w-[94%] break-words text-[clamp(2.5rem,8vw,4.2rem)] font-semibold leading-[0.88] tracking-[-0.08em] text-neutral-900 capitalize">
              {relationshipName}
            </h1>

            <div className="mt-5 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-[#d98ca6] to-[#a9bddd]" />

              <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                still choosing each other
              </p>
            </div>
          </section>

          {/* TOGETHER + SCREEN TIME */}
          <section className="mt-[8%]">
            <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Together across the distance
            </p>

            <div className="mt-4 flex items-center">
              {/* TOTAL DAYS */}
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-3">
                  <span className="text-[clamp(3.8rem,12vw,6rem)] font-semibold leading-[0.8] tracking-[-0.1em] text-neutral-900">
                    {totalDays}
                  </span>

                  <span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-500">
                    days
                  </span>
                </div>
              </div>

              {/* VERTICAL DIVIDER */}
              {showScreenTime && screenTimeSummary && (
                <div className="mx-5 h-[72px] w-px shrink-0 bg-gradient-to-b from-transparent via-black/[0.12] to-transparent" />
              )}

              {/* SCREEN TIME */}
              {showScreenTime && screenTimeSummary && (
                <div className="flex min-w-0 flex-1 items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[7px] font-bold uppercase tracking-[0.16em] text-neutral-500">
                      Waktu bersama
                    </p>

                    <p className="mt-1.5 truncate text-[16px] font-semibold tracking-[-0.055em] text-neutral-900">
                      {formatHours(screenTimeSummary.totalSeconds)}
                    </p>

                    <p className="mt-1 text-[7px] font-medium text-neutral-600">
                      Tier {screenTimeSummary.tierLevel} · {screenTimeSummary.tierName}
                    </p>
                  </div>

                  <TierIcon level={screenTimeSummary.tierLevel} theme={screenTimeSummary.iconTheme} size={46} />
                </div>
              )}
            </div>

            <p className="mt-4 max-w-[78%] text-[9px] font-medium leading-[1.65] text-neutral-600">
              Every day apart became another
              <br />
              day you chose to stay together.
            </p>
          </section>

          {/* MOOD */}
          {showMood && topMood && (
            <section className="relative mt-[6%] rounded-[1.6rem] border border-black/[0.06] bg-white/65 px-5 py-4 backdrop-blur-xl">
              <div className="pointer-events-none absolute -right-8 -top-8 size-28 rounded-full bg-[#f1d5df]/50 blur-2xl" />

              <div className="relative flex items-center">
                <div className="min-w-0 flex-1">
                  <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                    The feeling you shared most
                  </p>

                  <p className="mt-2 text-[18px] font-semibold tracking-[-0.055em] text-neutral-900">
                    {moodLabel[topMood.mood]}
                  </p>

                  <p className="mt-1.5 text-[8px] font-medium text-neutral-600">
                    {topMood.count} of {totalCheckins} check-ins
                  </p>
                </div>

                <div className="relative ml-4 flex size-[82px] shrink-0 items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white to-[#f3e9e9] shadow-[0_12px_35px_rgba(0,0,0,0.08)]" />

                  <Image src={moodImage} alt={moodLabel[topMood.mood]} width={82} height={82} priority className="relative size-[76px] object-contain" />
                </div>
              </div>
            </section>
          )}

          {/* MEETUP */}
          {showMeetup && meetupSummary.totalMeetups > 0 && (
            <section className="mt-[5%]">
              <div className="mb-3 flex items-center gap-3">
                <p className="shrink-0 text-[7px] font-bold uppercase tracking-[0.2em] text-neutral-500">
                  Memories between the miles
                </p>

                <div className="h-px flex-1 bg-black/[0.09]" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[1.25rem] border border-black/[0.06] bg-white/55 px-4 py-3.5">
                  <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                    Times together
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[24px] font-semibold leading-none tracking-[-0.07em] text-neutral-900">
                      {meetupSummary.totalMeetups}
                    </span>

                    <span className="text-[7px] font-semibold text-neutral-500">
                      visits
                    </span>
                  </div>
                </div>

                <div className="rounded-[1.25rem] border border-black/[0.06] bg-white/55 px-4 py-3.5">
                  <p className="text-[7px] font-bold uppercase tracking-[0.15em] text-neutral-500">
                    Distance crossed
                  </p>

                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-[24px] font-semibold leading-none tracking-[-0.07em] text-neutral-900">
                      {Math.round(meetupSummary.totalDistanceKm).toLocaleString("id-ID")}
                    </span>

                    <span className="text-[7px] font-semibold text-neutral-500">
                      km
                    </span>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* GOALS */}
          {showGoals && goalsSummary.totalGoalsCount > 0 && (
            <section className="mt-[5%] rounded-[1.55rem] bg-[#1b1b1b] px-5 py-4 text-white shadow-[0_15px_40px_rgba(0,0,0,0.1)]">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[7px] font-semibold uppercase tracking-[0.19em] text-white/60">
                    Something you built together
                  </p>

                  <p className="mt-2 text-[22px] font-semibold leading-none tracking-[-0.07em]">
                    {formatRupiah(goalsSummary.totalSavedAllGoals)}
                  </p>
                </div>

                <div className="rounded-full border border-white/15 px-2.5 py-1">
                  <p className="text-[6px] font-semibold uppercase tracking-[0.15em] text-white/60">
                    {goalsSummary.totalGoalsCount} goals
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2.5">
                {topGoals.map((goal, index) => (
                  <div key={goal.goalId} className="flex min-h-[28px] items-center justify-between border-t border-white/[0.1] pt-2">
                    <div className="flex min-w-0 items-center gap-2.5">
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-full bg-white/[0.09]">
                        <span className="text-[8px]">✦</span>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-[8px] font-medium text-white/85">
                          {goal.title}
                        </p>

                        <p className="mt-0.5 text-[6px] font-medium uppercase tracking-[0.12em] text-white/45">
                          goal {String(index + 1).padStart(2, "0")}
                        </p>
                      </div>
                    </div>

                    <span className="ml-3 shrink-0 text-[8px] font-semibold text-white/70">
                      {formatRupiah(goal.totalSaved)}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className="mt-auto pt-[6%]">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#dba2b5] to-transparent" />

              <span className="text-[20px] text-[#c9829c]">♥</span>

              <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#aebfdd] to-transparent" />
            </div>

            <p className="mt-4 text-center text-[10px] font-semibold leading-[1.55] tracking-[-0.015em] text-neutral-700">
              The distance was never
              <br />
              the whole story.
            </p>
          </section>
        </div>
      </div>
    );
  }
);

WrappedCardSoft.displayName = "WrappedCardSoft";