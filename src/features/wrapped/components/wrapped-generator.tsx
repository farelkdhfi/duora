"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Heart, Share2, Sparkles, X } from "lucide-react";

import { WrappedCardSwitcher } from "./wrapped-card-switcher";
import { WrappedPreferencePicker } from "./wrapped-preference-picker";

import {
  useMoodSummary,
  useCompletedMeetups,
  useWrappedPreference,
  useScreenTimeForWrapped,
} from "../queries";

import { useGoalsWithSavingsSummary } from "@/features/savings/queries";

import {
  getTotalDaysLdr,
  getCurrentMilestoneLabel,
  summarizeGoalsForWrapped,
  summarizeMeetupsForWrapped,
  summarizeScreenTimeForWrapped,
} from "../utils";

interface WrappedGeneratorProps {
  relationshipId: string;
  relationshipName: string;
  startedAt: string;
}

export function WrappedGenerator({
  relationshipId,
  relationshipName,
  startedAt,
}: WrappedGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  const { data: moodSummary, isLoading: isLoadingMood } = useMoodSummary(relationshipId);

  const { data: goalsWithSavings, isLoading: isLoadingGoals } = useGoalsWithSavingsSummary(relationshipId);

  const { data: completedMeetups, isLoading: isLoadingMeetups } = useCompletedMeetups(relationshipId);

  const { data: preference, isLoading: isLoadingPreference } = useWrappedPreference(relationshipId);

  const { data: screenTimeData, isLoading: isLoadingScreenTime } = useScreenTimeForWrapped(relationshipId);

  const isLoading = isLoadingMood || isLoadingGoals || isLoadingMeetups || isLoadingPreference || isLoadingScreenTime;

  const totalDays = getTotalDaysLdr(startedAt);

  const milestoneLabel = getCurrentMilestoneLabel(totalDays);

  const goalsSummary = summarizeGoalsForWrapped(goalsWithSavings ?? []);

  const meetupSummary = summarizeMeetupsForWrapped(completedMeetups ?? []);

  const screenTimeSummary = summarizeScreenTimeForWrapped(screenTimeData ?? null);

  const templateId = preference?.template_id ?? "soft";

  const showMood = preference?.show_mood ?? true;
  const showMeetup = preference?.show_meetup ?? true;
  const showGoals = preference?.show_goals ?? true;
  const showScreenTime = preference?.show_screen_time ?? true;

  const customColorPrimary = preference?.custom_color_primary;
  const customColorSecondary = preference?.custom_color_secondary;

  async function createImage() {
    if (!cardRef.current) return null;

    return await toPng(cardRef.current, {
      pixelRatio: 2,
      cacheBust: true,
    });
  }

  async function handleDownload() {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = await createImage();

      if (!dataUrl) return;

      const link = document.createElement("a");

      link.href = dataUrl;

      link.download = `ldr-wrapped-${milestoneLabel.replace(/\s+/g, "-").toLowerCase()}.png`;

      link.click();
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleShare() {
    if (!cardRef.current) return;

    setIsGenerating(true);

    try {
      const dataUrl = await createImage();

      if (!dataUrl) return;

      const response = await fetch(dataUrl);
      const blob = await response.blob();

      const file = new File([blob], "ldr-wrapped.png", {
        type: "image/png",
      });

      if (navigator.share && navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "LDR Wrapped",
        });
      } else {
        const link = document.createElement("a");

        link.href = dataUrl;
        link.download = "ldr-wrapped.png";
        link.click();
      }
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.08] bg-white px-5 py-2.5 text-sm font-medium text-neutral-900 shadow-[0_12px_35px_-20px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-neutral-50 hover:shadow-[0_16px_40px_-20px_rgba(0,0,0,0.5)] active:translate-y-0"
      >
        <span className="flex size-6 items-center justify-center rounded-full bg-pink-50 text-pink-500 transition-transform duration-300 group-hover:scale-105">
          <Sparkles size={12} strokeWidth={2} />
        </span>

        <span>View your wrapped</span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 z-53 flex items-center justify-center bg-neutral-950/55 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setIsOpen(false);
            }
          }}
        >
          <div className="relative flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-[#fafaf9] shadow-[0_35px_100px_-30px_rgba(0,0,0,0.55)] sm:rounded-[2.5rem] lg:flex-row">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 z-30 flex size-9 items-center justify-center rounded-full border border-black/[0.06] bg-white/90 text-neutral-400 shadow-sm backdrop-blur transition hover:bg-white hover:text-neutral-900"
              aria-label="Close"
            >
              <X size={16} />
            </button>

            {/* LEFT — PREVIEW */}
            <div className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-[#f2f1ef] lg:min-h-[720px]">
              <div className="pointer-events-none absolute -right-28 -top-28 size-72 rounded-full bg-pink-200/30 blur-3xl" />

              <div className="pointer-events-none absolute -bottom-32 -left-24 size-80 rounded-full bg-blue-200/20 blur-3xl" />

              <div className="relative flex min-h-0 flex-1 flex-col">
                <div className="flex shrink-0 items-center justify-center gap-2 px-6 pb-3 pt-8 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400 sm:pt-10">
                  <span className="size-1.5 rounded-full bg-pink-400" />
                  Your relationship story
                </div>

                {/* SCROLLABLE PREVIEW */}
                <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 pb-8 pt-3 sm:px-8 [scrollbar-width:thin] [scrollbar-color:rgba(163,163,163,0.35)_transparent]">
                  <div className="flex min-h-full w-full items-start justify-center">
                    {isLoading ? (
                      <div className="mt-8 flex h-[520px] w-[292px] shrink-0 items-center justify-center rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)]">
                        <div className="text-center">
                          <div className="mx-auto flex size-10 items-center justify-center rounded-2xl border border-black/[0.05] bg-neutral-50">
                            <Sparkles size={15} className="animate-pulse text-neutral-400" />
                          </div>

                          <p className="mt-4 text-xs text-neutral-400">
                            Preparing your story...
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex shrink-0 origin-top scale-[0.58] sm:scale-[0.68] lg:scale-[0.72]">
                        <WrappedCardSwitcher
                          ref={cardRef}
                          templateId={templateId}
                          relationshipName={relationshipName}
                          startedAt={startedAt}
                          moodSummary={moodSummary ?? []}
                          goalsSummary={goalsSummary}
                          meetupSummary={meetupSummary}
                          screenTimeSummary={screenTimeSummary}
                          milestoneLabel={milestoneLabel}
                          showMood={showMood}
                          showMeetup={showMeetup}
                          showGoals={showGoals}
                          showScreenTime={showScreenTime}
                          customColorPrimary={customColorPrimary}
                          customColorSecondary={customColorSecondary}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex shrink-0 items-center justify-center gap-2 px-6 pb-7 pt-2 text-[10px] text-neutral-400 sm:pb-8">
                  <Heart size={10} fill="currentColor" className="text-pink-400" />

                  <span>{relationshipName}</span>

                  <span className="text-neutral-300">·</span>

                  <span>{totalDays} days</span>
                </div>
              </div>
            </div>

            {/* RIGHT — CONTROLS */}
            <div className="flex w-full min-h-0 flex-col overflow-y-auto bg-white lg:w-[390px] lg:shrink-0">
              <div className="border-b border-black/[0.05] px-6 pb-5 pt-7 sm:px-7 sm:pt-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                  LDR Wrapped
                </p>

                <h2 className="mt-1.5 text-xl font-semibold tracking-[-0.045em] text-neutral-900">
                  Make it yours.
                </h2>

                <p className="mt-1.5 max-w-sm text-xs leading-5 text-neutral-400">
                  Choose the look and moments you want to keep in your wrapped.
                </p>
              </div>

              <div className="px-6 py-6 sm:px-7">
                <WrappedPreferencePicker relationshipId={relationshipId} />
              </div>

              <div className="mt-auto border-t border-black/[0.05] bg-[#fafaf9] px-6 py-5 sm:px-7">
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isGenerating || isLoading}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white text-xs font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Download size={14} />

                    {isGenerating ? "Preparing..." : "Download"}
                  </button>

                  <button
                    type="button"
                    onClick={handleShare}
                    disabled={isGenerating || isLoading}
                    className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 text-xs font-medium text-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Share2 size={14} />

                    {isGenerating ? "Preparing..." : "Share"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="mt-3 w-full text-center text-[11px] font-medium text-neutral-400 transition hover:text-neutral-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}