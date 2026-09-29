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

import { WrappedCard } from "../wrapped-card";
import { formatHours } from "@/features/screen-time/tiers";

interface WrappedCardBloomProps {
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

export const WrappedCardBloom = forwardRef<
  HTMLDivElement,
  WrappedCardBloomProps
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
        <div className="relative h-full w-full overflow-hidden bg-[#fbf7f6] text-[#262124]">
          {/* BACKGROUND */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-[110px] -top-[45px] h-[250px] w-[360px] rounded-full bg-[#efc8d4]/45 blur-[100px]" />

            <div className="absolute -right-[100px] top-[170px] h-[210px] w-[335px] rounded-full bg-[#d8d3ed]/45 blur-[105px]" />

            <div className="absolute -bottom-[90px] left-[75px] h-[210px] w-[360px] rounded-full bg-[#f4dfc7]/40 blur-[100px]" />

            <div className="absolute inset-0 opacity-[0.025] [background-image:radial-gradient(#111_0.6px,transparent_0.6px)] [background-size:5px_5px]" />
          </div>

          <div className="relative flex h-full flex-col px-[32px] py-[28px]">
            {/* HEADER */}
            <header className="flex items-center justify-between">
              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.28em] text-[#9a858d]">
                  LDR Wrapped
                </p>

                <p className="mt-[6px] text-[7px] font-medium text-[#a99da2]">
                  {milestoneLabel}
                </p>
              </div>

              <div className="flex items-center gap-[6px]">
                <Image
                  src={logoImg}
                  alt="Duora"
                  width={17}
                  height={17}
                />

                <span className="text-[14px] font-bold tracking-[-0.06em]">
                  Duora
                </span>
              </div>
            </header>

            {/* HERO */}
            <section className="mt-[42px]">
              <p className="text-[7px] font-semibold uppercase tracking-[0.22em] text-[#a8959c]">
                A chapter about
              </p>

              <h1 className="mt-[12px] max-w-[430px] break-words text-[52px] font-medium leading-[0.84] tracking-[-0.085em] capitalize">
                {relationshipName}
              </h1>

              <div className="mt-[20px] flex items-center gap-[12px]">
                <div className="flex -space-x-[4px]">
                  <span className="size-[8px] rounded-full border border-[#fbf7f6] bg-[#d99aad]" />
                  <span className="size-[8px] rounded-full border border-[#fbf7f6] bg-[#aaa5d2]" />
                </div>

                <p className="text-[7px] font-semibold uppercase tracking-[0.18em] text-[#9e8e95]">
                  still becoming a story
                </p>
              </div>
            </section>

            {/* DAYS */}
            <section className="mt-[38px]">
              <div className="rounded-[29px] border border-white/70 bg-white/45 px-[20px] py-[16px] backdrop-blur-xl">
                <div className="flex items-center">
                  <div className="min-w-0 flex-1">
                    <p className="text-[7px] font-bold uppercase tracking-[0.2em] text-[#9c8c92]">
                      Together
                    </p>

                    <div className="mt-[8px] flex items-baseline gap-[8px]">
                      <span className="text-[64px] font-medium leading-[0.75] tracking-[-0.1em] text-[#262124]">
                        {totalDays}
                      </span>

                      <span className="text-[8px] font-semibold uppercase tracking-[0.16em] text-[#a5979d]">
                        days
                      </span>
                    </div>
                  </div>

                  {showScreenTime && screenTimeSummary && (
                    <>
                      <div className="mx-[16px] h-[58px] w-px shrink-0 bg-[#272126]/10" />

                      <div className="min-w-0 flex-1">
                        <p className="text-[6px] font-bold uppercase tracking-[0.17em] text-[#9c8c92]">
                          Waktu bersama
                        </p>

                        <p className="mt-[8px] text-[15px] font-semibold tracking-[-0.055em]">
                          {formatHours(screenTimeSummary.totalSeconds)}
                        </p>

                        <p className="mt-[4px] text-[6px] text-[#9c8c92]">
                          Tier {screenTimeSummary.tierLevel}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* MOOD */}
            {showMood && topMood && (
              <section className="relative mt-[24px] overflow-hidden rounded-[29px] bg-[#262124] px-[20px] py-[16px] text-white shadow-[0_18px_45px_rgba(38,33,36,0.12)]">
                <div className="absolute -right-[32px] -top-[32px] size-[112px] rounded-full bg-[#e4aebe]/20 blur-2xl" />

                <div className="relative flex items-center justify-between">
                  <div>
                    <p className="text-[6px] font-semibold uppercase tracking-[0.2em] text-white/45">
                      The feeling you shared
                    </p>

                    <p className="mt-[8px] text-[20px] font-medium tracking-[-0.06em]">
                      {moodLabel[topMood.mood]}
                    </p>

                    <p className="mt-[6px] text-[7px] text-white/45">
                      {topMood.count} of {totalCheckins} check-ins
                    </p>
                  </div>

                  <div className="flex size-[72px] shrink-0 items-center justify-center rounded-full bg-white/[0.08]">
                    <Image
                      src={moodImage}
                      alt={moodLabel[topMood.mood]}
                      width={68}
                      height={68}
                      className="size-[64px] object-contain"
                    />
                  </div>
                </div>
              </section>
            )}

            {/* MEETUP */}
            {showMeetup && meetupSummary.totalMeetups > 0 && (
              <section className="mt-[24px]">
                <div className="mb-[12px] flex items-center gap-[12px]">
                  <p className="shrink-0 text-[7px] font-bold uppercase tracking-[0.18em] text-[#99888f]">
                    The miles you crossed
                  </p>

                  <div className="h-px flex-1 bg-[#2a2428]/10" />
                </div>

                <div className="grid grid-cols-2 gap-[12px]">
                  <div className="rounded-[22px] border border-white/80 bg-white/50 px-[16px] py-[14px] backdrop-blur-md">
                    <p className="text-[6px] font-bold uppercase tracking-[0.16em] text-[#9b8c92]">
                      Together
                    </p>

                    <p className="mt-[8px] text-[25px] font-medium leading-none tracking-[-0.08em]">
                      {meetupSummary.totalMeetups}
                    </p>

                    <p className="mt-[4px] text-[6px] text-[#a4979c]">
                      visits
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/80 bg-white/50 px-[16px] py-[14px] backdrop-blur-md">
                    <p className="text-[6px] font-bold uppercase tracking-[0.16em] text-[#9b8c92]">
                      Distance
                    </p>

                    <p className="mt-[8px] text-[25px] font-medium leading-none tracking-[-0.08em]">
                      {Math.round(
                        meetupSummary.totalDistanceKm
                      ).toLocaleString("id-ID")}
                    </p>

                    <p className="mt-[4px] text-[6px] text-[#a4979c]">
                      kilometers
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* GOALS */}
            {showGoals && goalsSummary.totalGoalsCount > 0 && (
              <section className="mt-[24px] rounded-[27px] border border-[#e7dfe0] bg-white/50 px-[20px] py-[16px] backdrop-blur-md">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[6px] font-bold uppercase tracking-[0.18em] text-[#9c8c92]">
                      Something you are building
                    </p>

                    <p className="mt-[8px] text-[22px] font-semibold tracking-[-0.07em]">
                      {formatRupiah(
                        goalsSummary.totalSavedAllGoals
                      )}
                    </p>
                  </div>

                  <span className="rounded-full bg-[#262124]/[0.06] px-[10px] py-[4px] text-[6px] font-semibold uppercase tracking-[0.12em] text-[#8f8187]">
                    {goalsSummary.totalGoalsCount} goals
                  </span>
                </div>

                <div className="mt-[16px] space-y-[8px]">
                  {topGoals.map((goal, index) => (
                    <div
                      key={goal.goalId}
                      className="flex items-center justify-between border-t border-[#2a2428]/[0.08] pt-[8px]"
                    >
                      <div className="flex min-w-0 items-center gap-[10px]">
                        <span className="text-[7px] text-[#bd8297]">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <p className="truncate text-[7px] font-medium text-[#4b4247]">
                          {goal.title}
                        </p>
                      </div>

                      <span className="ml-[12px] text-[7px] font-semibold text-[#82747a]">
                        {formatRupiah(goal.totalSaved)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* FOOTER */}
            <section className="mt-auto pt-[28px]">
              <div className="flex items-center justify-center gap-[8px]">
                <span className="size-[4px] rounded-full bg-[#d99aad]" />
                <span className="size-[4px] rounded-full bg-[#aaa5d2]" />
                <span className="size-[4px] rounded-full bg-[#e1bf9e]" />
              </div>

              <p className="mt-[12px] text-center text-[9px] font-medium leading-[1.55] tracking-[-0.01em] text-[#75676e]">
                Distance became smaller
                <br />
                every time you showed up.
              </p>
            </section>
          </div>
        </div>
      </WrappedCard>
    );
  }
);

WrappedCardBloom.displayName = "WrappedCardBloom";