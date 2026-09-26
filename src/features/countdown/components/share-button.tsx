"use client";

import { createPortal } from "react-dom";
import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2 } from "lucide-react";
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
  const [isGenerating, setIsGenerating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  async function generateImage(): Promise<Blob | null> {
    if (!cardRef.current) return null;

    setIsGenerating(true);

    try {
      const dataUrl = await toPng(cardRef.current, {
        pixelRatio: 2,
        cacheBust: true,
      });

      const res = await fetch(dataUrl);

      return await res.blob();
    } catch (err) {
      console.error("Failed to generate image:", err);
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

    link.click();

    URL.revokeObjectURL(url);
  }

  async function handleShare() {
    const blob = await generateImage();

    if (!blob) return;

    const file = new File([blob], "countdown.png", {
      type: "image/png",
    });

    if (navigator.share && navigator.canShare?.({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: countdown.title,
          text: `${timeLeft.days} hari lagi ketemu! 💕`,
        });
      } catch {
        // User cancelled share
      }
    } else {
      handleDownload();
    }
  }

  const modal = isOpen ? (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 p-4">
      <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl bg-white p-6">
        {/* Preview card */}
        <div className="flex justify-center">
          <CountdownShareCard
            ref={cardRef}
            countdown={countdown}
            relationshipId={relationshipId}
            timeLeft={timeLeft}
            partnerAName={partnerAName}
            partnerBName={partnerBName}
          />
        </div>

        {/* Template picker */}
        <div className="mt-4">
          <TemplatePicker relationshipId={relationshipId} />
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownload}
            disabled={isGenerating}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg border border-gray-200 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            <Download size={14} />
            {isGenerating ? "Memproses..." : "Download"}
          </button>

          <button
            onClick={handleShare}
            disabled={isGenerating}
            className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-pink-500 py-2 text-sm font-medium text-white hover:bg-pink-600 disabled:opacity-50"
          >
            <Share2 size={14} />
            {isGenerating ? "Memproses..." : "Share"}
          </button>
        </div>

        <button
          onClick={() => setIsOpen(false)}
          className="mt-3 w-full text-center text-xs text-gray-400 hover:underline"
        >
          Tutup
        </button>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1 text-xs text-gray-400 hover:text-pink-500"
      >
        <Share2 size={14} />
        Share
      </button>

      {typeof document !== "undefined" &&
        createPortal(modal, document.body)}
    </>
  );
}