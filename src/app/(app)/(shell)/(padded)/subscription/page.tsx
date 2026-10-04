"use client";

import { useState } from "react";
import {
  Crown,
  Sparkles,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  CalendarDays,
  Smile,
  Palette,
  ArrowUpRight,
  HeartPlus,
  Loader2,
} from "lucide-react";
import {
  useMySubscription,
  useStartTrialManual,
} from "@/features/subscription/queries";

import {
  getActivePlanType,
  isOnTrial,
  isNearingExpiry,
  getDaysUntilExpiry,
} from "@/features/subscription/utils";
import Header from "@/components/layout/header";
import Link from "next/link";

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";

  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function SubscriptionPage() {
  const { data: subscription, isLoading } = useMySubscription();

  const {
    mutate: startTrial,
    isPending: isTrialPending,
    error: trialError,
  } = useStartTrialManual();

  const [trialSuccess, setTrialSuccess] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-2 text-xs text-neutral-400">
          <Loader2 size={14} className="animate-spin" />
          Memuat langganan...
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf9] px-5">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-11 items-center justify-center rounded-full border border-black/[0.06] bg-white">
            <HeartPlus size={17} className="text-pink-400" />
          </div>

          <h2 className="mt-5 text-lg font-semibold tracking-[-0.04em] text-[#171717]">
            Belum terhubung
          </h2>

          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Hubungkan relationship kamu terlebih dahulu untuk mengelola
            langganan Duora.
          </p>
        </div>
      </div>
    );
  }

  const planType = getActivePlanType(subscription);
  const trial = isOnTrial(subscription);
  const nearingExpiry = isNearingExpiry(subscription);
  const daysLeft = getDaysUntilExpiry(subscription);

  const isFree = planType === "free";
  const isPlus = planType === "plus";
  const isPro = planType === "pro";
  const isPaid = isPlus || isPro;

  const expiryDate = trial
    ? subscription.trial_ends_at
    : subscription.current_period_end;

  function handleStartTrial() {
    startTrial(undefined, {
      onSuccess: () => setTrialSuccess(true),
    });
  }

  const limitItems = [
    {
      icon: MessageSquare,
      label: "AI Debate",
      value: isPro
        ? "Unlimited"
        : isPlus
          ? "10 pesan / room"
          : "3 pesan / room",
    },
    {
      icon: CalendarDays,
      label: "Debate room",
      value: isPro
        ? "Unlimited / bulan"
        : isPlus
          ? "10 room / bulan"
          : "3 room / bulan",
    },
    {
      icon: CalendarDays,
      label: "Countdown aktif",
      value: isPro
        ? "Unlimited"
        : isPlus
          ? "3 countdown"
          : "1 countdown",
    },
    {
      icon: Smile,
      label: "Mood check-in",
      value: isPro
        ? "Unlimited"
        : isPlus
          ? "10x / hari"
          : "3x / hari",
    },
    {
      icon: Palette,
      label: "Share card",
      value: isPro
        ? "Semua + custom"
        : isPlus
          ? "5 template + custom"
          : "2 template gratis",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#fafaf9]">
        <div className="mx-auto">
          {/* HEADER */}
          <Header
            title="Subscription"
            description="Kelola akses Duora dan lihat ruang yang tersedia untuk relationship kalian."
          />

          {/* CURRENT PLAN */}
          <section className="my-10">
            <div
              className={`relative overflow-hidden rounded-[1.75rem] border p-6 sm:p-8 ${
                nearingExpiry
                  ? "border-amber-200/80 bg-[#fffaf0]"
                  : isPaid
                    ? "border-white/10 bg-[#171717] text-white"
                    : "border-black/[0.06] bg-white"
              }`}
            >
              {isPaid && !nearingExpiry && (
                <>
                  <div className="pointer-events-none absolute -right-24 -top-28 size-72 rounded-full bg-pink-400/10 blur-[90px]" />
                  <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-blue-400/10 blur-[100px]" />
                </>
              )}

              {nearingExpiry && (
                <div className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-amber-200/30 blur-[80px]" />
              )}

              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex size-10 items-center justify-center rounded-full border ${
                        nearingExpiry
                          ? "border-amber-200 bg-amber-100 text-amber-500"
                          : isPaid
                            ? "border-white/10 bg-white/[0.06] text-pink-200"
                            : "border-black/[0.06] bg-neutral-50 text-neutral-400"
                      }`}
                    >
                      {nearingExpiry ? (
                        <AlertTriangle size={16} />
                      ) : trial ? (
                        <Sparkles size={16} />
                      ) : isPro ? (
                        <Crown size={16} />
                      ) : isPlus ? (
                        <Sparkles size={16} />
                      ) : (
                        <Sparkles size={16} />
                      )}
                    </div>

                    <div>
                      <h2
                        className={`text-sm font-semibold tracking-[-0.055em] sm:text-3xl ${
                          nearingExpiry
                            ? "text-amber-800"
                            : isPaid
                              ? "text-white"
                              : "text-[#171717]"
                        }`}
                      >
                        {trial
                          ? "Trial Premium"
                          : isPro
                            ? "Pro"
                            : isPlus
                              ? "Plus"
                              : "Free"}
                      </h2>

                      <p
                        className={`mt-1 text-xs ${
                          nearingExpiry
                            ? "text-amber-700/60"
                            : isPaid
                              ? "text-white/40"
                              : "text-neutral-400"
                        }`}
                      >
                        {trial
                          ? "Akses premium kamu sedang aktif."
                          : isPro
                            ? "Akses penuh untuk semua ruang Duora."
                            : isPlus
                              ? "Lebih banyak ruang untuk relationship kalian."
                              : "Ruang dasar untuk tetap connected."}
                      </p>
                    </div>
                  </div>

                  {trial && (
                    <span
                      className={`rounded-full px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.14em] ${
                        nearingExpiry
                          ? "bg-amber-200 text-amber-700"
                          : "border border-white/10 bg-white/[0.06] text-pink-100"
                      }`}
                    >
                      Trial
                    </span>
                  )}
                </div>

                {(trial || (isPaid && subscription.current_period_end)) && (
                  <div
                    className={`mt-8 flex items-center gap-2.5 border-t pt-5 text-xs ${
                      nearingExpiry
                        ? "border-amber-200/70 text-amber-700"
                        : isPaid
                          ? "border-white/[0.08] text-white/45"
                          : "border-black/[0.06] text-neutral-400"
                    }`}
                  >
                    <Clock size={14} />

                    {nearingExpiry ? (
                      <span>
                        <span className="font-medium">
                          {daysLeft === 0
                            ? "Berakhir hari ini"
                            : `Berakhir dalam ${daysLeft} hari`}
                        </span>
                        <span className="ml-1.5 opacity-60">
                          · {formatDate(expiryDate)}
                        </span>
                      </span>
                    ) : (
                      <span>
                        Berakhir pada{" "}
                        <span
                          className={
                            isPaid ? "text-white/70" : "text-neutral-700"
                          }
                        >
                          {formatDate(expiryDate)}
                        </span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ACCESS */}
          <section className="mb-10">
            <div className="mb-3 flex items-end justify-between">
              <div>
                <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                  Current access
                </span>

                <h3 className="mt-2 text-sm font-semibold tracking-[-0.045em] text-[#171717]">
                  Fitur yang kamu punya
                </h3>
              </div>
            </div>

            <div className="overflow-hidden rounded-[1.5rem] border border-black/[0.06] bg-white">
              {limitItems.map((item, index) => {
                const Icon = item.icon;
                const unlimited =
                  item.value === "Unlimited" ||
                  item.value.includes("Semua");

                return (
                  <div
                    key={item.label}
                    className={`flex items-center justify-between gap-5 px-5 py-4.5 sm:px-6 sm:py-5 ${
                      index !== limitItems.length - 1
                        ? "border-b border-black/[0.05]"
                        : ""
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-neutral-50 text-neutral-400">
                        <Icon size={13} />
                      </div>

                      <span className="truncate text-xs font-medium text-neutral-700">
                        {item.label}
                      </span>
                    </div>

                    <span
                      className={`shrink-0 text-right text-[11px] font-medium ${
                        unlimited ? "text-pink-500" : "text-neutral-400"
                      }`}
                    >
                      {item.value}
                    </span>
                  </div>
                );
              })}
            </div>
          </section>

          {/* TRIAL */}
          <section className="mb-10">
            <div className="mb-3">
              <span className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Free experience
              </span>
            </div>

            <div className="rounded-[1.5rem] border border-black/[0.06] bg-white p-5 sm:p-6">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-4">
                  <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-full bg-pink-50 text-pink-400">
                    {subscription.has_used_trial ? (
                      <CheckCircle2 size={15} />
                    ) : (
                      <Sparkles size={15} />
                    )}
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold tracking-[-0.035em] text-[#171717]">
                      {subscription.has_used_trial
                        ? "Trial sudah digunakan"
                        : "Coba Duora+ gratis"}
                    </h3>

                    <p className="mt-1.5 max-w-md text-xs leading-5 text-neutral-400">
                      {subscription.has_used_trial
                        ? "Kamu sudah pernah menggunakan trial premium selama 3 hari."
                        : "Nikmati akses Plus selama 3 hari tanpa biaya."}
                    </p>
                  </div>
                </div>

                {!subscription.has_used_trial && !trialSuccess && (
                  <button
                    onClick={handleStartTrial}
                    disabled={isTrialPending}
                    className="group flex shrink-0 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-medium text-[#171717] transition hover:border-black/[0.15] hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isTrialPending ? (
                      <>
                        <Loader2 size={13} className="animate-spin" />
                        Mengaktifkan...
                      </>
                    ) : (
                      <>
                        Mulai trial
                      </>
                    )}
                  </button>
                )}

                {trialSuccess && (
                  <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-emerald-600">
                    <CheckCircle2 size={15} />
                    Trial aktif
                  </div>
                )}
              </div>

              {trialError && (
                <div className="mt-5 border-t border-black/[0.05] pt-4">
                  <p className="text-xs text-rose-500">
                    {trialError.message}
                  </p>
                </div>
              )}
            </div>
          </section>

          {/* PREMIUM CTA */}
          {(!isPaid || nearingExpiry) && (
            <section className="relative overflow-hidden rounded-[1.75rem] bg-[#171717] text-white">
              <div className="pointer-events-none absolute -right-24 -top-32 size-80 rounded-full bg-pink-400/10 blur-[100px]" />
              <div className="pointer-events-none absolute -bottom-32 -left-20 size-72 rounded-full bg-blue-400/10 blur-[100px]" />

              <div className="relative p-6 sm:p-8 lg:p-9">
                <div className="max-w-xl">
                  <div className="flex items-center gap-2">
                    <Crown size={14} className="text-pink-200" />

                    <span className="text-[9px] font-medium uppercase tracking-[0.22em] text-white/40">
                      Duora plan
                    </span>
                  </div>

                  <h3 className="mt-5 max-w-lg text-lg font-semibold leading-[1.05] tracking-[-0.055em] sm:text-3xl">
                    {nearingExpiry
                      ? "Keep your premium moments going."
                      : "Make more space for your relationship."}
                  </h3>

                  <p className="mt-3 max-w-md text-xs leading-6 text-white/40">
                    Lebih banyak ruang untuk debate, countdown, check-in, dan
                    momen yang ingin kalian simpan bersama.
                  </p>

                  <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
                    <Link
                      href="/subscription/plan"
                      className="group flex items-center justify-center gap-3 rounded-full bg-white px-5 py-3 text-sm font-medium text-[#171717] transition hover:bg-neutral-100"
                    >
                      Lihat Premium
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* FOOTER */}
          {isPaid && !nearingExpiry && (
            <div className="mt-7 flex flex-col gap-2 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
              <p className="text-[9px] text-neutral-400">
                Duora gives you more room for the moments that matter.
              </p>

              <div className="flex items-center justify-center gap-2 text-[8px] uppercase tracking-[0.14em] text-neutral-300">
                <span className="size-1 rounded-full bg-pink-300" />
                Private for two
              </div>
            </div>
          )}
        </div>
      </main>
    </>
  );
}