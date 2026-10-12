// screen-time/components/icon-customizer.tsx

"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Palette } from "lucide-react";

import type { IconTheme } from "../types";
import { getProgressToNextTier } from "../tiers";
import { useSetScreenTimeIconTheme } from "../queries";
import { useIconStyle } from "../use-icon-style";
import { ICON_THEMES, THEME_COLORS, TierIcon } from "./tier-icon";

interface IconCustomizerProps {
  /** Total waktu bersama (detik). Tier ditentukan sistem dari angka ini. */
  totalSeconds: number;
  /** Tema yang tersimpan di server. */
  theme: IconTheme;
}

const THEME_LABELS: Record<IconTheme, string> = {
  flame: "Api",
  heart: "Hati",
  star: "Bintang",
  moon: "Bulan",
};

const COLOR_PRESETS = [
  "#f97316",
  "#ef4444",
  "#ec4899",
  "#a855f7",
  "#3b82f6",
  "#14b8a6",
  "#22c55e",
  "#eab308",
];

export function IconCustomizer({ totalSeconds, theme }: IconCustomizerProps) {
  const queryClient = useQueryClient();

  const { currentTier, nextTier, hoursUntilNextTier } =
    getProgressToNextTier(totalSeconds);

  const { style, setTheme, setColor, setAnimated } = useIconStyle();
  const { mutate: saveTheme, isPending } = useSetScreenTimeIconTheme();

  const [saveFailed, setSaveFailed] = useState(false);

  // Pilihan di perangkat ini diutamakan, jadi langsung berubah tanpa
  // menunggu server / refetch.
  const activeTheme = style.theme ?? theme;

  // Contoh bentuk minimal tier 3 supaya tema mudah dibedakan.
  const sampleLevel = Math.max(currentTier.level, 3);

  function handleTheme(next: IconTheme) {
    if (next === activeTheme) return;

    setTheme(next);
    setSaveFailed(false);

    saveTheme(next, {
      onSuccess: () => {
        // Segarkan data lain yang ikut memuat tema (mis. ringkasan Wrapped).
        queryClient.invalidateQueries({
          predicate: (query) =>
            query.queryKey.some(
              (part) =>
                typeof part === "string" &&
                /wrapped|screen-time/i.test(part)
            ),
        });
      },
      onError: (error) => {
        console.error("Gagal menyimpan bentuk ikon:", error);
        setSaveFailed(true);
      },
    });
  }

  return (
    <div className="space-y-7">
      {/* Preview: selalu tier kalian saat ini */}
      <section className="rounded-[1.75rem] border border-black/[0.05] bg-[#fafaf9] px-4 py-6">
        <div className="flex flex-col items-center">
          <TierIcon
            level={currentTier.level}
            theme={activeTheme}
            size={128}
            color={style.color}
            animated={style.animated}
          />

          <p className="mt-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-neutral-400">
            Tier {currentTier.level}
          </p>

          <p className="mt-1 text-lg font-semibold tracking-[-0.04em] text-neutral-900">
            {currentTier.name}
          </p>

          <p className="mt-1 text-center text-[10px] leading-4 text-neutral-400">
            {nextTier && hoursUntilNextTier !== null
              ? `${hoursUntilNextTier.toLocaleString("id-ID", {
                  maximumFractionDigits: 1,
                })} jam lagi menuju ${nextTier.name}. Ikon makin besar seiring tier naik.`
              : "Tier tertinggi sudah tercapai."}
          </p>
        </div>
      </section>

      {/* Theme */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
          Bentuk
        </p>

        <div className="mt-3 grid grid-cols-4 gap-2">
          {ICON_THEMES.map((item) => {
            const selected = item === activeTheme;

            return (
              <button
                key={item}
                type="button"
                onClick={() => handleTheme(item)}
                disabled={isPending}
                aria-pressed={selected}
                className={`flex flex-col items-center gap-1.5 rounded-2xl border px-2 py-3 transition disabled:opacity-60 ${
                  selected
                    ? "border-black/[0.12] bg-neutral-50"
                    : "border-black/[0.05] bg-white hover:bg-neutral-50/70"
                }`}
              >
                <TierIcon
                  level={sampleLevel}
                  theme={item}
                  size={40}
                  color={style.color}
                />

                <span className="text-[11px] font-medium text-neutral-700">
                  {THEME_LABELS[item]}
                </span>
              </button>
            );
          })}
        </div>

        {saveFailed && (
          <p className="mt-2 text-[10px] font-medium text-rose-500">
            Bentuk belum tersimpan di akun. Tampilan di perangkat ini tetap
            berubah.
          </p>
        )}
      </section>

      {/* Color */}
      <section>
        <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
          Warna
        </p>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setColor(null)}
            aria-pressed={style.color === null}
            className={`flex h-8 items-center gap-1.5 rounded-full border px-3 text-[11px] font-medium transition ${
              style.color === null
                ? "border-neutral-900 bg-neutral-900 text-white"
                : "border-black/[0.08] bg-white text-neutral-600 hover:bg-neutral-50"
            }`}
          >
            <span
              className="size-2.5 rounded-full"
              style={{ backgroundColor: THEME_COLORS[activeTheme] }}
            />
            Default
          </button>

          {COLOR_PRESETS.map((preset) => {
            const selected = style.color?.toLowerCase() === preset;

            return (
              <button
                key={preset}
                type="button"
                onClick={() => setColor(preset)}
                aria-label={`Warna ${preset}`}
                aria-pressed={selected}
                className={`flex size-8 items-center justify-center rounded-full ring-offset-2 transition ${
                  selected ? "ring-2 ring-neutral-900" : "hover:scale-105"
                }`}
                style={{ backgroundColor: preset }}
              >
                {selected && (
                  <Check size={13} strokeWidth={3} className="text-white" />
                )}
              </button>
            );
          })}

          <label
            className="relative flex size-8 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-black/[0.08] bg-white text-neutral-500 transition hover:bg-neutral-50"
            title="Warna custom"
          >
            <Palette size={14} />

            <input
              type="color"
              value={style.color ?? THEME_COLORS[activeTheme]}
              onChange={(event) => setColor(event.target.value)}
              aria-label="Pilih warna custom"
              className="absolute inset-0 size-full cursor-pointer opacity-0"
            />
          </label>
        </div>
      </section>

      {/* Animation */}
      <section className="flex items-center justify-between gap-4 rounded-2xl border border-black/[0.05] bg-white px-3.5 py-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-neutral-700">Animasi</p>

          <p className="mt-0.5 truncate text-[9px] text-neutral-400">
            Cahaya berdenyut dan kilauan berkelip
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={style.animated}
          aria-label="Animasi ikon"
          onClick={() => setAnimated(!style.animated)}
          className={`relative flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200 ${
            style.animated ? "bg-neutral-900" : "bg-neutral-200"
          }`}
        >
          <span
            className={`block size-4 rounded-full bg-white shadow-[0_1px_4px_rgba(0,0,0,0.2)] transition-transform duration-200 ease-out ${
              style.animated ? "translate-x-4" : "translate-x-0"
            }`}
          />
        </button>
      </section>

      <p className="text-center text-[10px] leading-4 text-neutral-400">
        Tier naik otomatis sesuai waktu bersama. Bentuk, warna, dan animasi
        tersimpan di perangkat ini.
      </p>
    </div>
  );
}