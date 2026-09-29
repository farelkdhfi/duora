"use client";

import { useEffect, useRef, useState } from "react";
import {
    ChevronLeft,
    ChevronRight,
    Plus,
    Sparkles,
} from "lucide-react";

import { useCountdowns } from "../queries";
import { CountdownCard } from "./countdown-card";

import type { CountdownMember } from "../types";

interface CountdownListProps {
    relationshipId: string;
    members: CountdownMember[];
    currentUserId: string;
    onCreate?: () => void;
    isLimitReached?: boolean;
}

export function CountdownList({
    relationshipId,
    members,
    currentUserId,
    onCreate,
    isLimitReached = false,
}: CountdownListProps) {
    const { data: countdowns, isLoading, error } =
        useCountdowns(relationshipId);

    const scrollRef = useRef<HTMLDivElement>(null);

    const [activeIndex, setActiveIndex] = useState(0);

    const scrollToIndex = (index: number) => {
        if (!scrollRef.current || !countdowns?.length) return;

        const nextIndex = Math.max(
            0,
            Math.min(index, countdowns.length - 1)
        );

        const container = scrollRef.current;

        container.scrollTo({
            left: container.clientWidth * nextIndex,
            behavior: "smooth",
        });

        setActiveIndex(nextIndex);
    };

    useEffect(() => {
        const container = scrollRef.current;

        if (!container) return;

        const handleScroll = () => {
            const index = Math.round(
                container.scrollLeft / container.clientWidth
            );

            setActiveIndex(index);
        };

        container.addEventListener("scroll", handleScroll, {
            passive: true,
        });

        return () => {
            container.removeEventListener("scroll", handleScroll);
        };
    }, [countdowns?.length]);

    if (isLoading) {
        return (
            <div className="flex flex-1 items-center justify-center px-5 pb-10">
                <div className="w-full max-w-5xl animate-pulse">
                    <div className="mx-auto h-[60svh] w-full max-w-4xl rounded-[2.5rem] border border-neutral-200 bg-white" />

                    <div className="mx-auto mt-7 h-12 w-64 rounded-full bg-neutral-100" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-1 items-center justify-center px-6">
                <div className="text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-white shadow-sm">
                        <Sparkles
                            size={18}
                            strokeWidth={1.8}
                            className="text-neutral-400"
                        />
                    </div>

                    <p className="mt-4 text-sm font-medium text-neutral-600">
                        Gagal memuat countdown
                    </p>

                    <p className="mt-1 text-xs text-neutral-400">
                        Coba refresh halaman dan ulangi lagi.
                    </p>
                </div>
            </div>
        );
    }

    if (!countdowns || countdowns.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center px-6 pb-12">
                <div className="w-full max-w-md text-center">
                    <div className="relative mx-auto flex size-20 items-center justify-center rounded-[2rem] border border-neutral-200 bg-white shadow-[0_20px_60px_-30px_rgba(0,0,0,0.2)]">
                        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-pink-50 via-white to-blue-50" />

                        <Sparkles
                            size={23}
                            strokeWidth={1.5}
                            className="relative text-neutral-400"
                        />
                    </div>

                    <p className="mt-7 text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                        Your next moment
                    </p>

                    <h2 className="mt-2 text-2xl font-semibold tracking-[-0.05em] text-neutral-800">
                        Belum ada countdown
                    </h2>

                    <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-neutral-400">
                        Buat countdown untuk momen yang sedang kalian
                        tunggu bersama.
                    </p>

                    <button
                        type="button"
                        onClick={onCreate}
                        disabled={isLimitReached}
                        className="mt-7 inline-flex items-center gap-2 rounded-full bg-neutral-900 px-5 py-3 text-xs font-semibold text-white shadow-lg shadow-neutral-900/10 transition hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        <Plus size={14} strokeWidth={2.2} />
                        Buat Countdown
                    </button>
                </div>
            </div>
        );
    }

    const canGoPrevious = activeIndex > 0;
    const canGoNext = activeIndex < countdowns.length - 1;

    return (
        <div className="flex min-h-0 flex-1 flex-col">
            {/* Countdown slider */}
            <div
                ref={scrollRef}
                className="no-scrollbar flex min-h-0 flex-1 snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-smooth"
            >
                {countdowns.map((countdown) => (
                    <div
                        key={countdown.id}
                        className="w-full shrink-0 snap-center px-4 pb-4 sm:px-8"
                    >
                        <CountdownCard
                            countdown={countdown}
                            members={members}
                            currentUserId={currentUserId}
                        />
                    </div>
                ))}
            </div>

            {/* Bottom navigation */}
            <div className="relative z-20 shrink-0 px-4 pb-5 pt-2 sm:px-8 sm:pb-7">
                <div className="mx-auto flex w-full max-w-xl items-center justify-center gap-2">
                    {/* Previous */}
                    <button
                        type="button"
                        onClick={() =>
                            scrollToIndex(activeIndex - 1)
                        }
                        disabled={!canGoPrevious}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-600 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:bg-white active:scale-[0.96] disabled:pointer-events-none disabled:opacity-30"
                        aria-label="Countdown sebelumnya"
                    >
                        <ChevronLeft
                            size={17}
                            strokeWidth={1.8}
                        />
                    </button>

                    {/* Indicator */}
                    <div className="flex h-11 min-w-24 items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white/90 px-4 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl">
                        {countdowns.map((countdown, index) => (
                            <button
                                key={countdown.id}
                                type="button"
                                onClick={() =>
                                    scrollToIndex(index)
                                }
                                aria-label={`Countdown ${index + 1}`}
                                className={`h-1.5 rounded-full transition-all duration-300 ${
                                    index === activeIndex
                                        ? "w-5 bg-neutral-800"
                                        : "w-1.5 bg-neutral-200"
                                }`}
                            />
                        ))}
                    </div>

                    {/* Next */}
                    <button
                        type="button"
                        onClick={() =>
                            scrollToIndex(activeIndex + 1)
                        }
                        disabled={!canGoNext}
                        className="flex size-11 shrink-0 items-center justify-center rounded-full border border-neutral-200 bg-white/90 text-neutral-600 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.25)] backdrop-blur-xl transition hover:bg-white active:scale-[0.96] disabled:pointer-events-none disabled:opacity-30"
                        aria-label="Countdown berikutnya"
                    >
                        <ChevronRight
                            size={17}
                            strokeWidth={1.8}
                        />
                    </button>

                    {/* Create */}
                    <button
                        type="button"
                        onClick={onCreate}
                        disabled={isLimitReached}
                        className="flex h-11 shrink-0 items-center gap-2 rounded-full bg-neutral-900 px-4 text-[11px] font-semibold text-white shadow-[0_12px_30px_-12px_rgba(0,0,0,0.35)] transition hover:bg-neutral-800 active:scale-[0.97] disabled:cursor-not-allowed disabled:bg-neutral-300"
                    >
                        <Plus
                            size={14}
                            strokeWidth={2.2}
                        />

                        <span className="hidden sm:inline">
                            Buat
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
}