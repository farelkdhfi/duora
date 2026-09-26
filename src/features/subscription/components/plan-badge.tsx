// subscription/components/plan-badge.tsx

"use client";

import Link from "next/link";
import { Crown, Sparkles, ArrowUpRight, AlertTriangle } from "lucide-react";
import { useMySubscription } from "../queries";
import { isPremium, isOnTrial, isNearingExpiry, getDaysUntilExpiry } from "../utils";

export function PlanBadge() {
  const { data: subscription, isLoading } = useMySubscription();

  if (isLoading) return null;

  const premium = isPremium(subscription ?? null);
  const trial = isOnTrial(subscription ?? null);
  const nearingExpiry = isNearingExpiry(subscription ?? null);
  const daysLeft = getDaysUntilExpiry(subscription ?? null);

  // ============================================================
  // PREMIUM / TRIAL - NEARING EXPIRY (WARNING STATE)
  // ============================================================

  if (premium && nearingExpiry) {
    return (
      <Link
        href="/subscription"
        className="
          group
          relative
          inline-flex
          items-center
          gap-2
          overflow-hidden
          rounded-full
          border
          border-amber-200/80
          bg-amber-50/80
          px-3.5
          py-2
          text-left
          shadow-[0_4px_20px_rgba(0,0,0,0.05)]
          transition
          hover:border-amber-300
          hover:bg-amber-100/70
        "
      >
        <span
          className="
            pointer-events-none
            absolute
            -left-3
            -top-4
            size-10
            rounded-full
            bg-amber-300/30
            blur-xl
          "
        />

        <span
          className="
            relative
            flex
            size-6
            items-center
            justify-center
            rounded-full
            bg-white
            text-amber-500
            shadow-sm
          "
        >
          <AlertTriangle size={12} strokeWidth={1.8} />
        </span>

        <div className="relative flex flex-col leading-none">
          <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-amber-500">
            {trial ? "Trial" : "Premium"}
          </span>

          <span className="mt-1 text-[11px] font-semibold tracking-[-0.01em] text-amber-700">
            {daysLeft === 0 ? "Berakhir hari ini" : `${daysLeft} hari lagi`}
          </span>
        </div>
      </Link>
    );
  }

  // ============================================================
  // PREMIUM / TRIAL
  // ============================================================

  if (premium) {
    return (
      <Link
        href="/subscription"
        className={`
          relative
          inline-flex
          items-center
          gap-2
          overflow-hidden
          rounded-full
          border
          px-3.5
          py-2
          shadow-[0_4px_20px_rgba(0,0,0,0.05)]
          transition
          hover:opacity-90

          ${
            trial
              ? "border-pink-200/80 bg-pink-50/80 text-pink-500"
              : "border-black/[0.08] bg-[#171717] text-white"
          }
        `}
      >
        <span
          className={`
            pointer-events-none
            absolute
            -left-3
            -top-4
            size-10
            rounded-full
            blur-xl

            ${trial ? "bg-pink-300/30" : "bg-pink-300/10"}
          `}
        />

        <span
          className={`
            relative
            flex
            size-6
            items-center
            justify-center
            rounded-full

            ${
              trial
                ? "bg-white text-pink-400 shadow-sm"
                : "border border-white/10 bg-white/[0.08] text-pink-200"
            }
          `}
        >
          {trial ? (
            <Sparkles size={12} strokeWidth={1.8} />
          ) : (
            <Crown size={12} strokeWidth={1.8} />
          )}
        </span>

        <div className="relative flex flex-col leading-none">
          <span
            className={`
              text-[9px]
              font-medium
              uppercase
              tracking-[0.16em]

              ${trial ? "text-pink-400" : "text-white/50"}
            `}
          >
            Duora+
          </span>

          <span
            className={`
              mt-1
              text-[11px]
              font-semibold
              tracking-[-0.01em]

              ${trial ? "text-[#171717]" : "text-white"}
            `}
          >
            {trial ? "Trial" : "Premium"}
          </span>
        </div>
      </Link>
    );
  }

  // ============================================================
  // FREE + UPGRADE
  // ============================================================

  return (
    <Link
      href="/subscription"
      className="
        inline-flex
        items-center
        overflow-hidden
        rounded-full
        border
        border-black/[0.08]
        bg-white
        p-1
        shadow-[0_4px_20px_rgba(0,0,0,0.05)]
        transition
        hover:border-black/[0.12]
        hover:shadow-[0_6px_24px_rgba(0,0,0,0.07)]
      "
    >
      <div className="flex items-center gap-2 px-3 py-1.5">
        <span
          className="
            flex
            size-6
            items-center
            justify-center
            rounded-full
            bg-neutral-100
            text-neutral-400
          "
        >
          <Sparkles size={12} strokeWidth={1.6} />
        </span>

        <div className="flex flex-col leading-none">
          <span className="text-[9px] font-medium uppercase tracking-[0.14em] text-neutral-400">
            Plan
          </span>

          <span className="mt-1 text-[11px] font-semibold tracking-[-0.01em] text-[#171717]">
            Free
          </span>
        </div>
      </div>

      <span
        className="
          group
          flex
          items-center
          gap-2
          rounded-full
          bg-[#171717]
          px-3.5
          py-2
          text-[10px]
          font-medium
          text-white
          shadow-[0_3px_12px_rgba(0,0,0,0.12)]
          transition
          hover:bg-black
        "
      >
        <span>Upgrade</span>

        <span
          className="
            flex
            size-5
            items-center
            justify-center
            rounded-full
            bg-white/[0.12]
            transition
            group-hover:translate-x-0.5
          "
        >
          <ArrowUpRight size={10} strokeWidth={1.8} />
        </span>
      </span>
    </Link>
  );
}