"use client";

import { forwardRef } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Plane,
} from "lucide-react";

import type { MeetupCountdown } from "../types";
import { useTemplatePreference } from "@/features/share-template/queries";
import {
  resolveTemplateColors,
  getCustomGradientStyle,
} from "@/features/share-template/utils";
import logoImg from '@/assets/duora-logo3.png'
import Image from "next/image";

interface CountdownShareCardProps {
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

export const CountdownShareCard = forwardRef<
  HTMLDivElement,
  CountdownShareCardProps
>(
  (
    {
      countdown,
      relationshipId,
      timeLeft,
      partnerAName = "A",
      partnerBName = "B",
    },
    ref
  ) => {
    const { data: preference } =
      useTemplatePreference(relationshipId);

    const { gradientClass } =
      resolveTemplateColors(preference ?? null);

    const customStyle =
      getCustomGradientStyle(preference ?? null);

    const meetupDate = new Date(
      countdown.meetup_date
    );

    const formattedDate =
      meetupDate.toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

    const formattedTime =
      meetupDate.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });

    const formattedDay =
      meetupDate.toLocaleDateString("id-ID", {
        weekday: "long",
      });

    const distance =
      countdown.distance_km !== null
        ? Math.round(
          countdown.distance_km
        ).toLocaleString("id-ID")
        : null;

    const locationA =
      countdown.location_user_a_text || "-";

    const locationB =
      countdown.location_user_b_text || "-";

    const hasRoute =
      Boolean(countdown.location_user_a_text) ||
      Boolean(countdown.location_user_b_text);

    const timeItems = [
      {
        label: "Hari",
        value: timeLeft.days,
      },
      {
        label: "Jam",
        value: timeLeft.hours,
      },
      {
        label: "Menit",
        value: timeLeft.minutes,
      },
      {
        label: "Detik",
        value: timeLeft.seconds,
      },
    ];

    return (
      <div
        ref={ref}
        style={customStyle}
        className={`relative flex h-[640px] w-[360px] shrink-0 flex-col overflow-hidden rounded-[32px] p-6 text-neutral-900 ${customStyle
          ? ""
          : `bg-gradient-to-br ${gradientClass}`
          }`}
      >
        {/* Ambient atmosphere */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-28 -top-28 size-[260px] rounded-full bg-white/45 blur-[70px]" />

          <div className="absolute -left-28 bottom-[-80px] size-[260px] rounded-full bg-white/35 blur-[75px]" />

          <div className="absolute left-1/2 top-1/2 size-[220px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/20 blur-[90px]" />
        </div>

        <div className="relative z-10 flex h-full min-h-0 flex-col">
          {/* Header */}
          <header className="flex shrink-0 items-start justify-between">
            <div className="min-w-0 flex-1 pr-4">
              <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Your next moment
              </p>

              <h1 className="mt-2 line-clamp-2 text-[22px] font-semibold leading-[1.08] tracking-[-0.055em] text-neutral-900">
                {countdown.title}
              </h1>

              {countdown.location && (
                <div className="mt-2.5 flex items-center gap-1.5 text-[9px] text-neutral-400">
                  <MapPin
                    size={10}
                    strokeWidth={1.8}
                  />

                  <span className="truncate">
                    {countdown.location}
                  </span>
                </div>
              )}
            </div>

            <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/55 text-neutral-500 shadow-sm backdrop-blur">
              <Image
                src={logoImg}
                width={20}
                height={20}
                alt="logo"
              />
            </div>
          </header>

          {/* Main */}
          <main className="flex min-h-0 flex-1 flex-col justify-center">
            {/* Countdown */}
            <section>
              <p className="text-center text-[8px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                Counting down to
              </p>

              <div className="mt-7 grid grid-cols-4 gap-1">
                {timeItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex min-w-0 flex-col items-center"
                  >
                    <p className="font-mono text-[47px] font-medium leading-none tracking-[-0.09em] text-neutral-900">
                      {item.value
                        .toString()
                        .padStart(2, "0")}
                    </p>

                    <p className="mt-3 text-[7px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </section>

            {/* Date */}
            <div className="mx-auto mt-9 flex w-fit items-center gap-2 rounded-full border border-white/70 bg-white/55 px-4 py-2.5 shadow-sm backdrop-blur">
              <CalendarDays
                size={12}
                strokeWidth={1.8}
                className="text-neutral-400"
              />

              <span className="text-[9px] font-medium text-neutral-500">
                {formattedDay}
              </span>

              <span className="text-neutral-300">
                ·
              </span>

              <span className="text-[9px] font-medium text-neutral-500">
                {formattedDate}
              </span>

              <span className="text-neutral-300">
                ·
              </span>

              <span className="text-[9px] font-medium text-neutral-500">
                {formattedTime}
              </span>
            </div>

            {/* Description */}
            {countdown.description && (
              <div className="mx-auto mt-7 max-w-[270px]">
                <p className="line-clamp-2 text-center text-[9px] leading-4 text-neutral-400">
                  {countdown.description}
                </p>
              </div>
            )}
          </main>

          {/* Bottom */}
          <div className="shrink-0">
            {/* Route */}
            {hasRoute && (
              <section className="rounded-[18px] border border-white/65 bg-white/45 px-4 py-3.5 shadow-sm backdrop-blur">
                <div className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      {partnerAName}
                    </p>

                    <p className="mt-1 truncate text-[9px] font-medium text-neutral-600">
                      {locationA}
                    </p>
                  </div>

                  <div className="flex size-6 shrink-0 items-center justify-center rounded-full border border-white/70 bg-white/55">
                    <ArrowRight
                      size={10}
                      strokeWidth={1.5}
                      className="text-neutral-400"
                    />
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      {partnerBName}
                    </p>

                    <p className="mt-1 truncate text-[9px] font-medium text-neutral-600">
                      {locationB}
                    </p>
                  </div>
                </div>

                {distance && (
                  <div className="mt-2.5 flex items-center justify-between border-t border-neutral-900/5 pt-2.5">
                    <p className="text-[7px] font-semibold uppercase tracking-[0.16em] text-neutral-400">
                      Distance
                    </p>

                    <p className="text-[8px] font-medium text-neutral-500">
                      {distance} km
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Footer */}
            <footer
              className={`flex items-center justify-between ${hasRoute ? "mt-3" : "mt-0"
                }`}
            >
              <div>
                <p className="text-[7px] font-semibold uppercase tracking-[0.2em] text-neutral-400">
                  Together
                </p>

                <p className="mt-1 text-[9px] font-medium text-neutral-500">
                  {partnerAName}
                  <span className="mx-1 text-neutral-300">
                    ×
                  </span>
                  {partnerBName}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                  made with duora
                </span>

                <span className="size-1 rounded-full bg-neutral-300" />
              </div>
            </footer>
          </div>
        </div>
      </div>
    );
  }
);

CountdownShareCard.displayName =
  "CountdownShareCard";