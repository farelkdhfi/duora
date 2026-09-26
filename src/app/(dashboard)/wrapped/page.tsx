"use client";

import { Sparkles } from "lucide-react";

import Header from "@/components/layout/header";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { WrappedGenerator } from "@/features/wrapped/components/wrapped-generator";
import {
  useMoodSummary,
  useCompletedMeetups,
} from "@/features/wrapped/queries";
import { useGoalsWithSavingsSummary } from "@/features/savings/queries";
import {
  getTotalDaysLdr,
  getReachedMilestones,
  getCurrentMilestoneLabel,
  milestoneLabels,
  moodEmoji,
  moodLabel,
  summarizeMeetupsForWrapped,
  summarizeGoalsForWrapped,
  formatRupiah,
  goalCategoryEmoji,
} from "@/features/wrapped/utils";

export default function WrappedPage() {
  const { data: relationshipDetails, isLoading } =
    useMyRelationshipDetails();

  const relationshipId = relationshipDetails?.relationship.id;

  const { data: moodSummary } = useMoodSummary(relationshipId);
  const { data: completedMeetups } = useCompletedMeetups(relationshipId);
  const { data: goalsWithSavings } = useGoalsWithSavingsSummary(
    relationshipId ?? "",
  );

  if (isLoading) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="relative text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50">
            <Sparkles
              size={19}
              strokeWidth={1.8}
              className="text-pink-400"
            />
          </div>

          <p className="mt-4 text-[13px] text-neutral-400">
            Preparing your wrapped...
          </p>
        </div>
      </div>
    );
  }

  if (!relationshipDetails) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />

        <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 sm:size-12">
              <Sparkles
                size={19}
                strokeWidth={1.8}
                className="text-pink-400"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
              Connect with your partner
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              Connect your relationship first to create a beautiful recap of
              your journey together.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { relationship } = relationshipDetails;

  if (!relationship.started_at) {
    return (
      <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute -left-32 top-20 size-80 rounded-full bg-pink-200/20 blur-[120px]" />
        <div className="pointer-events-none absolute -right-32 bottom-20 size-80 rounded-full bg-blue-200/20 blur-[120px]" />

        <div className="relative w-full max-w-md overflow-hidden rounded-[1.5rem] border border-black/[0.05] bg-white/80 p-6 text-center shadow-[0_25px_70px_rgba(0,0,0,0.05)] backdrop-blur-xl sm:rounded-[2rem] sm:p-8">
          <div className="pointer-events-none absolute -right-16 -top-16 size-40 rounded-full bg-pink-100/40 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 size-40 rounded-full bg-blue-100/40 blur-3xl" />

          <div className="relative">
            <div className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 sm:size-12">
              <Sparkles
                size={19}
                strokeWidth={1.8}
                className="text-pink-400"
              />
            </div>

            <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800 sm:text-xl">
              Start your story
            </h2>

            <p className="mx-auto mt-2 max-w-sm text-[13px] leading-6 text-neutral-400 sm:text-sm">
              Set your relationship start date first to begin collecting your
              shared memories.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const totalDays = getTotalDaysLdr(relationship.started_at);
  const reachedMilestones = getReachedMilestones(totalDays);
  const currentLabel = getCurrentMilestoneLabel(totalDays);

  const totalCheckins =
    moodSummary?.reduce((sum, mood) => sum + mood.count, 0) ?? 0;

  const meetupSummary = summarizeMeetupsForWrapped(
    completedMeetups ?? [],
  );

  const goalsSummary = summarizeGoalsForWrapped(
    goalsWithSavings ?? [],
  );

  const topGoals = [...goalsSummary.goals]
    .sort((a, b) => b.totalSaved - a.totalSaved)
    .slice(0, 3);

  return (
    <div className="relative">
      {/* Ambient background */}
      <div className="pointer-events-none absolute -left-32 top-24 size-96 rounded-full bg-pink-200/20 blur-[140px]" />
      <div className="pointer-events-none absolute -right-32 top-[35rem] size-96 rounded-full bg-blue-200/20 blur-[140px]" />

      <Header
        title="wrapped"
        description="A little recap of everything you've shared together."
        icon={Sparkles}
      />

      <div className="relative mt-8 space-y-6 sm:mt-10 sm:space-y-8">
        {/* HERO */}
        <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/75 px-6 py-8 shadow-[0_25px_70px_rgba(0,0,0,0.04)] backdrop-blur-xl sm:rounded-[2rem] sm:px-10 sm:py-12">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-100/40 blur-3xl" />

          <div className="relative">
            <div className="flex items-start justify-between gap-6">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                  Your relationship story
                </p>

                <h1 className="mt-3 max-w-xl text-3xl font-semibold tracking-[-0.05em] text-neutral-800 sm:text-4xl">
                  {relationship.name}
                </h1>

                <p className="mt-3 max-w-lg text-[13px] leading-6 text-neutral-400 sm:text-sm">
                  A collection of little moments, milestones, and memories
                  you've created together.
                </p>
              </div>

              <div className="hidden size-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 to-blue-50 sm:flex">
                <Sparkles
                  size={20}
                  strokeWidth={1.7}
                  className="text-pink-400"
                />
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-4 border-t border-black/[0.05] pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.12em] text-neutral-300">
                  Together for
                </p>

                <div className="mt-1 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-[-0.05em] text-neutral-800">
                    {totalDays.toLocaleString("id-ID")}
                  </span>

                  <span className="text-sm text-neutral-400">
                    days
                  </span>
                </div>
              </div>

              <p className="text-[13px] text-neutral-400 sm:text-right">
                {currentLabel}
              </p>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section>
          <div className="mb-4">
            <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
              At a glance
            </p>

            <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
              Your time together
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-[1.25rem] border border-black/[0.05] bg-white/75 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-neutral-800">
                {totalDays.toLocaleString("id-ID")}
              </p>

              <p className="mt-1 text-[11px] text-neutral-400">
                Days together
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-black/[0.05] bg-white/75 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-neutral-800">
                {totalCheckins.toLocaleString("id-ID")}
              </p>

              <p className="mt-1 text-[11px] text-neutral-400">
                Check-ins
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-black/[0.05] bg-white/75 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-neutral-800">
                {meetupSummary.totalMeetups.toLocaleString("id-ID")}
              </p>

              <p className="mt-1 text-[11px] text-neutral-400">
                Meetups
              </p>
            </div>

            <div className="rounded-[1.25rem] border border-black/[0.05] bg-white/75 p-5 shadow-[0_15px_45px_rgba(0,0,0,0.03)] backdrop-blur-xl">
              <p className="text-2xl font-semibold tracking-[-0.04em] text-neutral-800">
                {Math.round(meetupSummary.totalDistanceKm).toLocaleString(
                  "id-ID",
                )}
              </p>

              <p className="mt-1 text-[11px] text-neutral-400">
                KM traveled
              </p>
            </div>
          </div>
        </section>

        {/* MOOD */}
        {moodSummary && moodSummary.length > 0 && (
          <section className="rounded-[1.5rem] border border-black/[0.05] bg-white/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.035)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                  Emotional snapshot
                </p>

                <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
                  How you've been feeling
                </h2>
              </div>

              <span className="text-[11px] text-neutral-400">
                {totalCheckins} check-ins
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {moodSummary.map((mood) => {
                const percentage =
                  totalCheckins > 0
                    ? (mood.count / totalCheckins) * 100
                    : 0;

                return (
                  <div key={mood.mood}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span className="text-base">
                          {moodEmoji[mood.mood]}
                        </span>

                        <span className="truncate text-[13px] font-medium text-neutral-600">
                          {moodLabel[mood.mood]}
                        </span>
                      </div>

                      <span className="shrink-0 text-[11px] text-neutral-400">
                        {mood.count}x
                      </span>
                    </div>

                    <div className="mt-2 h-1 overflow-hidden rounded-full bg-neutral-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-pink-300 to-pink-200 transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* MEETUPS */}
        {meetupSummary.totalMeetups > 0 && (
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-[1.5rem] border border-black/[0.05] bg-white/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.035)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                Time spent together
              </p>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-800">
                {meetupSummary.totalMeetups}
              </p>

              <p className="mt-1 text-[13px] text-neutral-400">
                moments you've met in person
              </p>
            </div>

            <div className="rounded-[1.5rem] border border-black/[0.05] bg-white/75 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.035)] backdrop-blur-xl">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                Distance covered
              </p>

              <p className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-neutral-800">
                {Math.round(
                  meetupSummary.totalDistanceKm,
                ).toLocaleString("id-ID")}
                <span className="ml-1 text-base font-normal text-neutral-400">
                  km
                </span>
              </p>

              <p className="mt-1 text-[13px] text-neutral-400">
                roads traveled to see each other
              </p>
            </div>
          </section>
        )}

        {/* GOALS */}
        {goalsSummary.totalGoalsCount > 0 && (
          <section className="rounded-[1.5rem] border border-black/[0.05] bg-white/75 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.035)] backdrop-blur-xl sm:rounded-[1.75rem] sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                  Building together
                </p>

                <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
                  Couple goals
                </h2>
              </div>

              <span className="text-[11px] text-neutral-400">
                {goalsSummary.totalGoalsCount} goals
              </span>
            </div>

            <div className="mt-6 border-b border-black/[0.05] pb-5">
              <p className="text-3xl font-semibold tracking-[-0.05em] text-neutral-800">
                {formatRupiah(goalsSummary.totalSavedAllGoals)}
              </p>

              <p className="mt-1 text-[12px] text-neutral-400">
                saved together so far
              </p>
            </div>

            {topGoals.length > 0 && (
              <div className="divide-y divide-black/[0.05]">
                {topGoals.map((goal) => (
                  <div
                    key={goal.goalId}
                    className="flex items-center justify-between gap-4 py-4 first:pt-5 last:pb-1"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-neutral-50 text-sm">
                        {goalCategoryEmoji[goal.category] ?? "✨"}
                      </span>

                      <span className="truncate text-[13px] font-medium text-neutral-600">
                        {goal.title}
                      </span>
                    </div>

                    <span className="shrink-0 text-[12px] font-semibold text-neutral-700">
                      {formatRupiah(goal.totalSaved)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* MILESTONES */}
        {reachedMilestones.length > 0 && (
          <section>
            <div className="mb-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-neutral-300">
                Milestones
              </p>

              <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
                Moments worth remembering
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {reachedMilestones.map((milestone) => (
                <div
                  key={milestone}
                  className="rounded-full border border-black/[0.05] bg-white/75 px-4 py-2 text-[12px] font-medium text-neutral-600 shadow-[0_8px_30px_rgba(0,0,0,0.025)] backdrop-blur-xl"
                >
                  {milestoneLabels[milestone]}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* GENERATOR */}
        <section className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-neutral-900 px-6 py-8 shadow-[0_25px_70px_rgba(0,0,0,0.08)] sm:rounded-[2rem] sm:px-10 sm:py-10">
          <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-pink-400/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 size-64 rounded-full bg-blue-400/10 blur-3xl" />

          <div className="relative flex flex-col items-center text-center">
            <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10">
              <Sparkles
                size={18}
                strokeWidth={1.8}
                className="text-white/80"
              />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-white/40">
              Make it yours
            </p>

            <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-white sm:text-2xl">
              Turn your story into a memory.
            </h2>

            <p className="mt-2 max-w-md text-[13px] leading-6 text-white/45">
              Create a beautiful shareable card with the moments you've
              collected together.
            </p>

            <div className="mt-6">
              <WrappedGenerator
                relationshipId={relationship.id}
                relationshipName={relationship.name}
                startedAt={relationship.started_at}
              />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}