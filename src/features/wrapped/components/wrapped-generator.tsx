"use client";

import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, Sparkles } from "lucide-react";

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewScale, setPreviewScale] = useState(1);

  const cardRef = useRef<HTMLDivElement>(null);
  const previewContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = previewContainerRef.current;

    if (!container) return;

    const updateScale = () => {
      const width = container.clientWidth;

      const horizontalPadding = width < 640 ? 24 : 48;

      const availableWidth = Math.max(
        width - horizontalPadding,
        1,
      );

      setPreviewScale(
        Math.min(1, availableWidth / 540),
      );
    };

    updateScale();

    const observer = new ResizeObserver(updateScale);

    observer.observe(container);

    return () => observer.disconnect();
  }, []);

  const { data: moodSummary, isLoading: isLoadingMood } =
    useMoodSummary(relationshipId);

  const { data: goalsWithSavings, isLoading: isLoadingGoals } =
    useGoalsWithSavingsSummary(relationshipId);

  const { data: completedMeetups, isLoading: isLoadingMeetups } =
    useCompletedMeetups(relationshipId);

  const { data: preference, isLoading: isLoadingPreference } =
    useWrappedPreference(relationshipId);

  const { data: screenTimeData, isLoading: isLoadingScreenTime } =
    useScreenTimeForWrapped(relationshipId);

  const isLoading =
    isLoadingMood ||
    isLoadingGoals ||
    isLoadingMeetups ||
    isLoadingPreference ||
    isLoadingScreenTime;

  const totalDays = getTotalDaysLdr(startedAt);

  const milestoneLabel = getCurrentMilestoneLabel(totalDays);

  const goalsSummary = summarizeGoalsForWrapped(
    goalsWithSavings ?? [],
  );

  const meetupSummary = summarizeMeetupsForWrapped(
    completedMeetups ?? [],
  );

  const screenTimeSummary = summarizeScreenTimeForWrapped(
    screenTimeData ?? null,
  );

  const templateId = preference?.template_id ?? "soft";

  const showMood = preference?.show_mood ?? true;
  const showMeetup = preference?.show_meetup ?? true;
  const showGoals = preference?.show_goals ?? true;
  const showScreenTime = preference?.show_screen_time ?? true;

  const customColorPrimary =
    preference?.custom_color_primary;

  const customColorSecondary =
    preference?.custom_color_secondary;

  function scrollToPreview() {
    const container = previewContainerRef.current;

    if (!container) return;

    requestAnimationFrame(() => {
      container.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

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

      link.download = `ldr-wrapped-${milestoneLabel
        .replace(/\s+/g, "-")
        .toLowerCase()}.png`;

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

      const file = new File(
        [blob],
        "ldr-wrapped.png",
        {
          type: "image/png",
        },
      );

      if (
        navigator.share &&
        navigator.canShare?.({
          files: [file],
        })
      ) {
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
    <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.05] bg-white/80 shadow-[0_25px_70px_rgba(0,0,0,0.045)] backdrop-blur-xl sm:rounded-[2rem]">
      <div className="flex flex-col">
        {/* ================================================= */}
        {/* PREVIEW */}
        {/* ================================================= */}

        <div
          ref={previewContainerRef}
          className="relative flex min-w-0 flex-col overflow-hidden bg-white scroll-mt-4"
        >
          <div className="relative flex min-h-0 flex-1 flex-col">
            <div className="min-h-0 flex-1 overflow-auto [scrollbar-width:thin] [scrollbar-color:rgba(163,163,163,0.35)_transparent]">
              <div
                className="flex w-full items-start justify-center px-3 py-6 sm:px-6 sm:py-8"
                style={{
                  minHeight: `${960 * previewScale + 48}px`,
                }}
              >
                {isLoading ? (
                  <div
                    className="flex shrink-0 items-center justify-center rounded-[2rem] border border-black/[0.05] bg-white shadow-[0_30px_70px_-35px_rgba(0,0,0,0.25)]"
                    style={{
                      width: `${540 * previewScale}px`,
                      height: `${960 * previewScale}px`,
                    }}
                  >
                    <div className="text-center">
                      <div className="mx-auto flex size-10 items-center justify-center rounded-2xl border border-black/[0.05] bg-neutral-50">
                        <Sparkles
                          size={15}
                          className="animate-pulse text-neutral-400"
                        />
                      </div>

                      <p className="mt-4 text-xs text-neutral-400">
                        Preparing your story...
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="shrink-0 origin-top"
                    style={{
                      width: "540px",
                      height: "960px",
                      transform: `scale(${previewScale})`,
                      marginBottom: `${960 * (previewScale - 1)}px`,
                    }}
                  >
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
                      customColorPrimary={
                        customColorPrimary
                      }
                      customColorSecondary={
                        customColorSecondary
                      }
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ================================================= */}
        {/* CONTROLS */}
        {/* ================================================= */}

        <div className="flex min-h-0 flex-col border-t border-black/[0.05] bg-white lg:border-l lg:border-t-0">
          <div className="border-b border-black/[0.05] px-6 pb-5 pt-6 sm:px-7 sm:pt-7">
            <h2 className="mt-3 text-xl font-semibold tracking-[-0.045em] text-neutral-900">
              Make it yours.
            </h2>

            <p className="mt-1.5 max-w-sm text-xs leading-5 text-neutral-400">
              Choose the look and moments you want
              to keep in your wrapped.
            </p>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-6 py-6 sm:px-7 [scrollbar-width:thin] [scrollbar-color:rgba(163,163,163,0.25)_transparent]">
            <WrappedPreferencePicker
              relationshipId={relationshipId}
              onTemplateSelect={scrollToPreview}
            />
          </div>

          <div className="shrink-0 border-t border-black/[0.05] bg-[#fafaf9] px-6 py-5 sm:px-7">
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={handleDownload}
                disabled={
                  isGenerating ||
                  isLoading
                }
                className="flex h-11 items-center justify-center gap-2 rounded-xl border border-black/[0.07] bg-white text-xs font-medium text-neutral-700 shadow-sm transition hover:bg-neutral-50 hover:text-neutral-900 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Download size={14} />

                {isGenerating
                  ? "Preparing..."
                  : "Download"}
              </button>

              <button
                type="button"
                onClick={handleShare}
                disabled={
                  isGenerating ||
                  isLoading
                }
                className="flex h-11 items-center justify-center gap-2 rounded-xl bg-neutral-900 text-xs font-medium text-white shadow-[0_10px_30px_-15px_rgba(0,0,0,0.5)] transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Share2 size={14} />

                {isGenerating
                  ? "Preparing..."
                  : "Share"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}