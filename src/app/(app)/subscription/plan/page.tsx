"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Check,
  Crown,
  HeartPlus,
  Loader2,
  Sparkles,
} from "lucide-react";
import {
  useActivatePlanManual,
  useMySubscription,
  useStartTrialManual,
} from "@/features/subscription/queries";
import Image from "next/image";
import logo from "@/assets/logo.png";

const PLANS = [
  {
    id: "free",
    name: "Duora Free",
    shortName: "Free",
    price: "Rp 0",
    oldPrice: null,
    accent: "neutral",
    icon: Sparkles,
    eyebrow: "Start together",
    title: "Everything starts here.",
    description:
      "A simple way to stay connected, share moments, and build your relationship together.",
    features: [
      ["AI Debates", "3 messages"],
      ["Debate Rooms", "Limited"],
      ["Daily Check-in Mood", "3 edits / day"],
      ["Meeting Countdown", "1 active"],
      ["LDR Wrapped", "Basic"],
    ],
  },
  {
    id: "plus",
    name: "Duora Plus",
    shortName: "Plus",
    price: "Rp 17.999",
    oldPrice: "Rp 35.000",
    accent: "pink",
    icon: HeartPlus,
    eyebrow: "For more moments",
    title: "More space for the two of you.",
    description:
      "More room for shared plans, check-ins, countdowns, and memories.",
    features: [
      ["AI Debates", "10 messages / room"],
      ["Debate Rooms", "10 rooms / month"],
      ["Daily Check-in Mood", "10 edits / day"],
      ["Meeting Countdown", "Up to 3 active"],
      ["LDR Wrapped", "Premium templates"],
      ["Share Cards", "All templates"],
    ],
  },
  {
    id: "pro",
    name: "Duora Pro",
    shortName: "Pro",
    price: "Rp 25.999",
    oldPrice: "Rp 50.000",
    accent: "blue",
    icon: Crown,
    eyebrow: "Everything, unlimited",
    title: "More room for everything.",
    description:
      "Unlock the full Duora experience with higher limits and unlimited access.",
    features: [
      ["AI Debates", "Unlimited messages"],
      ["Debate Rooms", "Unlimited"],
      ["Daily Check-in Mood", "Unlimited"],
      ["Meeting Countdown", "Unlimited"],
      ["LDR Wrapped", "Custom templates"],
      ["Share Cards", "All templates"],
    ],
  },
];

export default function SubscriptionPlanPage() {
  const router = useRouter();

  const [activePlan, setActivePlan] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  const { data: subscription } = useMySubscription();

  const {
    mutate: activatePlan,
    isPending: isActivating,
    error: activateError,
  } = useActivatePlanManual();

  const {
    mutate: startTrial,
    isPending: isTrialPending,
    error: trialError,
  } = useStartTrialManual();

  const alreadyUsedTrial = subscription?.has_used_trial ?? false;

  const plan = PLANS[activePlan];
  const Icon = plan.icon;

  function handleActivate(planType: "plus" | "pro") {
    activatePlan(
      {
        planType,
        durationDays: 30,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);

          setTimeout(() => {
            router.push("/subscription");
          }, 1800);
        },
      }
    );
  }

  function handleStartTrial() {
    startTrial(undefined, {
      onSuccess: () => {
        setIsSuccess(true);

        setTimeout(() => {
          router.push("/subscription");
        }, 1800);
      },
    });
  }

  const error = activateError || trialError;

  const isFree = plan.id === "free";
  const isPlus = plan.id === "plus";
  const isPro = plan.id === "pro";

  return (
    <main className="h-dvh overflow-y-auto overflow-x-hidden bg-[#fafaf9]">
      <div className="mx-auto flex min-h-full w-full max-w-[1180px] flex-col px-4 py-4 sm:px-8 sm:py-6 lg:px-10">
        {/* HEADER */}
        <header className="flex shrink-0 items-center justify-between">
          <button
            onClick={() => router.back()}
            className="group flex items-center gap-2 text-xs font-medium text-neutral-800 transition hover:text-[#171717]"
          >
            <span className="flex size-8 items-center justify-center rounded-full border border-black/20 bg-white transition group-hover:border-black/[0.12]">
              <ArrowLeft size={17} />
            </span>

            <span className=" sm:inline">Kembali</span>
          </button>

          <div className="flex items-center">
            <Image src={logo} alt="Duora" className="size-5" />

            <span className="text-base font-bold text-[#171717]">
              Duora
            </span>
          </div>
        </header>

        {/* MAIN */}
        <section className="relative flex flex-1 items-center justify-center py-5 sm:py-7 lg:py-8">
          {/* AMBIENT */}
          <div className="pointer-events-none absolute left-[8%] top-[8%] size-[260px] rounded-full bg-pink-200/25 blur-[110px]" />

          <div className="pointer-events-none absolute bottom-[5%] right-[5%] size-[300px] rounded-full bg-blue-200/20 blur-[115px]" />

          <div className="relative flex w-full max-w-[1040px] flex-col">
            {/* TOP COPY */}
            <div className="mb-4 px-1 sm:mb-5">
              <div className="hidden sm:flex items-end justify-between gap-4">
                <div>
                  <p className="mb-2 text-[9px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
                    Choose your plan
                  </p>

                  <h1 className="text-2xl font-semibold tracking-[-0.055em] text-[#111] sm:text-3xl">
                    Pick what fits the two of you.
                  </h1>
                </div>

                <div className="hidden text-right sm:block">
                  <p className="text-xs text-neutral-400">
                    Change anytime.
                  </p>

                  <p className="mt-0.5 text-xs text-neutral-400">
                    No long-term commitment.
                  </p>
                </div>
              </div>
            </div>

            {/* PLAN SELECTOR */}
            <div className="mb-4 sm:mb-5">
              <div className="w-full rounded-full border border-black/[0.06] bg-white/80 p-1.5 shadow-[0_12px_40px_rgba(0,0,0,0.04)] backdrop-blur-sm sm:w-fit">
                <div className="grid grid-cols-3 gap-1 sm:flex sm:min-w-[390px]">
                  {PLANS.map((item, index) => {
                    const selected = activePlan === index;
                    const itemIsFree = item.id === "free";
                    const itemIsPlus = item.id === "plus";
                    const itemIsPro = item.id === "pro";

                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setActivePlan(index);
                          setIsSuccess(false);
                        }}
                        className={`relative flex min-h-[46px] flex-1 items-center justify-center gap-2 rounded-full px-3 py-2 transition-all duration-300 sm:min-h-[48px] sm:px-5 ${
                          selected
                            ? itemIsFree
                              ? "bg-[#171717] text-white shadow-sm"
                              : itemIsPlus
                                ? "bg-[#f7e9ef] text-[#171717] shadow-sm"
                                : "bg-[#e8f1fa] text-[#171717] shadow-sm"
                            : "text-neutral-400 hover:bg-black/[0.025] hover:text-neutral-700"
                        }`}
                      >
                        <span className="text-sm font-semibold sm:text-sm">
                          {item.shortName}
                        </span>

                        {item.id === "plus" && (
                          <span
                            className={`rounded-full px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-[0.08em] ${
                              selected
                                ? "bg-pink-200/60 text-pink-500"
                                : "bg-pink-50 text-pink-400"
                            }`}
                          >
                            Popular
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* PLAN CARD */}
            <div className="relative overflow-hidden rounded-[1.75rem] border border-black/[0.06] bg-white shadow-[0_30px_100px_rgba(0,0,0,0.07)] sm:rounded-[2rem]">
              {/* PLAN AMBIENT */}
              <div
                className={`pointer-events-none absolute left-[-100px] top-[-100px] size-[320px] rounded-full blur-[110px] ${
                  isFree
                    ? "bg-neutral-200/35"
                    : isPlus
                      ? "bg-pink-200/40"
                      : "bg-blue-200/35"
                }`}
              />

              <div className="relative grid lg:grid-cols-[0.9fr_1.1fr]">
                {/* LEFT */}
                <div className="flex flex-col p-6 sm:p-8 lg:p-10 xl:p-11">
                  <div className="">
                    <h2 className="max-w-md text-[2.35rem] font-semibold leading-[0.95] tracking-[-0.065em] text-[#111] sm:text-5xl lg:text-[3.35rem]">
                      {plan.title}
                    </h2>

                    <p className="mt-5 max-w-md text-sm leading-6 text-neutral-500">
                      {plan.description}
                    </p>
                  </div>

                  {/* PRICE */}
                  <div className="mt-8 border-t border-black/[0.06] pt-6">
                    <div className="flex items-end gap-2">
                      <span className="text-3xl font-semibold text-[#111] sm:text-4xl">
                        {plan.price}
                      </span>

                      {!isFree && (
                        <span className="mb-1 text-xs text-neutral-400">
                          / month
                        </span>
                      )}
                    </div>

                    {!isFree && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-xs text-neutral-300 line-through">
                          {plan.oldPrice}
                        </span>

                        <span
                          className={`rounded-full px-2 py-1 text-[8px] font-medium uppercase tracking-[0.08em] ${
                            isPlus
                              ? "bg-pink-50 text-pink-400"
                              : "bg-blue-50 text-blue-400"
                          }`}
                        >
                          Intro price
                        </span>
                      </div>
                    )}

                    {isFree && (
                      <p className="mt-2 text-xs text-neutral-400">
                        No payment required
                      </p>
                    )}
                  </div>
                </div>

                {/* RIGHT */}
                <div
                  className={`relative m-3 overflow-hidden rounded-[1.4rem] text-white sm:m-4 lg:m-4 lg:ml-0 lg:rounded-[1.65rem] ${
                    isFree
                      ? "bg-[#171717]"
                      : isPlus
                        ? "bg-[#191719]"
                        : "bg-[#17191d]"
                  }`}
                >
                  {/* GLOWS */}
                  <div
                    className={`pointer-events-none absolute right-[-100px] top-[-120px] size-[320px] rounded-full blur-[95px] ${
                      isFree
                        ? "bg-white/5"
                        : isPlus
                          ? "bg-pink-400/15"
                          : "bg-blue-400/15"
                    }`}
                  />

                  <div
                    className={`pointer-events-none absolute bottom-[-130px] left-[-100px] size-[320px] rounded-full blur-[95px] ${
                      isFree
                        ? "bg-neutral-400/5"
                        : isPlus
                          ? "bg-blue-400/10"
                          : "bg-pink-400/10"
                    }`}
                  />

                  <div className="relative flex h-full flex-col p-6 sm:p-8 lg:p-9">
                    {/* HEADER */}
                    <div className="flex items-start justify-between gap-5">
                      <div>
                        <div className="flex items-center gap-2">
                          <Icon
                            size={14}
                            className={
                              isFree
                                ? "text-white/50"
                                : isPlus
                                  ? "text-pink-200"
                                  : "text-blue-200"
                            }
                          />

                          <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
                            {plan.name}
                          </p>
                        </div>

                        <h3 className="mt-3 text-xl font-semibold tracking-[-0.045em] sm:text-2xl">
                          What&apos;s included.
                        </h3>
                      </div>

                      <div
                        className={`flex size-9 shrink-0 items-center justify-center rounded-full border bg-white/[0.05] ${
                          isFree
                            ? "border-white/10"
                            : isPlus
                              ? "border-pink-200/10"
                              : "border-blue-200/10"
                        }`}
                      >
                        <Sparkles
                          size={13}
                          className={
                            isFree
                              ? "text-white/50"
                              : isPlus
                                ? "text-pink-200"
                                : "text-blue-200"
                          }
                        />
                      </div>
                    </div>

                    {/* FEATURES */}
                    <div className="mt-7 space-y-4 sm:mt-8 sm:space-y-5">
                      {plan.features.map(([label, detail]) => (
                        <div
                          key={label}
                          className="flex items-center justify-between gap-4"
                        >
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex size-6 shrink-0 items-center justify-center rounded-full ${
                                isFree
                                  ? "bg-white/5 text-white/50"
                                  : isPlus
                                    ? "bg-pink-300/10 text-pink-200"
                                    : "bg-blue-300/10 text-blue-200"
                              }`}
                            >
                              <Check size={11} strokeWidth={1.8} />
                            </div>

                            <span className="truncate text-xs text-white/80">
                              {label}
                            </span>
                          </div>

                          <span
                            className={`shrink-0 text-[9px] ${
                              isFree
                                ? "text-white/40"
                                : isPlus
                                  ? "text-pink-200/75"
                                  : "text-blue-200/75"
                            }`}
                          >
                            {detail}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* ERROR */}
                    {error && (
                      <p className="mt-5 text-center text-[10px] text-rose-300">
                        {error.message}
                      </p>
                    )}

                    {/* CTA */}
                    <div className="mt-7 border-t border-white/[0.08] pt-5 sm:mt-auto sm:pt-7">
                      {isPlus && !alreadyUsedTrial && (
                        <button
                          onClick={handleStartTrial}
                          disabled={
                            isTrialPending ||
                            isActivating ||
                            isSuccess
                          }
                          className="mb-3 flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/[0.05] px-5 py-3.5 text-sm font-medium text-white transition hover:bg-white/[0.1] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isTrialPending ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Mengaktifkan trial...
                            </>
                          ) : (
                            <>
                              <Sparkles size={14} />
                              Coba Plus gratis 3 hari
                            </>
                          )}
                        </button>
                      )}

                      {isFree ? (
                        <button
                          onClick={() => router.push("/subscription")}
                          className="group flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.06] px-5 py-3.5 text-sm font-medium text-white transition hover:-translate-y-0.5 hover:bg-white/[0.1]"
                        >
                          Paket Free
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            handleActivate(plan.id as "plus" | "pro")
                          }
                          disabled={
                            isActivating ||
                            isTrialPending ||
                            isSuccess
                          }
                          className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-5 py-3.5 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-neutral-100 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                          {isSuccess ? (
                            <>
                              <Check size={14} />
                              {plan.name} aktif!
                            </>
                          ) : isActivating ? (
                            <>
                              <Loader2
                                size={14}
                                className="animate-spin"
                              />
                              Mengaktifkan...
                            </>
                          ) : (
                            <>
                              Pilih {plan.name}
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* MOBILE HELPER */}
            <p className="mt-3 text-center text-[10px] text-neutral-400 sm:hidden">
              Pilih paket untuk melihat detail dan harga.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}