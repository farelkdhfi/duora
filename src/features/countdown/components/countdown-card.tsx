// countdown/components/countdown-card.tsx

"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Check, MapPin, MoreHorizontal, Sparkles, Trash2 } from "lucide-react";
import { useDeleteCountdown, useMarkCountdownCompleted } from "../queries";
import { ShareButton } from "./share-button";
import { getMemberName } from "../utils";

import type { MeetupCountdown, CountdownMember } from "../types";

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
        return { days: 0, hours: 0, minutes: 0, seconds: 0, isPast: true };
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return { days, hours, minutes, seconds, isPast: false };
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

    const { mutate: deleteCountdown } = useDeleteCountdown(
        countdown.relationship_id
    );

    const { mutate: markCompleted } = useMarkCountdownCompleted();

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft(getTimeLeft(countdown.meetup_date));
        }, 1000);

        return () => clearInterval(interval);
    }, [countdown.meetup_date]);

    const formattedDate = new Date(countdown.meetup_date).toLocaleDateString(
        "id-ID",
        {
            day: "numeric",
            month: "long",
            year: "numeric",
        }
    );

    const formattedTime = new Date(countdown.meetup_date).toLocaleTimeString(
        "id-ID",
        {
            hour: "2-digit",
            minute: "2-digit",
        }
    );

    const nameA = getMemberName(members, countdown.location_user_a_id);
    const nameB = getMemberName(members, countdown.location_user_b_id);

    const timeItems = [
        { label: "Hari", value: timeLeft.days },
        { label: "Jam", value: timeLeft.hours },
        { label: "Menit", value: timeLeft.minutes },
        { label: "Detik", value: timeLeft.seconds },
    ];

    return (
        <article className="group relative overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white transition-all duration-300 hover:-translate-y-1 hover:border-neutral-200 hover:shadow-[0_20px_50px_-30px_rgba(0,0,0,0.22)]">
            <div className="absolute -right-20 -top-20 size-48 rounded-full bg-gradient-to-br from-pink-100/50 via-purple-50/30 to-blue-100/50 blur-3xl transition-opacity duration-500 group-hover:opacity-100" />

            <div className="relative p-5 sm:p-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-50 via-white to-blue-50 text-xl shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]">
                            {countdown.cover_emoji}
                        </div>

                        <div className="min-w-0">
                            <h3 className="truncate text-[15px] font-semibold tracking-[-0.025em] text-neutral-800">
                                {countdown.title}
                            </h3>

                            {countdown.location && (
                                <div className="mt-1 flex items-center gap-1.5 text-[11px] text-neutral-400">
                                    <MapPin size={11} strokeWidth={2} />
                                    <span className="truncate">{countdown.location}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="relative">
                        <button
                            type="button"
                            onClick={() => setIsMenuOpen((prev) => !prev)}
                            className="flex size-8 items-center justify-center rounded-xl text-neutral-300 transition hover:bg-neutral-50 hover:text-neutral-600"
                            aria-label="Menu countdown"
                        >
                            <MoreHorizontal size={17} strokeWidth={2} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute right-0 top-10 z-20 w-36 overflow-hidden rounded-xl border border-neutral-100 bg-white p-1.5 shadow-[0_15px_40px_-15px_rgba(0,0,0,0.2)]">
                                <button
                                    type="button"
                                    onClick={() => {
                                        deleteCountdown(countdown.id);
                                        setIsMenuOpen(false);
                                    }}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-neutral-500 transition hover:bg-red-50 hover:text-red-500"
                                >
                                    <Trash2 size={13} strokeWidth={2} />
                                    Hapus
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <div className="mt-5 flex items-center gap-2 text-[11px] text-neutral-400">
                    <CalendarDays size={12} strokeWidth={1.8} />
                    <span>{formattedDate}</span>
                    <span className="text-neutral-200">•</span>
                    <span>{formattedTime}</span>
                </div>

                {countdown.is_completed ? (
                    <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-emerald-100 bg-emerald-50/60 px-5 py-7 text-center">
                        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white text-emerald-500 shadow-sm">
                            <Check size={18} strokeWidth={2.4} />
                        </div>

                        <p className="mt-3 text-sm font-semibold tracking-[-0.02em] text-emerald-700">
                            Sudah ketemu
                        </p>

                        <p className="mt-1 text-[11px] text-emerald-600/70">
                            Another moment to remember.
                        </p>
                    </div>
                ) : timeLeft.isPast ? (
                    <div className="relative mt-6 overflow-hidden rounded-[1.5rem] border border-pink-100 bg-gradient-to-br from-pink-50 to-purple-50 px-5 py-6 text-center">
                        <div className="mx-auto flex size-10 items-center justify-center rounded-full bg-white shadow-sm">
                            <Sparkles size={17} strokeWidth={2} className="text-pink-500" />
                        </div>

                        <p className="mt-3 text-sm font-semibold tracking-[-0.02em] text-neutral-800">
                            Hari yang ditunggu tiba
                        </p>

                        <p className="mt-1 text-[11px] text-neutral-400">
                            Saatnya menandai momen ini.
                        </p>

                        <button
                            type="button"
                            onClick={() => markCompleted(countdown.id)}
                            className="mt-4 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                        >
                            Tandai Sudah Ketemu
                        </button>
                    </div>
                ) : (
                    <div className="mt-5 grid grid-cols-4 overflow-hidden rounded-[1.5rem] border border-neutral-100 bg-neutral-50/70">
                        {timeItems.map((item, index) => (
                            <div
                                key={item.label}
                                className={`relative px-2 py-5 text-center ${
                                    index !== timeItems.length - 1
                                        ? "border-r border-neutral-100"
                                        : ""
                                }`}
                            >
                                <p className="font-mono text-[22px] font-medium tracking-[-0.06em] text-neutral-800 sm:text-2xl">
                                    {item.value.toString().padStart(2, "0")}
                                </p>

                                <p className="mt-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-300">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                )}

                {countdown.description && (
                    <div className="mt-5 border-l-2 border-pink-100 pl-3">
                        <p className="text-[12px] leading-5 text-neutral-400">
                            {countdown.description}
                        </p>
                    </div>
                )}

                <div className="mt-5 flex items-center justify-between border-t border-neutral-100 pt-4">
                    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-300">
                        Together
                    </p>

                    <ShareButton
                        countdown={countdown}
                        relationshipId={countdown.relationship_id}
                        timeLeft={timeLeft}
                        partnerAName={nameA}
                        partnerBName={nameB}
                    />
                </div>
            </div>
        </article>
    );
}