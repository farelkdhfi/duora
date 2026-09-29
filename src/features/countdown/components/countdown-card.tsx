"use client";

import { useEffect, useState } from "react";
import {
    CalendarDays,
    Check,
    MapPin,
    MoreHorizontal,
    Sparkles,
    Trash2,
} from "lucide-react";

import {
    useDeleteCountdown,
    useMarkCountdownCompleted,
} from "../queries";

import { ShareButton } from "./share-button";
import { getMemberName } from "../utils";

import type {
    MeetupCountdown,
    CountdownMember,
} from "../types";

interface CountdownCardProps {
    countdown: MeetupCountdown;
    members: CountdownMember[];
    currentUserId: string;
}

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
    isPast: boolean;
}

function getTimeLeft(targetDateTime: string): TimeLeft {
    const target = new Date(targetDateTime).getTime();
    const now = new Date().getTime();
    const diff = target - now;

    if (diff <= 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            isPast: true,
        };
    }

    const days = Math.floor(
        diff / (1000 * 60 * 60 * 24)
    );

    const hours = Math.floor(
        (diff / (1000 * 60 * 60)) % 24
    );

    const minutes = Math.floor(
        (diff / (1000 * 60)) % 60
    );

    const seconds = Math.floor(
        (diff / 1000) % 60
    );

    return {
        days,
        hours,
        minutes,
        seconds,
        isPast: false,
    };
}

export function CountdownCard({
    countdown,
    members,
    currentUserId,
}: CountdownCardProps) {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>(() =>
        getTimeLeft(countdown.meetup_date)
    );

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const { mutate: deleteCountdown } =
        useDeleteCountdown(countdown.relationship_id);

    const { mutate: markCompleted } =
        useMarkCountdownCompleted();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(
                getTimeLeft(countdown.meetup_date)
            );
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown.meetup_date]);

    const formattedDate = new Date(
        countdown.meetup_date
    ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    const formattedTime = new Date(
        countdown.meetup_date
    ).toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
    });

    const nameA = getMemberName(
        members,
        countdown.location_user_a_id
    );

    const nameB = getMemberName(
        members,
        countdown.location_user_b_id
    );

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
        <article className="relative mx-auto flex h-full min-h-[calc(100svh-180px)] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] border border-neutral-200/80 bg-white shadow-[0_30px_100px_-45px_rgba(0,0,0,0.28)] sm:min-h-[calc(100svh-185px)] sm:rounded-[2.75rem]">
            {/* Ambient gradients */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -right-40 -top-40 size-[30rem] rounded-full bg-blue-100/35 blur-[100px]" />
                <div className="absolute -left-40 bottom-[-8rem] size-[28rem] rounded-full bg-pink-100/35 blur-[100px]" />
                <div className="absolute left-1/2 top-1/2 size-[24rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-50/30 blur-[110px]" />
            </div>

            {/* Top bar */}
            <div className="relative z-10 flex items-start justify-between px-5 py-5 sm:px-8 sm:py-7">
                <div className="min-w-0 max-w-[70%]">
                    <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                        Your next moment
                    </p>

                    <h2 className="mt-2 truncate text-lg font-semibold tracking-[-0.04em] text-neutral-800 sm:text-xl">
                        {countdown.title}
                    </h2>

                    {countdown.location && (
                        <div className="mt-1.5 flex items-center gap-1.5 text-[11px] text-neutral-400">
                            <MapPin
                                size={11}
                                strokeWidth={1.8}
                            />

                            <span className="truncate">
                                {countdown.location}
                            </span>
                        </div>
                    )}
                </div>

                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            setIsMenuOpen((prev) => !prev)
                        }
                        className="flex size-9 items-center justify-center rounded-full border border-neutral-200 bg-white/80 text-neutral-400 shadow-sm backdrop-blur transition hover:bg-white hover:text-neutral-700"
                        aria-label="Menu countdown"
                    >
                        <MoreHorizontal
                            size={17}
                            strokeWidth={1.8}
                        />
                    </button>

                    {isMenuOpen && (
                        <div className="absolute right-0 top-11 z-30 w-36 overflow-hidden rounded-2xl border border-neutral-100 bg-white p-1.5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
                            <button
                                type="button"
                                onClick={() => {
                                    deleteCountdown(
                                        countdown.id
                                    );
                                    setIsMenuOpen(false);
                                }}
                                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-500"
                            >
                                <Trash2
                                    size={13}
                                    strokeWidth={2}
                                />

                                Hapus
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content */}
            <div className="relative z-10 flex flex-1 flex-col justify-center px-5 pb-5 sm:px-10 sm:pb-8">
                {countdown.is_completed ? (
                    <div className="mx-auto w-full max-w-2xl text-center">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-emerald-100 bg-emerald-50 shadow-sm">
                            <Check
                                size={29}
                                strokeWidth={1.8}
                                className="text-emerald-500"
                            />
                        </div>

                        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-500/60">
                            Moment completed
                        </p>

                        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-neutral-800 sm:text-5xl">
                            Sudah ketemu
                        </h3>

                        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-neutral-400">
                            Another moment to remember.
                        </p>
                    </div>
                ) : timeLeft.isPast ? (
                    <div className="mx-auto w-full max-w-2xl text-center">
                        <div className="mx-auto flex size-20 items-center justify-center rounded-full border border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50">
                            <Sparkles
                                size={27}
                                strokeWidth={1.7}
                                className="text-pink-500"
                            />
                        </div>

                        <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-pink-400/70">
                            The moment is here
                        </p>

                        <h3 className="mt-2 text-3xl font-semibold tracking-[-0.06em] text-neutral-800 sm:text-5xl">
                            Hari yang ditunggu tiba
                        </h3>

                        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-neutral-400">
                            Saatnya menandai momen ini.
                        </p>

                        <button
                            type="button"
                            onClick={() =>
                                markCompleted(countdown.id)
                            }
                            className="mt-7 rounded-full bg-neutral-900 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-neutral-900/10 transition hover:bg-neutral-800 active:scale-[0.98]"
                        >
                            Tandai Sudah Ketemu
                        </button>
                    </div>
                ) : (
                    <div className="mx-auto w-full max-w-3xl">
                        <div className="text-center">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                                Counting down to
                            </p>

                            <div className="mt-8 grid grid-cols-4 gap-2 sm:gap-5">
                                {timeItems.map((item) => (
                                    <div
                                        key={item.label}
                                        className="relative flex flex-col items-center"
                                    >
                                        <p className="font-mono text-[clamp(2.5rem,9vw,6.5rem)] font-medium leading-none tracking-[-0.09em] text-neutral-800">
                                            {item.value
                                                .toString()
                                                .padStart(
                                                    2,
                                                    "0"
                                                )}
                                        </p>

                                        <p className="mt-3 text-[8px] font-semibold uppercase tracking-[0.18em] text-neutral-300 sm:text-[9px]">
                                            {item.label}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Date */}
                        <div className="mx-auto mt-10 flex w-fit items-center gap-2 rounded-full border border-neutral-200 bg-white/80 px-4 py-2.5 shadow-sm backdrop-blur">
                            <CalendarDays
                                size={13}
                                strokeWidth={1.8}
                                className="text-neutral-400"
                            />

                            <span className="text-[10px] font-medium text-neutral-500 sm:text-[11px]">
                                {formattedDate}
                            </span>

                            <span className="text-neutral-200">
                                •
                            </span>

                            <span className="text-[10px] font-medium text-neutral-500 sm:text-[11px]">
                                {formattedTime}
                            </span>
                        </div>
                    </div>
                )}

                {/* Description */}
                {countdown.description && (
                    <div className="mx-auto mt-8 max-w-xl border-l border-neutral-200 pl-3">
                        <p className="text-center text-[11px] leading-5 text-neutral-400 sm:text-xs">
                            {countdown.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Bottom meta */}
            <div className="relative z-10 flex shrink-0 items-center justify-between border-t border-neutral-100/80 px-5 py-4 sm:px-8 sm:py-5">
                <div className="min-w-0">
                    <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                        Together
                    </p>

                    <p className="mt-1 truncate text-[10px] text-neutral-400 sm:text-[11px]">
                        {nameA}{" "}
                        <span className="mx-1 text-neutral-200">
                            ×
                        </span>{" "}
                        {nameB}
                    </p>
                </div>

                <ShareButton
                    countdown={countdown}
                    relationshipId={
                        countdown.relationship_id
                    }
                    timeLeft={timeLeft}
                    partnerAName={nameA}
                    partnerBName={nameB}
                />
            </div>
        </article>
    );
}