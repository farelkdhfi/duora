"use client";

import { createPortal } from "react-dom";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import {
  Download,
  Share2,
  X,
} from "lucide-react";

import { CountdownShareCard } from "./countdown-share-card";
import { TemplatePicker } from "@/features/share-template/components/template-picker";
import type { MeetupCountdown } from "../types";

interface ShareButtonProps {
  countdown: MeetupCountdown;
  relationshipId: string;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  partnerAName?: string;
  partnerBName?: string;
}

export function ShareButton({
  countdown,
  relationshipId,
  timeLeft,
  partnerAName,
  partnerBName,
}: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] =
    useState(false);

  const cardRef = useRef<HTMLDivElement>(null);

  async function generateImage(): Promise<Blob | null> {
    if (!cardRef.current) return null;

    setIsGenerating(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 3,
        cacheBust: true,

        // Fixed export canvas.
        width: 360,
        height: 640,

        style: {
          width: "360px",
          height: "640px",
          transform: "none",
          margin: "0",
        },
      });

      const res = await fetch(dataUrl);

      return await res.blob();
    } catch (err) {
      console.error(
        "Failed to generate image:",
        err
      );

      return null;
    } finally {
      setIsGenerating(false);
    }
  }

  async function handleDownload() {
    const blob = await generateImage();

    if (!blob) return;

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;

    link.download = `countdown-${countdown.title
      .replace(/\s+/g, "-")
      .toLowerCase()}.png`;

    document.body.appendChild(link);

    link.click();

    link.remove();

    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const blob = await generateImage();

    if (!blob) return;

    const file = new File(
      [blob],
      "countdown.png",
      {
        type: "image/png",
      }
    );

    if (
      navigator.share &&
      navigator.canShare?.({
        files: [file],
      })
    ) {
      try {
        await navigator.share({
          files: [file],
          title: countdown.title,
          text: `${timeLeft.days} hari lagi ketemu! 💕`,
        });
      } catch {
        // User cancelled share.
      }
    } else {
      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;

      link.download = "countdown.png";

      document.body.appendChild(link);

      link.click();

      link.remove();

      URL.revokeObjectURL(url);
    }
  }

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/45 p-3 backdrop-blur-sm sm:p-4">
      <div className="flex max-h-[95svh] w-full max-w-[420px] flex-col overflow-hidden rounded-[28px] bg-[#fafaf9] shadow-[0_30px_100px_-30px_rgba(0,0,0,0.4)]">
        {/* Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-black/[0.06] px-5 py-4">
          <div>
            <p className="text-sm font-semibold tracking-[-0.025em] text-[#171717]">
              Share countdown
            </p>

            <p className="mt-0.5 text-[10px] text-black/35">
              Fixed 9:16 · 1080 × 1920
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex size-8 items-center justify-center rounded-full bg-black/[0.04] text-black/45 transition hover:bg-black/[0.08] hover:text-black"
          >
            <X
              size={15}
              strokeWidth={1.8}
            />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          {/* Fixed 9:16 preview */}
          <div className="flex w-full justify-center">
            <div className="relative aspect-[9/16] w-full max-w-[360px] overflow-hidden rounded-[28px] shadow-[0_24px_70px_-25px_rgba(0,0,0,0.32)]">
              <div className="absolute left-1/2 top-0 h-[640px] w-[360px] origin-top -translate-x-1/2">
                <CountdownShareCard
                  ref={cardRef}
                  countdown={countdown}
                  relationshipId={
                    relationshipId
                  }
                  timeLeft={timeLeft}
                  partnerAName={
                    partnerAName
                  }
                  partnerBName={
                    partnerBName
                  }
                />
              </div>
            </div>
          </div>

          {/* Template */}
          <div className="mt-5">
            <TemplatePicker
              relationshipId={
                relationshipId
              }
            />
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 border-t border-black/[0.06] bg-[#fafaf9] px-5 py-4">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleDownload}
              disabled={isGenerating}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-black/[0.08] bg-white text-xs font-medium text-[#171717] transition hover:bg-black/[0.025] disabled:opacity-50"
            >
              <Download
                size={14}
                strokeWidth={1.8}
              />

              {isGenerating
                ? "Memproses..."
                : "Download"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={isGenerating}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#171717] text-xs font-medium text-white transition hover:bg-black/90 disabled:opacity-50"
            >
              <Share2
                size={14}
                strokeWidth={1.8}
              />

              {isGenerating
                ? "Memproses..."
                : "Share"}
            </button>
          </div>

          <p className="mt-3 text-center text-[10px] text-black/25">
            Fixed 9:16 · 1080 × 1920 px
          </p>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-xs text-gray-400 transition hover:text-pink-500"
      >
        <Share2
          size={14}
          strokeWidth={1.7}
        />

        Share
      </button>

      {typeof document !== "undefined" &&
        createPortal(
          modal,
          document.body
        )}
    </>
  );
}