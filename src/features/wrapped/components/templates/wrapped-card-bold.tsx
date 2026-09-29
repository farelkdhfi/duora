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

import { WrappedCard } from "../wrapped-card";

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

  customColorPrimary?: string | null;
  customColorSecondary?: string | null;
}

const DEFAULT_PRIMARY = "#f9a8c4";
const DEFAULT_SECONDARY = "#fce7f3";

export const WrappedCardBold = forwardRef<
  HTMLDivElement,
  WrappedCardBoldProps
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
      customColorPrimary,
      customColorSecondary,
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

    const hasCustomColor =
      !!customColorPrimary && !!customColorSecondary;

    const primaryColor = hasCustomColor
      ? customColorPrimary!
      : DEFAULT_PRIMARY;

    const secondaryColor = hasCustomColor
      ? customColorSecondary!
      : DEFAULT_SECONDARY;

    return (
      <WrappedCard ref={ref}>
        <div
          className="relative flex h-full w-full flex-col overflow-hidden bg-[#fff7fa] text-[#4a2634]"
          style={{
            backgroundImage: `linear-gradient(145deg, ${secondaryColor} 0%, #fff7fa 42%, #fff 100%)`,
          }}
        >
          {/* ================================================= */}
          {/* DECORATIVE SVG BACKGROUND */}
          {/* ================================================= */}

          <div className="pointer-events-none absolute -right-7 -top-7 opacity-80">
            <svg
              width="190"
              height="190"
              viewBox="0 0 190 190"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="116"
                cy="72"
                r="64"
                fill={primaryColor}
                fillOpacity="0.2"
              />

              <circle
                cx="155"
                cy="28"
                r="8"
                fill="#fff"
                fillOpacity="0.8"
              />

              <path
                d="M133 45C133 39.4772 137.477 35 143 35C148.523 35 153 39.4772 153 45C153 55 143 61 143 61C143 61 133 55 133 45Z"
                fill="#F472B6"
                fillOpacity="0.7"
              />

              <path
                d="M103 20C103 16.134 106.134 13 110 13C113.866 13 117 16.134 117 20C117 27 110 31 110 31C110 31 103 27 103 20Z"
                fill="#FB7185"
                fillOpacity="0.45"
              />

              <path
                d="M72 75L75 82L82 85L75 88L72 95L69 88L62 85L69 82L72 75Z"
                fill="#fff"
                fillOpacity="0.9"
              />
            </svg>
          </div>

          <div className="pointer-events-none absolute -bottom-12 -left-12 opacity-60">
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="62"
                cy="116"
                r="66"
                fill="#FBCFE8"
                fillOpacity="0.6"
              />

              <path
                d="M52 91C52 85.4772 56.4772 81 62 81C67.5228 81 72 85.4772 72 91C72 101 62 107 62 107C62 107 52 101 52 91Z"
                fill="#F472B6"
                fillOpacity="0.55"
              />

              <path
                d="M94 121L97 128L104 131L97 134L94 141L91 134L84 131L91 128L94 121Z"
                fill="#F9A8D4"
              />
            </svg>
          </div>

          {/* ================================================= */}
          {/* TOP DECORATION */}
          {/* ================================================= */}

          <div className="relative z-10 px-8 pt-8">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <div
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm"
                    style={{
                      boxShadow: `0 5px 15px ${primaryColor}45`,
                    }}
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M20.84 4.61C19.11 2.88 16.28 2.88 14.55 4.61L12 7.17L9.45 4.61C7.72 2.88 4.89 2.88 3.16 4.61C1.43 6.34 1.43 9.17 3.16 10.9L12 19.74L20.84 10.9C22.57 9.17 22.57 6.34 20.84 4.61Z"
                        fill="#EC4899"
                      />
                    </svg>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#a05a72]">
                    Duora Wrapped
                  </span>
                </div>

                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.16em] text-[#b4778b]">
                  {milestoneLabel}
                </p>

                <h1 className="mt-1 max-w-[260px] truncate text-[26px] font-bold leading-tight tracking-[-0.04em] text-[#3f202c]">
                  {relationshipName}
                </h1>
              </div>

              <div className="relative mr-1 mt-1">
                <svg
                  width="58"
                  height="58"
                  viewBox="0 0 58 58"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    cx="29"
                    cy="29"
                    r="28"
                    fill="#fff"
                    fillOpacity="0.72"
                  />

                  <circle
                    cx="29"
                    cy="29"
                    r="22"
                    stroke="#F9A8D4"
                    strokeWidth="1"
                    strokeDasharray="2 4"
                  />

                  <path
                    d="M29 38C29 38 17 31.3 17 23.8C17 19.9 20.1 17 23.8 17C26.1 17 28.2 18.2 29 20.1C29.8 18.2 31.9 17 34.2 17C37.9 17 41 19.9 41 23.8C41 31.3 29 38 29 38Z"
                    fill="#F472B6"
                  />
                </svg>

                <svg
                  className="absolute -right-2 -top-3"
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M9 1L10.4 6.6L16 8L10.4 9.4L9 15L7.6 9.4L2 8L7.6 6.6L9 1Z"
                    fill="#F9A8D4"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* HERO TOTAL DAYS */}
          {/* ================================================= */}

          <div className="relative z-10 px-8 pt-8">
            <div className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/65 px-6 py-7 text-center shadow-[0_18px_45px_rgba(190,80,120,0.10)] backdrop-blur-md">
              <div className="pointer-events-none absolute -right-7 -top-7 h-20 w-20 rounded-full bg-[#fbcfe8]/40" />

              <div className="pointer-events-none absolute -bottom-8 -left-5 h-20 w-20 rounded-full bg-[#f9a8d4]/20" />

              <p className="relative text-[10px] font-bold uppercase tracking-[0.25em] text-[#b4778b]">
                sudah bersama selama
              </p>

              <div className="relative mt-1 flex items-baseline justify-center gap-2">
                <span
                  className="text-[76px] font-black leading-none tracking-[-0.07em] text-[#3f202c]"
                  style={{
                    textShadow: `0 8px 25px ${primaryColor}30`,
                  }}
                >
                  {totalDays}
                </span>

                <span className="text-sm font-semibold text-[#9d6077]">
                  hari
                </span>
              </div>

              <div className="relative mx-auto mt-3 flex w-fit items-center gap-2 rounded-full bg-[#fff0f6] px-3 py-1.5">
                <span className="text-xs">♡</span>

                <span className="text-[10px] font-semibold tracking-wide text-[#a05a72]">
                  dan masih terus berjalan
                </span>

                <span className="text-xs">♡</span>
              </div>
            </div>
          </div>

          {/* ================================================= */}
          {/* MEETUP SUMMARY */}
          {/* ================================================= */}

          {showMeetup && meetupSummary.totalMeetups > 0 && (
            <div className="relative z-10 px-8 pt-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-[22px] border border-white/80 bg-white/70 px-4 py-4 text-center shadow-[0_10px_30px_rgba(190,80,120,0.07)] backdrop-blur-md">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0f6]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 21C12 21 4 16.5 4 10.5C4 7.46 6.46 5 9.5 5C11.04 5 12.43 5.63 13.4 6.64C14.37 5.63 15.76 5 17.3 5C20.34 5 22 7.46 22 10.5C22 16.5 14 21 12 21Z"
                        fill="#EC4899"
                      />
                    </svg>
                  </div>

                  <p className="text-[27px] font-black leading-none tracking-[-0.04em] text-[#4a2634]">
                    {meetupSummary.totalMeetups}
                  </p>

                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#ae7287]">
                    kali ketemu
                  </p>
                </div>

                <div className="rounded-[22px] border border-white/80 bg-white/70 px-4 py-4 text-center shadow-[0_10px_30px_rgba(190,80,120,0.07)] backdrop-blur-md">
                  <div className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#fff0f6]">
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4 16L8 12L11 15L20 6"
                        stroke="#EC4899"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d="M15 6H20V11"
                        stroke="#EC4899"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>

                  <p className="text-[27px] font-black leading-none tracking-[-0.04em] text-[#4a2634]">
                    {Math.round(
                      meetupSummary.totalDistanceKm
                    ).toLocaleString("id-ID")}
                  </p>

                  <p className="mt-1.5 text-[9px] font-bold uppercase tracking-[0.14em] text-[#ae7287]">
                    km dilewati
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* MOOD */}
          {/* ================================================= */}

          {showMood && topMood && (
            <div className="relative z-10 px-8 pt-4">
              <div className="flex items-center gap-4 rounded-[24px] border border-white/80 bg-white/70 px-4 py-4 shadow-[0_10px_30px_rgba(190,80,120,0.07)] backdrop-blur-md">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-[19px] bg-[#fff0f6] text-[30px] shadow-inner">
                  {moodEmoji[topMood.mood]}
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b4778b]">
                    mood paling sering
                  </p>

                  <p className="mt-0.5 truncate text-[17px] font-bold text-[#4a2634]">
                    {moodLabel[topMood.mood]}
                  </p>

                  <p className="mt-0.5 text-[10px] text-[#ad7789]">
                    {topMood.count}x dari {totalCheckins} check-in
                  </p>
                </div>

                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12.5 2L14.1 8.4L20.5 10L14.1 11.6L12.5 18L10.9 11.6L4.5 10L10.9 8.4L12.5 2Z"
                    fill="#F9A8D4"
                  />

                  <path
                    d="M19.5 15L20.2 17.8L23 18.5L20.2 19.2L19.5 22L18.8 19.2L16 18.5L18.8 17.8L19.5 15Z"
                    fill="#FBCFE8"
                  />
                </svg>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* GOALS */}
          {/* ================================================= */}

          {showGoals && goalsSummary.totalGoalsCount > 0 && (
            <div className="relative z-10 px-8 pt-4">
              <div className="rounded-[25px] border border-white/80 bg-white/70 p-4 shadow-[0_10px_30px_rgba(190,80,120,0.07)] backdrop-blur-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-[#b4778b]">
                      tabungan bersama
                    </p>

                    <p className="mt-1 text-[21px] font-black tracking-[-0.04em] text-[#4a2634]">
                      {formatRupiah(
                        goalsSummary.totalSavedAllGoals
                      )}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 items-center justify-center rounded-[14px] bg-[#fff0f6]">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M12 3L14.3 8.7L20 11L14.3 13.3L12 19L9.7 13.3L4 11L9.7 8.7L12 3Z"
                        fill="#EC4899"
                      />
                    </svg>
                  </div>
                </div>

                <p className="mt-0.5 text-[9px] text-[#ad7789]">
                  {goalsSummary.totalGoalsCount} couple goals
                </p>

                <div className="mt-3 space-y-2">
                  {topGoals.map((goal) => (
                    <div
                      key={goal.goalId}
                      className="flex items-center justify-between rounded-[13px] border border-[#fce7f3] bg-[#fffafd] px-3 py-2"
                    >
                      <div className="flex min-w-0 items-center gap-2">
                        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#fff0f6] text-sm">
                          {goalCategoryEmoji[goal.category] ?? "✨"}
                        </span>

                        <span className="truncate text-[10px] font-semibold text-[#684050]">
                          {goal.title}
                        </span>
                      </div>

                      <span className="ml-3 shrink-0 text-[10px] font-bold text-[#a34d6e]">
                        {formatRupiah(goal.totalSaved)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================= */}
          {/* BOTTOM DECORATION */}
          {/* ================================================= */}

          <div className="relative z-10 mt-auto px-8 pb-6 pt-6">
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#f1bfd2]" />

              <div className="flex items-center gap-1.5">
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 0.5L6.4 4.6L10.5 5.5L6.4 6.4L5.5 10.5L4.6 6.4L0.5 5.5L4.6 4.6L5.5 0.5Z"
                    fill="#F9A8D4"
                  />
                </svg>

                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[#b4778b]">
                  made with duora
                </span>

                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 11 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5.5 0.5L6.4 4.6L10.5 5.5L6.4 6.4L5.5 10.5L4.6 6.4L0.5 5.5L4.6 4.6L5.5 0.5Z"
                    fill="#F9A8D4"
                  />
                </svg>
              </div>

              <div className="h-px flex-1 bg-[#f1bfd2]" />
            </div>
          </div>

          {/* ================================================= */}
          {/* SMALL FLOATING HEARTS */}
          {/* ================================================= */}

          <div className="pointer-events-none absolute left-5 top-[44%] rotate-[-12deg] text-[#f9a8d4]">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61C19.11 2.88 16.28 2.88 14.55 4.61L12 7.17L9.45 4.61C7.72 2.88 4.89 2.88 3.16 4.61C1.43 6.34 1.43 9.17 3.16 10.9L12 19.74L20.84 10.9C22.57 9.17 22.57 6.34 20.84 4.61Z"
                fill="currentColor"
              />
            </svg>
          </div>

          <div className="pointer-events-none absolute right-6 top-[52%] rotate-[15deg] text-[#fbcfe8]">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M20.84 4.61C19.11 2.88 16.28 2.88 14.55 4.61L12 7.17L9.45 4.61C7.72 2.88 4.89 2.88 3.16 4.61C1.43 6.34 1.43 9.17 3.16 10.9L12 19.74L20.84 10.9C22.57 9.17 22.57 6.34 20.84 4.61Z"
                fill="currentColor"
              />
            </svg>
          </div>
        </div>
      </WrappedCard>
    );
  }
);

WrappedCardBold.displayName = "WrappedCardBold";