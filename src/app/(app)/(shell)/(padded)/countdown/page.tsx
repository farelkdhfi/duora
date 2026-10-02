"use client";

import { useState } from "react";
import { CalendarDays, Lock, Plus, X } from "lucide-react";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useGetMyProfile } from "@/features/profiles/queries";
import { useMySubscription } from "@/features/subscription/queries";
import { CreateCountdownForm } from "@/features/countdown/components/create-countdown-form";
import { CountdownList } from "@/features/countdown/components/countdown-list";
import { useCountdowns } from "@/features/countdown/queries";

export default function CountdownPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const {
        data: relationshipDetails,
        isLoading: isLoadingRelationship,
    } = useMyRelationshipDetails();

    const {
        data: profile,
        isLoading: isLoadingProfile,
    } = useGetMyProfile();

    const { data: subscription } = useMySubscription();

    const relationshipId = relationshipDetails?.relationship.id;

    const { data: countdowns } = useCountdowns(relationshipId);

    const isLoading = isLoadingRelationship || isLoadingProfile;

    if (isLoading) {
        return (
            <main className="min-h-[100svh] bg-[#fafaf9]">
                <div className="flex min-h-[100svh] items-center justify-center px-6">
                    <div className="w-full max-w-5xl animate-pulse">
                        <div className="mx-auto max-w-4xl space-y-8">
                            <div className="space-y-4 text-center">
                                <div className="mx-auto h-3 w-24 rounded-full bg-neutral-200" />
                                <div className="mx-auto h-14 w-72 rounded-2xl bg-neutral-200" />
                                <div className="mx-auto h-4 w-80 max-w-full rounded-full bg-neutral-100" />
                            </div>

                            <div className="h-[60svh] rounded-[2.5rem] border border-neutral-200 bg-white" />

                            <div className="mx-auto h-12 w-64 rounded-full bg-neutral-100" />
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    if (!relationshipDetails || !profile) {
        return (
            <main className="flex min-h-[100svh] items-center justify-center bg-[#fafaf9] px-6">
                <div className="max-w-sm text-center">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-[1.5rem] border border-neutral-200 bg-white shadow-sm">
                        <CalendarDays
                            size={21}
                            strokeWidth={1.7}
                            className="text-neutral-500"
                        />
                    </div>

                    <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                        Duora Countdown
                    </p>

                    <h2 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-neutral-800">
                        Belum terhubung
                    </h2>

                    <p className="mt-3 text-sm leading-6 text-neutral-400">
                        Hubungkan akunmu dengan pasangan terlebih dahulu
                        untuk membuat countdown bersama.
                    </p>
                </div>
            </main>
        );
    }

    const { relationship, members } = relationshipDetails;

    const activeCountdownsCount =
        countdowns?.filter((c) => !c.is_completed).length ?? 0;

    const maxActiveCountdowns = subscription
        ? subscription.max_active_countdowns
        : 1;

    const isLimitReached =
        maxActiveCountdowns !== null &&
        activeCountdownsCount >= maxActiveCountdowns;

    const handleCreate = () => {
        if (isLimitReached) {
            alert("Upgrade ke Premium untuk countdown lebih banyak!");
            return;
        }

        setIsFormOpen(true);
    };

    return (
        <main className="relative min-h-[100svh] overflow-hidden bg-[#fafaf9]">
            {/* Ambient background */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -left-32 -top-32 size-96 rounded-full bg-pink-100/30 blur-[100px]" />
                <div className="absolute -right-32 top-20 size-[28rem] rounded-full bg-blue-100/30 blur-[110px]" />
                <div className="absolute bottom-[-10rem] left-1/2 size-[30rem] -translate-x-1/2 rounded-full bg-purple-100/20 blur-[120px]" />
            </div>

            {/* Top minimal navigation */}
            <div className="relative z-10 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-7">
                <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-300">
                        Duora
                    </p>

                    <h1 className="mt-1 text-sm font-semibold tracking-[-0.025em] text-neutral-700 sm:text-base">
                        Countdown
                    </h1>
                </div>

                {activeCountdownsCount > 0 && (
                    <div className="rounded-full border border-neutral-200/80 bg-white/70 px-3 py-1.5 text-[10px] font-medium text-neutral-400 shadow-sm backdrop-blur">
                        {activeCountdownsCount} aktif
                    </div>
                )}
            </div>

            <div className="relative z-10 flex min-h-[calc(100svh-84px)] flex-col">
                <CountdownList
                    relationshipId={relationship.id}
                    members={members}
                    currentUserId={profile.id}
                    onCreate={handleCreate}
                    isLimitReached={isLimitReached}
                />
            </div>

            {/* Create form */}
            {isFormOpen && !isLimitReached && (
                <div className="fixed inset-0 z-[100] flex items-end justify-center bg-neutral-900/20 p-0 backdrop-blur-[6px] sm:items-center sm:p-6">
                    <div className="flex max-h-[95svh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-neutral-200 bg-white shadow-[0_30px_100px_-30px_rgba(0,0,0,0.3)] sm:max-h-[90svh] sm:rounded-[2rem]">
                        <div className="flex shrink-0 items-center justify-between border-b border-neutral-100 px-5 py-5 sm:px-7">
                            <div>
                                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-300">
                                    New moment
                                </p>

                                <h2 className="mt-1 text-base font-semibold tracking-[-0.03em] text-neutral-800 sm:text-lg">
                                    Buat countdown baru
                                </h2>
                            </div>

                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="flex size-9 items-center justify-center rounded-xl bg-neutral-50 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700"
                                aria-label="Tutup"
                            >
                                <X size={16} strokeWidth={2} />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-5 sm:p-7">
                            <CreateCountdownForm
                                relationshipId={relationship.id}
                                members={members}
                                onSuccess={() => setIsFormOpen(false)}
                                onClose={() => setIsFormOpen(false)}
                                open={isFormOpen}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Limit state */}
            {isLimitReached && (
                <div className="pointer-events-none fixed bottom-24 left-1/2 z-30 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:bottom-8">
                    <div className="pointer-events-auto flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white/95 p-3 shadow-[0_20px_60px_-25px_rgba(0,0,0,0.3)] backdrop-blur-xl">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                            <Lock
                                size={15}
                                strokeWidth={2}
                                className="text-neutral-500"
                            />
                        </div>

                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-semibold text-neutral-700">
                                Batas countdown tercapai
                            </p>

                            <p className="mt-0.5 truncate text-[10px] text-neutral-400">
                                Maksimal {maxActiveCountdowns} countdown aktif.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                alert(
                                    "Upgrade ke Premium untuk countdown lebih banyak!"
                                )
                            }
                            className="shrink-0 rounded-xl bg-neutral-900 px-3 py-2 text-[10px] font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.97]"
                        >
                            Premium
                        </button>
                    </div>
                </div>
            )}
        </main>
    );
}