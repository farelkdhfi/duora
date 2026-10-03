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
  ArrowRight,
  HeartPlus,
  Loader2,
} from "lucide-react";
import {
  useMySubscription,
  useStartTrialManual,
} from "@/features/subscription/queries";
import { UpgradeModal } from "@/features/subscription/components/upgrade-modal";
import {
  isPremium,
  isOnTrial,
  isNearingExpiry,
  getDaysUntilExpiry,
} from "@/features/subscription/utils";

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

  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [trialSuccess, setTrialSuccess] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf9]">
        <div className="flex items-center gap-2 text-sm text-neutral-400">
          <Loader2 size={15} className="animate-spin" />
          Memuat langganan...
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center bg-[#fafaf9] px-5">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex size-12 items-center justify-center rounded-full border border-black/[0.07] bg-white shadow-sm">
            <HeartPlus size={18} className="text-pink-400" />
          </div>
          <h2 className="mt-5 text-lg font-semibold tracking-[-0.03em] text-[#111111]">
            Belum terhubung
          </h2>
          <p className="mt-2 text-sm leading-6 text-neutral-400">
            Kamu belum terhubung dengan pasangan. Hubungkan relationship kamu
            terlebih dahulu untuk mengelola langganan Duora.
          </p>
        </div>
      </div>
    );
  }

  const premium = isPremium(subscription);
  const trial = isOnTrial(subscription);
  const nearingExpiry = isNearingExpiry(subscription);
  const daysLeft = getDaysUntilExpiry(subscription);

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
      value:
        subscription.max_debate_messages_per_room === null
          ? "Unlimited"
          : `${subscription.max_debate_messages_per_room} pesan / room`,
    },
    {
      icon: CalendarDays,
      label: "Countdown Aktif",
      value:
        subscription.max_active_countdowns === null
          ? "Unlimited"
          : `${subscription.max_active_countdowns} countdown`,
    },
    {
      icon: Smile,
      label: "Mood Check-in",
      value:
        subscription.max_mood_edits_per_day === null
          ? "Unlimited"
          : `${subscription.max_mood_edits_per_day}x ganti / hari`,
    },
    {
      icon: Palette,
      label: "Template Share Card",
      value: subscription.can_customize_share_template
        ? "Semua + custom"
        : "2 template gratis",
    },
  ];

  return (
    <>
      <main className="min-h-screen bg-[#fafaf9]">
        <div className="relative mx-auto max-w-5xl overflow-hidden">
          <div className="relative">
            {/* HEADER */}

            <header className="mb-8 sm:mb-10 lg:mb-12">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-[9px] font-medium uppercase tracking-[0.22em] text-neutral-400">
                  Duora+
                </p>

                <span className="rounded-full border border-pink-200/70 bg-pink-50 px-2 py-1 text-[8px] font-medium uppercase tracking-[0.12em] text-pink-400">
                  Private for two
                </span>
              </div>

              <div className="mt-4 flex flex-col justify-between gap-5 md:flex-row md:items-end">
                <div>
                  <h1 className="max-w-xl text-[2.35rem] font-semibold leading-[0.95] tracking-[-0.065em] text-[#111111] sm:text-4xl md:text-5xl lg:text-[3.6rem]">
                    Your space
                    <br />
                    <span className="text-neutral-300">for more together.</span>
                  </h1>

                  <p className="mt-4 max-w-md text-[13px] leading-6 text-neutral-500 sm:text-sm">
                    Kelola paket Duora, lihat batas fitur, dan nikmati lebih
                    banyak ruang untuk relationship kalian.
                  </p>
                </div>

                <div className="hidden shrink-0 items-center gap-2 text-[9px] uppercase tracking-[0.16em] text-neutral-300 md:flex">
                  <span className="size-1 rounded-full bg-pink-300" />
                  Subscription
                </div>
              </div>
            </header>

            {/* CURRENT PLAN */}

            <section
              className={`relative mb-5 overflow-hidden rounded-[1.75rem] border p-5 shadow-[0_20px_70px_rgba(0,0,0,0.04)] sm:p-7 lg:rounded-[2rem] lg:p-8 ${
                nearingExpiry
                  ? "border-amber-200/80 bg-amber-50"
                  : premium
                  ? "border-black/[0.06] bg-[#171717] text-white"
                  : "border-black/[0.07] bg-white"
              }`}
            >
              {premium && !nearingExpiry && (
                <>
                  <div className="pointer-events-none absolute right-[-100px] top-[-150px] size-[330px] rounded-full bg-pink-400/15 blur-[100px]" />
                  <div className="pointer-events-none absolute bottom-[-160px] left-[-120px] size-[320px] rounded-full bg-blue-400/10 blur-[100px]" />
                </>
              )}

              {nearingExpiry && (
                <div className="pointer-events-none absolute right-[-100px] top-[-120px] size-[300px] rounded-full bg-amber-200/40 blur-[100px]" />
              )}

              <div className="relative">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className={`text-[9px] font-medium uppercase tracking-[0.2em] ${nearingExpiry ? "text-amber-500" : premium ? "text-white/40" : "text-neutral-400"}`}>
                      Plan saat ini
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className={`flex size-10 items-center justify-center rounded-full border ${nearingExpiry ? "border-amber-200 bg-amber-100 text-amber-500" : premium ? "border-white/10 bg-white/[0.06] text-pink-200" : "border-black/[0.06] bg-neutral-50 text-neutral-400"}`}>
                        {nearingExpiry ? (
                          <AlertTriangle size={17} />
                        ) : trial ? (
                          <Sparkles size={17} />
                        ) : premium ? (
                          <Crown size={17} />
                        ) : (
                          <Sparkles size={17} />
                        )}
                      </div>

                      <h2 className={`text-2xl font-semibold tracking-[-0.05em] sm:text-3xl ${nearingExpiry ? "text-amber-700" : premium ? "text-white" : "text-[#111111]"}`}>
                        {trial ? "Trial Premium" : premium ? "Premium" : "Free"}
                      </h2>
                    </div>
                  </div>

                  {trial && (
                    <span className={`rounded-full px-3 py-1.5 text-[8px] font-medium uppercase tracking-[0.12em] ${nearingExpiry ? "bg-amber-200 text-amber-700" : "border border-white/10 bg-white/[0.07] text-pink-100"}`}>
                      Trial
                    </span>
                  )}
                </div>

                {(trial || (premium && subscription.current_period_end)) && (
                  <div className={`mt-6 flex items-start gap-2.5 border-t pt-5 text-sm ${nearingExpiry ? "border-amber-200/70 text-amber-700" : premium ? "border-white/[0.08] text-white/60" : "border-black/[0.06] text-neutral-500"}`}>
                    <Clock size={15} className="mt-0.5 shrink-0" />
                    {nearingExpiry ? (
                      <span className="font-medium">
                        Berakhir{" "}
                        {daysLeft === 0 ? "hari ini" : `dalam ${daysLeft} hari`}
                        <span className="font-normal opacity-70">
                          {" "}
                          · {formatDate(expiryDate)}
                        </span>
                      </span>
                    ) : (
                      <span>
                        Berakhir pada{" "}
                        <span className={premium ? "text-white/80" : "text-neutral-700"}>
                          {formatDate(expiryDate)}
                        </span>
                      </span>
                    )}
                  </div>
                )}

                {!premium && (
                  <p className="mt-5 max-w-lg text-sm leading-6 text-neutral-500">
                    Kamu sedang menggunakan paket gratis. Upgrade kapan saja
                    untuk mendapatkan lebih banyak ruang dan akses premium.
                  </p>
                )}
              </div>
            </section>

            {/* FEATURE LIMITS */}

            <section className="mb-5 overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.035)] lg:rounded-[2rem]">
              <div className="border-b border-black/[0.06] px-5 py-5 sm:px-7 sm:py-6 lg:px-8">
                <div className="flex items-end justify-between gap-4">
                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                      Current access
                    </p>
                    <h3 className="mt-2 text-lg font-semibold tracking-[-0.04em] text-[#111111] sm:text-xl">
                      Batas fitur kamu
                    </h3>
                  </div>

                  <span className="hidden text-[9px] uppercase tracking-[0.14em] text-neutral-300 sm:block">
                    {premium ? "Premium access" : "Free access"}
                  </span>
                </div>
              </div>

              <div className="divide-y divide-black/[0.05]">
                {limitItems.map((item) => {
                  const Icon = item.icon;
                  const unlimited =
                    item.value === "Unlimited" ||
                    item.value.includes("Semua");

                  return (
                    <div key={item.label} className="flex items-center justify-between gap-4 px-5 py-4.5 sm:px-7 sm:py-5 lg:px-8">
                      <div className="flex min-w-0 items-center gap-3.5">
                        <div className="flex size-9 shrink-0 items-center justify-center rounded-full border border-black/[0.06] bg-neutral-50">
                          <Icon size={15} className="text-neutral-400" />
                        </div>

                        <span className="truncate text-sm font-medium text-neutral-700">
                          {item.label}
                        </span>
                      </div>

                      <span className={`shrink-0 text-right text-[11px] font-medium ${unlimited ? "text-pink-500" : "text-neutral-400"}`}>
                        {item.value}
                      </span>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* TRIAL */}

            <section className="mb-5 overflow-hidden rounded-[1.75rem] border border-black/[0.07] bg-white shadow-[0_20px_70px_rgba(0,0,0,0.035)] lg:rounded-[2rem]">
              <div className="flex flex-col gap-6 p-5 sm:p-7 md:flex-row md:items-center md:justify-between lg:p-8">
                <div className="flex items-start gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-full border border-pink-200/70 bg-pink-50 text-pink-400">
                    {subscription.has_used_trial ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <Sparkles size={17} />
                    )}
                  </div>

                  <div>
                    <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                      Free experience
                    </p>

                    <h3 className="mt-2 text-base font-semibold tracking-[-0.03em] text-[#111111] sm:text-lg">
                      {subscription.has_used_trial
                        ? "Trial sudah digunakan"
                        : "Coba Duora+ gratis"}
                    </h3>

                    <p className="mt-1.5 max-w-md text-sm leading-5 text-neutral-400">
                      {subscription.has_used_trial
                        ? "Kamu sudah pernah menggunakan trial premium 3 hari."
                        : "Nikmati akses penuh premium selama 3 hari tanpa biaya."}
                    </p>
                  </div>
                </div>

                {!subscription.has_used_trial && !trialSuccess && (
                  <button
                    onClick={handleStartTrial}
                    disabled={isTrialPending}
                    className="group flex shrink-0 items-center justify-center gap-2 rounded-full border border-black/[0.08] bg-white px-5 py-2.5 text-sm font-medium text-[#111111] shadow-sm transition hover:-translate-y-0.5 hover:border-black/[0.14] hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isTrialPending ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Mengaktifkan...
                      </>
                    ) : (
                      <>
                        Mulai trial
                        <ArrowRight size={14} className="transition group-hover:translate-x-0.5" />
                      </>
                    )}
                  </button>
                )}

                {trialSuccess && (
                  <div className="flex shrink-0 items-center gap-2 text-sm font-medium text-emerald-600">
                    <CheckCircle2 size={16} />
                    Trial aktif!
                  </div>
                )}
              </div>

              {trialError && (
                <div className="border-t border-black/[0.06] px-5 py-3 sm:px-7 lg:px-8">
                  <p className="text-xs text-rose-500">{trialError.message}</p>
                </div>
              )}
            </section>

            {/* UPGRADE CTA */}

            {(!premium || nearingExpiry) && (
              <section className="relative overflow-hidden rounded-[1.75rem] bg-[#171717] text-white shadow-[0_25px_80px_rgba(0,0,0,0.12)] lg:rounded-[2rem]">
                <div className="pointer-events-none absolute right-[-120px] top-[-160px] size-[360px] rounded-full bg-pink-400/15 blur-[100px]" />
                <div className="pointer-events-none absolute bottom-[-180px] left-[-100px] size-[340px] rounded-full bg-blue-400/10 blur-[100px]" />

                <div className="relative flex flex-col gap-7 p-6 sm:p-8 md:flex-row md:items-end md:justify-between lg:p-9">
                  <div className="max-w-lg">
                    <div className="flex items-center gap-2">
                      <div className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-white/[0.05]">
                        <Crown size={14} className="text-pink-200" />
                      </div>

                      <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-white/40">
                        Duora+
                      </p>
                    </div>

                    <h3 className="mt-4 text-2xl font-semibold leading-tight tracking-[-0.05em] sm:text-3xl">
                      {nearingExpiry
                        ? "Keep your premium moments going."
                        : "Make more memories together."}
                    </h3>

                    <p className="mt-3 max-w-md text-sm leading-6 text-white/45">
                      Dapatkan lebih banyak ruang untuk percakapan, check-in,
                      countdown, dan momen yang ingin kalian simpan bersama.
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[9px] uppercase tracking-[0.13em] text-white/30">
                      <span>Rp 25.999 / month</span>
                      <span className="size-1 rounded-full bg-pink-300/60" />
                      <span>Private for two</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsUpgradeOpen(true)}
                    className="group flex w-full shrink-0 items-center justify-center gap-3 rounded-full bg-white px-6 py-3.5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-neutral-100 sm:w-auto sm:min-w-[190px]"
                  >
                    Lihat Premium
                    <span className="flex size-6 items-center justify-center rounded-full bg-black text-white transition group-hover:translate-x-0.5">
                      <ArrowRight size={12} />
                    </span>
                  </button>
                </div>
              </section>
            )}

            {/* PREMIUM ACTIVE FOOTER */}

            {premium && !nearingExpiry && (
              <div className="mt-7 flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                <p className="text-[9px] leading-4 text-neutral-400">
                  Duora+ gives you more room for the moments that matter.
                </p>

                <div className="flex items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-neutral-300">
                  <span className="size-1 rounded-full bg-pink-300" />
                  Private for two
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {isUpgradeOpen && (
        <UpgradeModal onClose={() => setIsUpgradeOpen(false)} />
      )}
    </>
  );
}