"use client";

import { useState } from "react";
import { CalendarDays, Lock, X } from "lucide-react";
import { useMyRelationshipDetails } from "@/features/relationship/queries";
import { useGetMyProfile } from "@/features/profiles/queries";
import { useMySubscription } from "@/features/subscription/queries";
import { CountdownList } from "@/features/countdown/components/countdown-list";
import { CreateCountdownForm } from "@/features/countdown/components/create-countdown-form";
import { useCountdowns } from "@/features/countdown/queries";
import Header from "@/components/layout/header";

export default function CountdownPage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const { data: relationshipDetails, isLoading: isLoadingRelationship } = useMyRelationshipDetails();
    const { data: profile, isLoading: isLoadingProfile } = useGetMyProfile();
    const { data: subscription } = useMySubscription();

    const relationshipId = relationshipDetails?.relationship.id;
    const { data: countdowns } = useCountdowns(relationshipId);

    const isLoading = isLoadingRelationship || isLoadingProfile;

    if (isLoading) {
        return (
            <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
                <div className="animate-pulse space-y-8">
                    <div className="space-y-3">
                        <div className="h-3 w-20 rounded-full bg-neutral-100" />
                        <div className="h-9 w-48 rounded-xl bg-neutral-100" />
                        <div className="h-4 w-72 rounded-full bg-neutral-100" />
                    </div>

                    <div className="h-52 rounded-[2rem] border border-neutral-100 bg-white" />

                    <div className="h-40 rounded-[2rem] border border-neutral-100 bg-white" />
                </div>
            </div>
        );
    }

    if (!relationshipDetails || !profile) {
        return (
            <div className="mx-auto flex min-h-[50vh] max-w-5xl items-center justify-center px-4">
                <div className="max-w-sm text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-50 to-pink-50">
                        <CalendarDays size={20} strokeWidth={1.8} className="text-blue-500" />
                    </div>

                    <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                        Belum terhubung
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-neutral-400">
                        Hubungkan akunmu dengan pasangan terlebih dahulu untuk membuat countdown bersama.
                    </p>
                </div>
            </div>
        );
    }

    const { relationship, members } = relationshipDetails;

    const activeCountdownsCount = countdowns?.filter((c) => !c.is_completed).length ?? 0;

    const maxActiveCountdowns = subscription ? subscription.max_active_countdowns : 1;

    const isLimitReached = maxActiveCountdowns !== null && activeCountdownsCount >= maxActiveCountdowns;

    return (
        <main className="">
            <Header
                icon={CalendarDays}
                title="Countdown Ketemu"
                description="Hitung mundur menuju momen yang paling kalian tunggu."
                action={
                    isLimitReached
                        ? undefined
                        : {
                              label: "Buat Countdown",
                              onClick: () => setIsFormOpen((prev) => !prev),
                          }
                }
            />

            <div className="mt-10 space-y-6 sm:mt-12">
                {isLimitReached && (
                    <div className="relative overflow-hidden rounded-[1.75rem] border border-neutral-200/80 bg-white p-5 sm:p-6">
                        <div className="absolute -right-12 -top-12 size-32 rounded-full bg-gradient-to-br from-pink-100/60 to-blue-100/60 blur-2xl" />

                        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-start gap-4">
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-neutral-100">
                                    <Lock size={16} strokeWidth={2} className="text-neutral-500" />
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-neutral-800">
                                        Batas countdown tercapai
                                    </p>

                                    <p className="mt-1 max-w-xl text-[13px] leading-5 text-neutral-400">
                                        Paket kamu saat ini memiliki batas {maxActiveCountdowns} countdown aktif.
                                        Selesaikan countdown yang ada atau upgrade untuk menyimpan lebih banyak momen.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => alert("Upgrade ke Premium untuk countdown lebih banyak!")}
                                className="shrink-0 rounded-xl bg-neutral-900 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-neutral-800 active:scale-[0.98]"
                            >
                                Lihat Premium
                            </button>
                        </div>
                    </div>
                )}

                {isFormOpen && !isLimitReached && (
                    <section className="overflow-hidden rounded-[2rem] border border-neutral-200/70 bg-white">
                        <div className="flex items-center justify-between border-b border-neutral-100 px-5 py-5 sm:px-7">
                            <div>
                                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                                    New countdown
                                </p>

                                <h2 className="mt-1 text-base font-semibold tracking-[-0.025em] text-neutral-800 sm:text-lg">
                                    Buat rencana baru
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

                        <div className="p-5 sm:p-7">
                            <CreateCountdownForm
                                relationshipId={relationship.id}
                                members={members}
                                onSuccess={() => setIsFormOpen(false)}
                                onClose={() => setIsFormOpen(false)}
                                open={isFormOpen}
                            />
                        </div>
                    </section>
                )}

                <section>
                    <div className="mb-5 flex items-end justify-between">
                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-neutral-300">
                                Your moments
                            </p>

                            <h2 className="mt-1 text-lg font-semibold tracking-[-0.03em] text-neutral-800">
                                Countdown kalian
                            </h2>
                        </div>

                        {activeCountdownsCount > 0 && (
                            <span className="rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-medium text-neutral-500">
                                {activeCountdownsCount} aktif
                            </span>
                        )}
                    </div>

                    <CountdownList
                        relationshipId={relationship.id}
                        members={members}
                        currentUserId={profile.id}
                    />
                </section>
            </div>
        </main>
    );
}