// countdown/components/countdown-share-card.tsx

"use client";

import { forwardRef } from "react";
import type { MeetupCountdown } from "../types";
import { useTemplatePreference } from "@/features/share-template/queries";
import { resolveTemplateColors, getCustomGradientStyle } from "@/features/share-template/utils";

interface CountdownShareCardProps {
  countdown: MeetupCountdown;
  relationshipId: string; // TAMBAHKAN
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  partnerAName?: string;
  partnerBName?: string;
}

export const CountdownShareCard = forwardRef<
  HTMLDivElement,
  CountdownShareCardProps
>(({ countdown, relationshipId, timeLeft, partnerAName = "A", partnerBName = "B" }, ref) => {
  const { data: preference } = useTemplatePreference(relationshipId);

  const { gradientClass } = resolveTemplateColors(preference ?? null);
  const customStyle = getCustomGradientStyle(preference ?? null);

  const formattedDate = new Date(countdown.meetup_date).toLocaleDateString(
    "id-ID",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <div
      ref={ref}
      style={customStyle}
      className={`relative flex h-[600px] w-[400px] flex-col justify-between overflow-hidden rounded-3xl p-8 text-white ${
        customStyle ? "" : `bg-gradient-to-br ${gradientClass}`
      }`}
    >
      <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10" />
      <div className="pointer-events-none absolute -bottom-20 -left-10 h-52 w-52 rounded-full bg-white/10" />

      <div className="relative z-10">
        <p className="text-xs font-medium uppercase tracking-widest text-white/70">
          Countdown Ketemu
        </p>
        <h1 className="mt-1 text-2xl font-bold leading-tight">
          {countdown.cover_emoji} {countdown.title}
        </h1>
        {countdown.location && (
          <p className="mt-1 text-sm text-white/80">📍 {countdown.location}</p>
        )}
      </div>

      {countdown.distance_km !== null && (
        <div className="relative z-10 text-center">
          <p className="text-4xl font-extrabold leading-none">
            {Math.round(countdown.distance_km).toLocaleString("id-ID")} km
          </p>
          <p className="mt-1 text-xs uppercase tracking-widest text-white/70">
            terpisah jarak
          </p>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center justify-center">
        <div className="grid grid-cols-4 gap-2 text-center">
          {[
            { label: "Hari", value: timeLeft.days },
            { label: "Jam", value: timeLeft.hours },
            { label: "Menit", value: timeLeft.minutes },
            { label: "Detik", value: timeLeft.seconds },
          ].map((item) => (
            <div key={item.label} className="flex flex-col items-center">
              <span className="text-3xl font-extrabold leading-none tabular-nums">
                {item.value.toString().padStart(2, "0")}
              </span>
              <span className="mt-1 text-[10px] uppercase tracking-wide text-white/70">
                {item.label}
              </span>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-white/70">{formattedDate}</p>
      </div>

      {(countdown.location_user_a_text || countdown.location_user_b_text) && (
        <div className="relative z-10 flex items-center justify-center gap-4 rounded-2xl bg-white/15 p-4 backdrop-blur-sm">
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              {partnerAName}
            </p>
            <p className="text-sm font-semibold">
              📍 {countdown.location_user_a_text || "-"}
            </p>
          </div>
          <span className="text-lg">💕</span>
          <div className="flex-1 text-center">
            <p className="text-[10px] uppercase tracking-wide text-white/70">
              {partnerBName}
            </p>
            <p className="text-sm font-semibold">
              📍 {countdown.location_user_b_text || "-"}
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 text-center text-[10px] uppercase tracking-widest text-white/60">
        made with duora
      </div>
    </div>
  );
});

CountdownShareCard.displayName = "CountdownShareCard";