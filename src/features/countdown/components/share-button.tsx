"use client";

import { createPortal } from "react-dom";
import { useEffect, useRef, useState } from "react";
import { toPng } from "html-to-image";
import { Download, Share2, X } from "lucide-react";

import { CountdownShareCard } from "./countdown-share-card";
import { TemplatePicker } from "@/features/share-template/components/template-picker";
import type { MeetupCountdown } from "../types";

/**
 * Ukuran kanvas kartu (rasio 9:16).
 * Export memakai pixelRatio 3 → 1080 × 1920 px.
 */
const CARD_WIDTH = 360;
const CARD_HEIGHT = 640;
const EXPORT_PIXEL_RATIO = 3;

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

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(url);
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

  // Skala preview (null = belum diukur).
  const [scale, setScale] = useState<number | null>(null);

  // Frame yang diukur untuk menentukan skala preview.
  const frameRef = useRef<HTMLDivElement>(null);

  // Elemen 360×640 TANPA scale — inilah yang di-export ke PNG.
  const exportRef = useRef<HTMLDivElement>(null);

  // Hitung skala preview berdasarkan lebar frame yang tersedia.
  useEffect(() => {
    if (!isOpen) return;

    const frame = frameRef.current;
    if (!frame) return;

    const update = () => {
      const width = frame.clientWidth;

      if (width > 0) {
        setScale(Math.min(1, width / CARD_WIDTH));
      }
    };

    update();

    const observer = new ResizeObserver(update);
    observer.observe(frame);

    return () => observer.disconnect();
  }, [isOpen]);

  async function generateImage(): Promise<Blob | null> {
    if (!exportRef.current) return null;

    setIsGenerating(true);

    try {
      // Pastikan font sudah siap supaya hasil export konsisten.
      if (typeof document !== "undefined" && document.fonts?.ready) {
        await document.fonts.ready;
      }

      const dataUrl = await toPng(exportRef.current, {
        pixelRatio: EXPORT_PIXEL_RATIO,
        cacheBust: true,

        // Kanvas export tetap: 360×640 × 3 = 1080×1920.
        width: CARD_WIDTH,
        height: CARD_HEIGHT,

        style: {
          width: `${CARD_WIDTH}px`,
          height: `${CARD_HEIGHT}px`,
          transform: "none",
          margin: "0",
        },
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

    downloadBlob(
      blob,
      `countdown-${countdown.title.replace(/\s+/g, "-").toLowerCase()}.png`
    );
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
        // User cancelled share.
      }
    } else {
      downloadBlob(blob, "countdown.png");
    }
  }

  const previewScale = scale ?? 1;

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
            <X size={15} strokeWidth={1.8} />
          </button>
        </div>

        {/* Content */}
        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-5">
          {/* Preview 9:16 — selalu proporsional, tidak pernah terpotong */}
          <div
            ref={frameRef}
            className="mx-auto w-full"
            style={{ maxWidth: CARD_WIDTH }}
          >
            {/* Kotak preview: ukurannya = ukuran kartu × skala */}
            <div
              className="relative overflow-hidden rounded-[28px] shadow-[0_24px_70px_-25px_rgba(0,0,0,0.32)]"
              style={{
                width: CARD_WIDTH * previewScale,
                height: CARD_HEIGHT * previewScale,
                visibility: scale === null ? "hidden" : "visible",
              }}
            >
              {/* Layer yang di-scale (hanya untuk tampilan preview) */}
              <div
                className="absolute left-0 top-0"
                style={{
                  width: CARD_WIDTH,
                  height: CARD_HEIGHT,
                  transform: `scale(${previewScale})`,
                  transformOrigin: "top left",
                }}
              >
                {/* Elemen export: selalu 360×640, tanpa scale */}
                <div
                  ref={exportRef}
                  className="relative overflow-hidden"
                  style={{
                    width: CARD_WIDTH,
                    height: CARD_HEIGHT,
                  }}
                >
                  <CountdownShareCard
                    countdown={countdown}
                    relationshipId={relationshipId}
                    timeLeft={timeLeft}
                    partnerAName={partnerAName}
                    partnerBName={partnerBName}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Template */}
          <div className="mt-5">
            <TemplatePicker relationshipId={relationshipId} />
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
              <Download size={14} strokeWidth={1.8} />

              {isGenerating ? "Memproses..." : "Download"}
            </button>

            <button
              type="button"
              onClick={handleShare}
              disabled={isGenerating}
              className="flex h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-[#171717] text-xs font-medium text-white transition hover:bg-black/90 disabled:opacity-50"
            >
              <Share2 size={14} strokeWidth={1.8} />

              {isGenerating ? "Memproses..." : "Share"}
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
        <Share2 size={14} strokeWidth={1.7} />

        Share
      </button>

      {typeof document !== "undefined" && createPortal(modal, document.body)}
    </>
  );
}