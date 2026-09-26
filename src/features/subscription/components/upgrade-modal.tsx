// subscription/components/upgrade-modal.tsx

"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X, Check, ArrowRight, Dot, HeartPlus, Loader2 } from "lucide-react";
import { useActivatePremiumManual, useMySubscription, useStartTrialManual } from "../queries";

interface UpgradeModalProps {
  onClose: () => void;
}

const PREMIUM_FEATURES = [
  {
    label: "AI Debates",
    detail: "15 messages",
  },
  {
    label: "Daily Check-in Mood",
    detail: "Unlimited",
  },
  {
    label: "Meeting Countdown",
    detail: "Unlimited",
  },
  {
    label: "LDR Wrapped",
    detail: "Custom templates",
  },
  {
    label: "Share Cards",
    detail: "All templates",
  },
];

export function UpgradeModal({ onClose }: UpgradeModalProps) {
  const [mounted, setMounted] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate: activatePremium, isPending, error } = useActivatePremiumManual();
  const { data: subscription } = useMySubscription();
  const { mutate: startTrial, isPending: isTrialPending, error: trialError } = useStartTrialManual();

  const alreadyUsedTrial = subscription?.has_used_trial ?? false;

  useEffect(() => {
    setMounted(true);

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  if (!mounted) return null;

  function handleUpgrade() {
    activatePremium(30, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
        }, 1800);
      },
    });
  }

  function handleStartTrial() {
    startTrial(undefined, {
      onSuccess: () => {
        setIsSuccess(true);
        setTimeout(() => onClose(), 1800);
      },
    });
  }

  const modalContent = (
    <div
      className="
        fixed inset-0 z-[9999]
        flex items-center justify-center
        overflow-y-auto
        bg-black/35
        p-3
        backdrop-blur-md
        sm:p-4
        lg:p-6
      "
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="
          relative my-auto
          w-full
          max-w-[520px]
          overflow-hidden
          rounded-[1.75rem]
          border border-black/[0.07]
          bg-[#fafaf9]
          shadow-[0_30px_100px_rgba(0,0,0,0.16)]

          sm:rounded-[2rem]

          lg:max-w-[920px]
          xl:max-w-[1000px]
          lg:flex
          lg:flex-row
          lg:items-stretch
        "
      >
        {/* ========================================================= */}
        {/* ATMOSPHERE */}
        {/* ========================================================= */}

        <div className="pointer-events-none absolute left-1/2 top-[-180px] size-[420px] -translate-x-1/2 rounded-full bg-pink-200/30 blur-[110px]" />

        <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] size-[360px] rounded-full bg-blue-200/25 blur-[110px]" />

        {/* ========================================================= */}
        {/* CLOSE */}
        {/* ========================================================= */}

        <button
          onClick={onClose}
          aria-label="Close"
          className="
            absolute right-4 top-4 z-30
            flex size-8 items-center justify-center
            rounded-full
            border border-black/[0.07]
            bg-white/70
            text-neutral-400
            backdrop-blur-sm
            transition
            hover:border-black/[0.12]
            hover:bg-white
            hover:text-black

            sm:right-5 sm:top-5
          "
        >
          <X size={15} strokeWidth={1.5} />
        </button>

        {/* ========================================================= */}
        {/* LEFT / INTRO */}
        {/* ========================================================= */}

        <div
          className="
            relative
            flex flex-col
            px-5 pb-6 pt-7

            sm:px-7 sm:pb-7 sm:pt-8
            md:px-9 md:pb-8 md:pt-9

            lg:w-[47%]
            lg:justify-center
            lg:px-9
            lg:py-10

            xl:w-[46%]
            xl:px-11
          "
        >
          {/* HEADER */}

          <div className="pr-8 sm:pr-10">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[9px] font-medium uppercase tracking-[0.2em] text-neutral-400">
                Duora+
              </p>

              <span
                className="
                  rounded-full
                  border border-pink-200/70
                  bg-pink-50
                  px-2 py-1
                  text-[8px]
                  font-medium
                  uppercase
                  tracking-[0.12em]
                  text-pink-400
                "
              >
                More together
              </span>
            </div>

            <h2
              className="
                mt-3
                max-w-sm
                text-[2rem]
                font-semibold
                leading-[0.98]
                tracking-[-0.06em]
                text-[#111111]

                sm:text-3xl
                md:text-4xl

                lg:text-[2.75rem]
                xl:text-5xl
              "
            >
              Make more
              <br />
              <span className="text-neutral-300">
                memories together.
              </span>
            </h2>

            <p
              className="
                mt-4
                max-w-sm
                text-[13px]
                leading-5
                text-neutral-500

                sm:mt-5
                sm:text-sm
                sm:leading-6

                lg:max-w-[340px]
              "
            >
              Get more room for your shared plans, conversations,
              check-ins, and moments worth keeping.
            </p>
          </div>

          {/* PRICE */}

          <div
            className="
              mt-7
              flex
              items-end
              justify-between
              gap-4
              border-t
              border-black/[0.06]
              pt-5

              sm:mt-8
              sm:pt-6

              lg:mt-10
            "
          >
            <div>
              <div className="flex flex-wrap items-end gap-x-2 gap-y-1">
                <span
                  className="
                    text-[1.65rem]
                    font-semibold
                    tracking-[-0.06em]
                    text-[#111111]

                    sm:text-3xl
                  "
                >
                  Rp 25.999
                </span>

                <span className="mb-1 text-[11px] text-neutral-400 sm:text-xs">
                  / month
                </span>
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="text-[11px] text-neutral-300 line-through sm:text-xs">
                  Rp 50.000
                </span>

                <span
                  className="
                    rounded-full
                    bg-pink-50
                    px-2 py-1
                    text-[8px]
                    font-medium
                    uppercase
                    tracking-[0.08em]
                    text-pink-400
                  "
                >
                  Intro price
                </span>
              </div>
            </div>

            <div
              className="
                hidden
                size-10
                shrink-0
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.07]
                bg-white

                sm:flex
              "
            >
              <HeartPlus size={16} className="text-pink-400" />
            </div>
          </div>

          {/* DESKTOP FOOT NOTE */}

          <div
            className="
              mt-8
              hidden
              items-center
              justify-between
              gap-4
              border-t
              border-black/[0.06]
              pt-6

              lg:flex
            "
          >
            <p className="max-w-[240px] text-[9px] leading-4 text-neutral-400">
              Duora+ expands the limits for couples who want more
              room for their shared moments.
            </p>

            <div className="flex shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-neutral-300">
              <span className="size-1 rounded-full bg-pink-300" />
              Private for two
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT / PREMIUM */}
        {/* ========================================================= */}

        <div
          className="
            relative
            m-3
            mt-0
            overflow-hidden
            rounded-[1.4rem]
            bg-[#171717]
            text-white
            shadow-[0_20px_60px_rgba(0,0,0,0.10)]

            sm:m-4
            sm:mt-0
            md:m-5
            md:mt-0

            lg:m-4
            lg:ml-0
            lg:w-[53%]
            lg:rounded-[1.75rem]

            xl:w-[54%]
          "
        >
          {/* GLOWS */}

          <div className="pointer-events-none absolute right-[-100px] top-[-120px] size-[300px] rounded-full bg-pink-400/15 blur-[90px]" />

          <div className="pointer-events-none absolute bottom-[-130px] left-[-100px] size-[300px] rounded-full bg-blue-400/10 blur-[90px]" />

          {/* CONTENT */}

          <div
            className="
              relative
              flex
              h-full
              flex-col
              p-5

              sm:p-6
              md:p-7

              lg:p-8
              xl:p-9
            "
          >
            {/* CARD HEADER */}

            <div className="flex items-start justify-between gap-5">
              <div className="min-w-0">
                <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/40">
                  Everything in Free, plus
                </p>

                <h3
                  className="
                    mt-2
                    text-base
                    font-semibold
                    tracking-[-0.04em]

                    sm:text-lg
                  "
                >
                  More space for the two of you.
                </h3>
              </div>

              <div
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/10
                  bg-white/[0.05]
                "
              >
                <Dot size={14} className="text-pink-200" />
              </div>
            </div>

            {/* FEATURES */}

            <div
              className="
                mt-5
                space-y-3

                sm:mt-6
                sm:space-y-4

                lg:mt-7
              "
            >
              {PREMIUM_FEATURES.map((feature) => (
                <div
                  key={feature.label}
                  className="
                    flex
                    items-center
                    justify-between
                    gap-3
                  "
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="
                        flex
                        size-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-pink-300/10
                        text-pink-200
                      "
                    >
                      <Check size={11} strokeWidth={1.8} />
                    </div>

                    <span className="truncate text-xs text-white/80">
                      {feature.label}
                    </span>
                  </div>

                  <span
                    className="
                      shrink-0
                      text-[8px]
                      text-pink-200/75

                      sm:text-[9px]
                    "
                  >
                    {feature.detail}
                  </span>
                </div>
              ))}
            </div>

            {/* ERROR */}

            {error && (
              <p className="mt-4 text-center text-[10px] text-rose-300">
                {error.message}
              </p>
            )}

            {/* CTA */}
            <div
              className="
    relative
    mt-6
    border-t
    border-white/[0.08]
    pt-5

    sm:mt-7
    sm:pt-6

    lg:mt-auto
    lg:pt-7
  "
            >
              {!alreadyUsedTrial && (
                <button
                  onClick={handleStartTrial}
                  disabled={isTrialPending || isPending || isSuccess}
                  className="
        mb-2.5
        flex
        w-full
        items-center
        justify-center
        gap-2
        rounded-full
        border
        border-white/20
        bg-white/[0.05]
        px-5
        py-3
        text-sm
        font-medium
        text-white
        transition
        hover:bg-white/[0.1]
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
                >
                  {isTrialPending ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      Mengaktifkan trial...
                    </>
                  ) : (
                    "Coba gratis 3 hari"
                  )}
                </button>
              )}

              <button
                onClick={handleUpgrade}
                disabled={isPending || isTrialPending || isSuccess}
                className="
      group
      flex
      w-full
      items-center
      justify-center
      gap-2
      rounded-full
      bg-white
      px-5
      py-3
      text-sm
      font-medium
      text-black
      transition
      hover:-translate-y-0.5
      hover:bg-neutral-100
      disabled:cursor-not-allowed
      disabled:opacity-70

      sm:py-3.5
    "
              >
                {isSuccess ? (
                  <>
                    <Check size={14} />
                    Premium aktif!
                  </>
                ) : isPending ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Mengaktifkan...
                  </>
                ) : (
                  <>
                    Upgrade sekarang
                    <span
                      className="
            flex
            size-5
            items-center
            justify-center
            rounded-full
            bg-black
            text-white
            transition
            group-hover:translate-x-0.5
          "
                    >
                      <ArrowRight size={11} />
                    </span>
                  </>
                )}
              </button>

              {(error || trialError) && (
                <p className="mt-3 text-center text-[10px] text-rose-300">
                  {(error || trialError)?.message}
                </p>
              )}

              <p className="mt-3 text-center text-[9px] leading-4 text-white/30">
                Pembayaran aman · Aktif setelah dikonfirmasi
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* MOBILE FOOT NOTE */}
        {/* ========================================================= */}

        <div
          className="
            relative
            flex
            items-center
            justify-between
            gap-4
            px-5
            pb-6
            pt-1

            sm:px-7
            sm:pb-7

            md:px-9
            md:pb-8

            lg:hidden
          "
        >
          <p className="max-w-xs text-[9px] leading-4 text-neutral-400">
            Duora+ expands the limits for couples who want more room
            for their shared moments.
          </p>

          <div className="flex shrink-0 items-center gap-2 text-[8px] uppercase tracking-[0.14em] text-neutral-300">
            <span className="size-1 rounded-full bg-pink-300" />
            Private for two
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}