// screen-time/components/tier-icon.tsx

"use client";

import { useId, useSyncExternalStore, type ReactNode } from "react";
import type { IconTheme } from "../types";

/* -------------------------------------------------------------------------- */
/* PUBLIC                                                                      */
/* -------------------------------------------------------------------------- */

interface TierIconProps {
  level: number;
  theme: IconTheme;
  /** Ukuran kotak ikon (px). Kotaknya tetap, yang membesar adalah isinya. */
  size?: number;
  /** Warna custom (#rrggbb). Kosong / null = warna default tema. */
  color?: string | null;
  /** Animasi halus. Biarkan false saat dipakai untuk export gambar. */
  animated?: boolean;
  className?: string;
}

export const ICON_THEMES: IconTheme[] = ["flame", "heart", "star", "moon"];

export const THEME_COLORS: Record<IconTheme, string> = {
  flame: "#f97316",
  heart: "#ec4899",
  star: "#eab308",
  moon: "#818cf8",
};

const HEX = /^#[0-9a-f]{6}$/i;

export function isHexColor(value: string): boolean {
  return HEX.test(value);
}

/* -------------------------------------------------------------------------- */
/* LEVEL SPEC                                                                  */
/* Semua perubahan antar level ada di tabel ini.                               */
/* -------------------------------------------------------------------------- */

interface LevelSpec {
  /** Ukuran glyph utama: 1 = ukuran maksimum. */
  scale: number;
  /** outline -> soft -> solid -> gradient */
  fill: "outline" | "soft" | "solid" | "gradient";
  /** Kilau / inti di dalam glyph. */
  shine: boolean;
  /** Opacity cahaya (aura) di belakang glyph. */
  aura: number;
  /** Jumlah bentuk kecil di belakang glyph. */
  companions: number;
  /** Jumlah cincin orbit. */
  ring: 0 | 1 | 2;
  /** Jumlah kilauan di sudut. */
  sparkles: number;
}

const LEVELS: LevelSpec[] = [
  { scale: 0.52, fill: "outline", shine: false, aura: 0, companions: 0, ring: 0, sparkles: 0 },
  { scale: 0.62, fill: "soft", shine: false, aura: 0, companions: 0, ring: 0, sparkles: 0 },
  { scale: 0.72, fill: "solid", shine: true, aura: 0, companions: 0, ring: 0, sparkles: 0 },
  { scale: 0.82, fill: "gradient", shine: true, aura: 0.3, companions: 0, ring: 0, sparkles: 0 },
  { scale: 0.9, fill: "gradient", shine: true, aura: 0.4, companions: 2, ring: 0, sparkles: 2 },
  { scale: 0.96, fill: "gradient", shine: true, aura: 0.5, companions: 2, ring: 1, sparkles: 3 },
  { scale: 1, fill: "gradient", shine: true, aura: 0.62, companions: 2, ring: 2, sparkles: 4 },
];

/** Sisi terpanjang glyph pada level 7 (dalam unit viewBox 64). */
const EXTENT = 42;

const SPARKLE_PATH =
  "M0 -5C0.6 -1.8 1.8 -0.6 5 0C1.8 0.6 0.6 1.8 0 5C-0.6 1.8 -1.8 0.6 -5 0C-1.8 -0.6 -0.6 -1.8 0 -5Z";

const SPARKLE_SPOTS = [
  { x: 9, y: 11, s: 1 },
  { x: 56, y: 9, s: 0.8 },
  { x: 57, y: 53, s: 0.9 },
  { x: 8, y: 54, s: 0.7 },
];

/* -------------------------------------------------------------------------- */
/* SHAPES                                                                      */
/* -------------------------------------------------------------------------- */

interface Slot {
  x: number;
  y: number;
  scale: number;
  rotate: number;
}

interface Glyph {
  d: string;
  center: [number, number];
  /** Sisi terpanjang path asli. */
  extent: number;
}

interface ThemeShape extends Glyph {
  shine: ReactNode;
  mini: Glyph;
  slots: Slot[];
}

const STAR: Glyph = {
  d: "M32 7L39.6 22.2L56 24.6L44 36.3L46.8 53L32 45.1L17.2 53L20 36.3L8 24.6L24.4 22.2L32 7Z",
  center: [32, 31],
  extent: 48,
};

const SHAPES: Record<IconTheme, ThemeShape> = {
  flame: {
    d: "M32 55C21.8 55 14 48.5 14 39C14 31.5 18.8 25.4 25.8 20.2C25.1 28 28.6 31.2 31.4 32.6C30.8 24.5 34.2 17.7 41.2 10C40.4 22.1 50 28.2 50 39C50 48.5 42.2 55 32 55Z",
    center: [32, 32.5],
    extent: 45,
    shine: (
      <path
        d="M32 48C27 48 23 44.8 23 40.2C23 36.9 25.1 34.1 29 31.2C29 36.1 31.2 38.3 33.3 39.2C32.8 35.1 34.7 32.3 37.5 29.3C37.4 35.2 42 37.4 42 41.7C42 45.6 38.2 48 32 48Z"
        fill="#fff"
        opacity="0.8"
      />
    ),
    mini: {
      d: "M32 55C21.8 55 14 48.5 14 39C14 31.5 18.8 25.4 25.8 20.2C25.1 28 28.6 31.2 31.4 32.6C30.8 24.5 34.2 17.7 41.2 10C40.4 22.1 50 28.2 50 39C50 48.5 42.2 55 32 55Z",
      center: [32, 32.5],
      extent: 45,
    },
    slots: [
      { x: 12, y: 43, scale: 0.5, rotate: -10 },
      { x: 52, y: 43, scale: 0.5, rotate: 10 },
    ],
  },

  heart: {
    d: "M32 56C27.7 52.3 12 41.4 12 28C12 20.9 17.3 15.5 24 15.5C27.7 15.5 30.6 17.3 32 20.3C33.4 17.3 36.3 15.5 40 15.5C46.7 15.5 52 20.9 52 28C52 41.4 36.3 52.3 32 56Z",
    center: [32, 35.75],
    extent: 40.5,
    shine: (
      <path
        d="M20 26C20.7 21.8 23.5 19.2 27.4 18.5"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.75"
      />
    ),
    mini: {
      d: "M32 56C27.7 52.3 12 41.4 12 28C12 20.9 17.3 15.5 24 15.5C27.7 15.5 30.6 17.3 32 20.3C33.4 17.3 36.3 15.5 40 15.5C46.7 15.5 52 20.9 52 28C52 41.4 36.3 52.3 32 56Z",
      center: [32, 35.75],
      extent: 40.5,
    },
    slots: [
      { x: 9, y: 17, scale: 0.28, rotate: -16 },
      { x: 55, y: 17, scale: 0.28, rotate: 16 },
    ],
  },

  star: {
    ...STAR,
    shine: (
      <path
        d="M25 24L28.5 17"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        opacity="0.78"
      />
    ),
    mini: STAR,
    slots: [
      { x: 10, y: 44, scale: 0.36, rotate: -14 },
      { x: 54, y: 44, scale: 0.36, rotate: 14 },
    ],
  },

  moon: {
    // Bulan sabit dari dua lingkaran: R21 di (29,33) dipotong r17 di (40,26).
    d: "M30.3 12.04A21 21 0 1 0 48.54 40.7A17 17 0 0 1 30.3 12.04Z",
    center: [30, 33],
    extent: 42,
    shine: (
      <>
        <circle cx="15.5" cy="31" r="2.4" fill="#fff" opacity="0.28" />
        <circle cx="22" cy="44" r="3.2" fill="#fff" opacity="0.28" />
        <circle cx="17" cy="39.5" r="1.6" fill="#fff" opacity="0.28" />
      </>
    ),
    mini: STAR,
    slots: [
      { x: 48, y: 19, scale: 0.3, rotate: 0 },
      { x: 54, y: 37, scale: 0.2, rotate: 0 },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                     */
/* -------------------------------------------------------------------------- */

const clampLevel = (level: number) =>
  Math.min(7, Math.max(1, Math.round(Number.isFinite(level) ? level : 1)));

/** Campur warna dengan putih (255) atau hitam (0). */
function mix(hex: string, target: 0 | 255, amount: number): string {
  const n = parseInt(hex.slice(1), 16);
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((c) =>
    Math.round(c + (target - c) * amount)
  );

  return `#${channels.map((c) => c.toString(16).padStart(2, "0")).join("")}`;
}

function glyphTransform(glyph: Glyph, x: number, y: number, size: number, rotate = 0) {
  const k = size / glyph.extent;

  return {
    k,
    transform: `translate(${x} ${y}) rotate(${rotate}) scale(${k}) translate(${-glyph.center[0]} ${-glyph.center[1]})`,
  };
}

function subscribeReducedMotion(onChange: () => void) {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", onChange);

  return () => query.removeEventListener("change", onChange);
}

function usePrefersReducedMotion() {
  return useSyncExternalStore(
    subscribeReducedMotion,
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    () => false
  );
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                   */
/* -------------------------------------------------------------------------- */

export function TierIcon({
  level,
  theme,
  size = 48,
  color,
  animated = false,
  className = "",
}: TierIconProps) {
  const uid = useId().replace(/:/g, "");
  const reducedMotion = usePrefersReducedMotion();

  const currentLevel = clampLevel(level);
  const spec = LEVELS[currentLevel - 1];
  const shape = SHAPES[theme];

  const base = color && HEX.test(color) ? color : THEME_COLORS[theme];
  const light = mix(base, 255, 0.4);
  const dark = mix(base, 0, 0.12);

  const motion = animated && !reducedMotion;

  const gradientId = `${uid}-body`;
  const auraId = `${uid}-aura`;

  const fill = spec.fill === "gradient" ? `url(#${gradientId})` : base;

  const main = glyphTransform(shape, 32, 32, EXTENT * spec.scale);

  const fillProps =
    spec.fill === "outline"
      ? {
          fill: base,
          fillOpacity: 0.16,
          stroke: base,
          strokeWidth: 2.2 / main.k,
          strokeLinejoin: "round" as const,
        }
      : {
          fill,
          fillOpacity: spec.fill === "soft" ? 0.78 : 1,
        };

  return (
    <div
      className={`flex shrink-0 items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 64 64"
        fill="none"
        overflow="visible"
        role="img"
        aria-label={`Tier ${currentLevel}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={gradientId} x1="0.2" y1="0" x2="0.8" y2="1">
            <stop offset="0" stopColor={light} />
            <stop offset="1" stopColor={dark} />
          </linearGradient>

          <radialGradient id={auraId}>
            <stop offset="0" stopColor={base} stopOpacity="0.9" />
            <stop offset="0.6" stopColor={base} stopOpacity="0.3" />
            <stop offset="1" stopColor={base} stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Aura */}
        {spec.aura > 0 && (
          <circle cx="32" cy="32" r="31" fill={`url(#${auraId})`} opacity={spec.aura}>
            {motion && (
              <animate
                attributeName="opacity"
                values={`${spec.aura};${spec.aura * 0.55};${spec.aura}`}
                dur="3s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        )}

        {/* Cincin orbit */}
        {spec.ring >= 1 && (
          <circle
            cx="32"
            cy="32"
            r="28.5"
            stroke={base}
            strokeWidth="1.2"
            strokeDasharray="1.2 4.2"
            strokeLinecap="round"
            opacity="0.55"
          >
            {motion && (
              <animateTransform
                attributeName="transform"
                type="rotate"
                from="0 32 32"
                to="360 32 32"
                dur="30s"
                repeatCount="indefinite"
              />
            )}
          </circle>
        )}

        {spec.ring >= 2 && (
          <circle cx="32" cy="32" r="25.5" stroke={base} strokeWidth="1" opacity="0.22" />
        )}

        {/* Glyph (+ bentuk kecil di belakangnya) */}
        <g>
          {motion && (
            <animateTransform
              attributeName="transform"
              type="translate"
              values="0 0;0 -1.2;0 0"
              keyTimes="0;0.5;1"
              calcMode="spline"
              keySplines="0.45 0 0.55 1;0.45 0 0.55 1"
              dur="3.2s"
              repeatCount="indefinite"
            />
          )}

          {shape.slots.slice(0, spec.companions).map((slot, index) => (
            <path
              key={index}
              d={shape.mini.d}
              fill={fill}
              fillOpacity={0.55}
              transform={
                glyphTransform(
                  shape.mini,
                  slot.x,
                  slot.y,
                  EXTENT * slot.scale,
                  slot.rotate
                ).transform
              }
            />
          ))}

          <g transform={main.transform}>
            <path d={shape.d} {...fillProps} />
            {spec.shine && shape.shine}
          </g>
        </g>

        {/* Kilauan */}
        {SPARKLE_SPOTS.slice(0, spec.sparkles).map((spot, index) => (
          <path
            key={index}
            d={SPARKLE_PATH}
            fill={base}
            transform={`translate(${spot.x} ${spot.y}) scale(${spot.s})`}
          >
            {motion && (
              <animate
                attributeName="opacity"
                values="1;0.25;1"
                dur="2.4s"
                begin={`${index * 0.6}s`}
                repeatCount="indefinite"
              />
            )}
          </path>
        ))}
      </svg>
    </div>
  );
}