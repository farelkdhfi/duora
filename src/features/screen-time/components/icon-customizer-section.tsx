// screen-time/components/icon-customizer-section.tsx

"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

import type { IconTheme } from "../types";
import { getTierFromSeconds } from "../tiers";
import { useIconStyle } from "../use-icon-style";
import { IconCustomizer } from "./icon-customizer";
import { TierIcon } from "./tier-icon";

interface IconCustomizerSectionProps {
  totalSeconds: number;
  theme: IconTheme;
}

/** Baris yang bisa dibuka untuk mengatur bentuk, warna, dan animasi ikon tier. */
export function IconCustomizerSection({
  totalSeconds,
  theme,
}: IconCustomizerSectionProps) {
  const [open, setOpen] = useState(false);

  const { style } = useIconStyle();
  const tier = getTierFromSeconds(totalSeconds);

  // Pilihan di perangkat ini diutamakan dibanding tema dari server.
  const activeTheme = style.theme ?? theme;

  return (
    <div className="overflow-hidden rounded-2xl border border-black/[0.05] bg-white">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className="flex w-full items-center gap-3 px-3.5 py-3 text-left transition hover:bg-neutral-50"
      >
        <TierIcon
          level={tier.level}
          theme={activeTheme}
          size={36}
          color={style.color}
        />

        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium text-neutral-700">
            Screen time icon
          </p>

          <p className="mt-0.5 truncate text-[9px] text-neutral-400">
            Tier {tier.level} · {tier.name}
          </p>
        </div>

        <ChevronDown
          size={14}
          className={`shrink-0 text-neutral-400 transition-transform duration-200 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div className="border-t border-black/[0.05] p-3.5">
          <IconCustomizer totalSeconds={totalSeconds} theme={theme} />
        </div>
      )}
    </div>
  );
}