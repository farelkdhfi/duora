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

interface WrappedCardNoirProps {
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

export const WrappedCardNoir = forwardRef<
  HTMLDivElement,
  WrappedCardNoirProps
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
        <div className="relative h-full w-full overflow-hidden bg-[#11110f] text-[#f5f1e8]">
          {/* SUBTLE BACKGROUND */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -right-[135px] -top-[27px] size-[297px] rounded-full bg-[#9d8060]/10 blur-[100px]" />

            <div className="absolute -bottom-[108px] -left-[81px] size-[270px] rounded-full bg-[#ffffff]/[0.025] blur-[90px]" />

            <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(#fff_0.6px,transparent_0.6px)] [background-size:5px_5px]" />
          </div>

          <div className="relative flex h-full flex-col px-[43px] py-[32px]">
            {/* HEADER */}
            <header className="flex items-start justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.32em] text-white/45">
                  Duora / Wrapped
                </p>

                <p className="mt-2 text-[7px] uppercase tracking-[0.16em] text-white/30">
                  {milestoneLabel}
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <Image
                  src={logoImg}
                  alt="Duora"
                  width={16}
                  height={16}
                  className="brightness-0 invert opacity-80"
                />

                <span className="text-[13px] font-semibold tracking-[-0.06em]">
                  Duora
                </span>
              </div>
            </header>

            {/* HERO */}
            <section className="mt-[54px]">
              <p className="text-[7px] font-semibold uppercase tracking-[0.28em] text-white/40">
                A record of two
              </p>

              <h1 className="mt-4 max-w-[430px] break-words text-[58px] font-medium leading-[0.84] tracking-[-0.09em] text-[#f5f1e8] capitalize">
                {relationshipName}
              </h1>

              <div className="mt-6 flex items-center gap-3">
                <span className="h-px w-8 bg-[#b69b79]" />

                <p className="text-[7px] uppercase tracking-[0.22em] text-white/40">
                  a story worth keeping
                </p>
              </div>
            </section>

            {/* DAYS */}
            <section className="mt-[49px]">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-[7px] font-semibold uppercase tracking-[0.25em] text-white/35">
                    Days together
                  </p>

                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="text-[83px] font-light leading-[0.75] tracking-[-0.11em]">
                      {totalDays}
                    </span>

                    <span className="text-[8px] uppercase tracking-[0.2em] text-white/40">
                      days
                    </span>
                  </div>
                </div>

                {showScreenTime && screenTimeSummary && (
                  <div className="mb-1 border-l border-white/15 pl-4">
                    <p className="text-[6px] font-semibold uppercase tracking-[0.18em] text-white/35">
                      Time shared
                    </p>

                    <p className="mt-2 text-[15px] font-medium tracking-[-0.05em]">
                      {formatHours(screenTimeSummary.totalSeconds)}
                    </p>

                    <p className="mt-1 text-[6px] text-white/35">
                      Tier {screenTimeSummary.tierLevel}
                    </p>
                  </div>
                )}
              </div>
            </section>

            {/* MOOD */}
            {showMood && topMood && (
              <section className="mt-[38px] border-y border-white/10 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[6px] font-semibold uppercase tracking-[0.22em] text-white/35">
                      Most shared feeling
                    </p>

                    <p className="mt-2 text-[19px] font-medium tracking-[-0.055em]">
                      {moodLabel[topMood.mood]}
                    </p>

                    <p className="mt-1 text-[7px] text-white/35">
                      {topMood.count} of {totalCheckins} check-ins
                    </p>
                  </div>

                  <Image
                    src={moodImage}
                    alt={moodLabel[topMood.mood]}
                    width={68}
                    height={68}
                    className="size-[68px] object-contain opacity-90 grayscale-[0.15]"
                  />
                </div>
              </section>
            )}

            {/* MEETUPS */}
            {showMeetup && meetupSummary.totalMeetups > 0 && (
              <section className="mt-[32px]">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[6px] font-semibold uppercase tracking-[0.24em] text-white/35">
                    Across the distance
                  </p>

                  <span className="text-[6px] uppercase tracking-[0.15em] text-white/25">
                    memories
                  </span>
                </div>

                <div className="grid grid-cols-2 border-y border-white/10">
                  <div className="border-r border-white/10 py-3">
                    <p className="text-[6px] uppercase tracking-[0.18em] text-white/35">
                      Visits
                    </p>

                    <p className="mt-2 text-[23px] font-light tracking-[-0.07em]">
                      {meetupSummary.totalMeetups}
                    </p>
                  </div>

                  <div className="py-3 pl-4">
                    <p className="text-[6px] uppercase tracking-[0.18em] text-white/35">
                      Distance
                    </p>

                    <p className="mt-2 text-[23px] font-light tracking-[-0.07em]">
                      {Math.round(
                        meetupSummary.totalDistanceKm
                      ).toLocaleString("id-ID")}
                      <span className="ml-1 text-[7px] text-white/35">
                        km
                      </span>
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* GOALS */}
            {showGoals && goalsSummary.totalGoalsCount > 0 && (
              <section className="mt-[32px] border border-white/10 px-4 py-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[6px] uppercase tracking-[0.22em] text-white/35">
                      Built together
                    </p>

                    <p className="mt-2 text-[21px] font-medium tracking-[-0.06em]">
                      {formatRupiah(
                        goalsSummary.totalSavedAllGoals
                      )}
                    </p>
                  </div>

                  <p className="text-[6px] uppercase tracking-[0.16em] text-white/35">
                    {goalsSummary.totalGoalsCount} goals
                  </p>
                </div>

                <div className="mt-4 space-y-2">
                  {topGoals.map((goal, index) => (
                    <div
                      key={goal.goalId}
                      className="flex items-center justify-between border-t border-white/[0.08] pt-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="text-[6px] text-[#b69b79]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="truncate text-[7px] text-white/70">
                          {goal.title}
                        </p>
                      </div>

                      <span className="ml-2 shrink-0 text-[7px] text-white/45">
                        {formatRupiah(goal.totalSaved)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FOOTER */}
            <section className="mt-auto pt-[32px]">
              <div className="flex items-center gap-3">
                <span className="h-px flex-1 bg-white/10" />

                <span className="text-[7px] uppercase tracking-[0.3em] text-white/30">
                  made for two
                </span>

                <span className="h-px flex-1 bg-white/10" />
              </div>

              <p className="mt-4 text-center text-[8px] font-medium leading-[1.6] tracking-[0.02em] text-white/55">
                Some distances are measured in miles.
                <br />
                Yours was measured in memories.
              </p>
            </section>
          </div>
        </div>
      </WrappedCard>
    );
  }
);

WrappedCardNoir.displayName = "WrappedCardNoir";