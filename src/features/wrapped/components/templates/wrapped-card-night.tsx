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

import { WrappedCard } from "../wrapped-card";

interface WrappedCardMidnightProps {
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

export const WrappedCardNight = forwardRef<
  HTMLDivElement,
  WrappedCardMidnightProps
>(
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
      showScreenTime,
      screenTimeSummary,
    },
    ref
  ) => {
    const totalDays = getTotalDaysLdr(startedAt);

    const topMood = moodSummary[0] ?? null;

    const totalCheckins = moodSummary.reduce(
      (sum, mood) => sum + mood.count,
      0
    );

    const topGoals = [...goalsSummary.goals]
      .sort((a, b) => b.totalSaved - a.totalSaved)
      .slice(0, 3);

    const moodImage = topMood
      ? moodImages[topMood.mood] ?? happyEmot
      : happyEmot;

    return (
      <WrappedCard ref={ref}>
        <div className="relative h-full w-full overflow-hidden bg-[#0b1020] text-[#f4f5fa]">
          {/* NIGHT GLOW */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -right-24 -top-16 size-[260px] rounded-full bg-[#7386ff]/20 blur-[110px]" />

            <div className="absolute -left-28 top-[220px] size-[220px] rounded-full bg-[#b17cff]/10 blur-[100px]" />

            <div className="absolute -bottom-24 right-6 size-[220px] rounded-full bg-[#4d91ff]/10 blur-[110px]" />

            <div className="absolute inset-0 opacity-[0.04] [background-image:radial-gradient(#fff_0.7px,transparent_0.7px)] [background-size:6px_6px]" />
          </div>

          <div className="relative flex h-full flex-col px-[32px] py-[24px]">
            {/* HEADER */}
            <header className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#8ea2ff] shadow-[0_0_12px_rgba(142,162,255,0.9)]" />

                  <p className="text-[7px] font-semibold uppercase tracking-[0.28em] text-white/50">
                    LDR Wrapped
                  </p>
                </div>

                <p className="mt-2 text-[7px] text-white/30">
                  {milestoneLabel}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Image
                  src={logoImg}
                  alt="Duora"
                  width={17}
                  height={17}
                  className="brightness-0 invert opacity-90"
                />

                <p className="text-[14px] font-semibold tracking-[-0.06em]">
                  Duora
                </p>
              </div>
            </header>

            {/* HERO */}
            <section className="mt-[36px]">
              <p className="text-[7px] font-semibold uppercase tracking-[0.24em] text-[#9aa7d0]">
                Somewhere between here and there
              </p>

              <h1 className="mt-4 max-w-full break-words text-[46px] font-medium leading-[0.84] tracking-[-0.09em] text-white capitalize">
                {relationshipName}
              </h1>

              <div className="mt-5 flex items-center gap-3">
                <div className="h-px w-9 bg-gradient-to-r from-[#8195ff] to-[#b982ff]" />

                <p className="text-[7px] uppercase tracking-[0.2em] text-white/35">
                  two places · one story
                </p>
              </div>
            </section>

            {/* MAIN STAT */}
            <section className="mt-[32px]">
              <div className="relative overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/[0.045] px-5 py-5 backdrop-blur-xl">
                <div className="absolute -right-10 -top-10 size-28 rounded-full bg-[#8195ff]/10 blur-3xl" />

                <div className="relative flex items-end justify-between">
                  <div>
                    <p className="text-[6px] font-semibold uppercase tracking-[0.24em] text-white/35">
                      Days you stayed close
                    </p>

                    <div className="mt-3 flex items-baseline gap-2">
                      <span className="text-[72px] font-light leading-[0.72] tracking-[-0.11em]">
                        {totalDays}
                      </span>

                      <span className="text-[8px] uppercase tracking-[0.18em] text-white/35">
                        days
                      </span>
                    </div>
                  </div>

                  {showScreenTime && screenTimeSummary && (
                    <div className="flex items-center gap-2.5">
                      <TierIcon
                        level={screenTimeSummary.tierLevel}
                        theme={screenTimeSummary.iconTheme}
                        size={38}
                      />

                      <div>
                        <p className="text-[6px] uppercase tracking-[0.16em] text-white/35">
                          Shared time
                        </p>

                        <p className="mt-1.5 text-[14px] font-medium tracking-[-0.05em]">
                          {formatHours(screenTimeSummary.totalSeconds)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* MOOD */}
            {showMood && topMood && (
              <section className="mt-[20px]">
                <div className="flex items-center justify-between rounded-[1.6rem] border border-white/10 bg-white/[0.035] px-5 py-4 backdrop-blur-xl">
                  <div>
                    <p className="text-[6px] font-semibold uppercase tracking-[0.22em] text-[#9aa7d0]">
                      Most felt
                    </p>

                    <p className="mt-2 text-[20px] font-medium tracking-[-0.06em]">
                      {moodLabel[topMood.mood]}
                    </p>

                    <p className="mt-1.5 text-[7px] text-white/35">
                      {topMood.count} of {totalCheckins} check-ins
                    </p>
                  </div>

                  <div className="relative flex size-[70px] items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-[#8195ff]/10 blur-xl" />

                    <Image
                      src={moodImage}
                      alt={moodLabel[topMood.mood]}
                      width={66}
                      height={66}
                      className="relative size-[64px] object-contain"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* MEETUPS */}
            {showMeetup && meetupSummary.totalMeetups > 0 && (
              <section className="mt-[20px]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[6px] font-semibold uppercase tracking-[0.22em] text-white/35">
                    Places between you
                  </p>

                  <div className="h-px w-12 bg-white/10" />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] px-4 py-3.5">
                    <p className="text-[6px] uppercase tracking-[0.16em] text-white/35">
                      Visits
                    </p>

                    <p className="mt-2 text-[25px] font-light leading-none tracking-[-0.08em]">
                      {meetupSummary.totalMeetups}
                    </p>

                    <p className="mt-1 text-[6px] text-white/30">
                      times together
                    </p>
                  </div>

                  <div className="rounded-[1.4rem] border border-white/10 bg-white/[0.035] px-4 py-3.5">
                    <p className="text-[6px] uppercase tracking-[0.16em] text-white/35">
                      Distance
                    </p>

                    <p className="mt-2 text-[25px] font-light leading-none tracking-[-0.08em]">
                      {Math.round(
                        meetupSummary.totalDistanceKm
                      ).toLocaleString("id-ID")}
                    </p>

                    <p className="mt-1 text-[6px] text-white/30">
                      kilometers crossed
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* GOALS */}
            {showGoals && goalsSummary.totalGoalsCount > 0 && (
              <section className="mt-[20px] overflow-hidden rounded-[1.6rem] border border-white/10 bg-gradient-to-br from-white/[0.07] to-white/[0.025] px-5 py-4 backdrop-blur-xl">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[6px] font-semibold uppercase tracking-[0.2em] text-white/35">
                      Things you're building
                    </p>

                    <p className="mt-2 text-[22px] font-medium tracking-[-0.07em]">
                      {formatRupiah(
                        goalsSummary.totalSavedAllGoals
                      )}
                    </p>
                  </div>

                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[6px] uppercase tracking-[0.14em] text-white/40">
                    {goalsSummary.totalGoalsCount} goals
                  </span>
                </div>

                <div className="mt-4 space-y-2">
                  {topGoals.map((goal, index) => (
                    <div
                      key={goal.goalId}
                      className="flex items-center justify-between border-t border-white/[0.08] pt-2"
                    >
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="text-[7px] text-[#8195ff]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="truncate text-[7px] text-white/65">
                          {goal.title}
                        </p>
                      </div>

                      <span className="ml-3 shrink-0 text-[7px] text-white/40">
                        {formatRupiah(goal.totalSaved)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FOOTER */}
            <section className="mt-auto pt-[24px]">
              <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />

                <span className="text-[8px] font-medium uppercase tracking-[0.25em] text-white/30">
                  Duora
                </span>

                <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
              </div>

              <p className="mt-4 text-center text-[9px] font-medium leading-[1.55] text-white/50">
                The night made the distance visible.
                <br />
                Love made it feel smaller.
              </p>
            </section>
          </div>
        </div>
      </WrappedCard>
    );
  }
);

WrappedCardNight.displayName = "WrappedCardNight";