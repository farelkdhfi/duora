'use client'

import { memo } from 'react'

import type { Mood } from '@/features/checkins/types'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

type ThemeKey = Mood | 'empty'
type Slot = 'center' | 'left' | 'right'
type Stop = [position: number, alpha: number]
type Palette = { wall: string; shade: string }

/* -------------------------------------------------------------------------- */
/* TEMA WARNA                                                                 */
/* wall  = warna kertas backdrop                                              */
/* shade = hue sama tapi lebih gelap, untuk falloff cahaya dan cove           */
/* 'empty' dipakai kalau mood belum ada (mis. partner belum check-in)         */
/* -------------------------------------------------------------------------- */

const THEMES: Record<ThemeKey, Palette> = {
  happy: { wall: '96, 42, 72', shade: '20, 6, 14' },
  neutral: { wall: '52, 54, 58', shade: '8, 8, 10' },
  sad: { wall: '36, 66, 112', shade: '6, 14, 30' },
  tired: { wall: '66, 48, 108', shade: '14, 8, 30' },
  stressed: { wall: '112, 44, 46', shade: '28, 6, 8' },
  empty: { wall: '52, 54, 58', shade: '8, 8, 10' },
}

const THEME_KEYS = Object.keys(THEMES) as ThemeKey[]

/* -------------------------------------------------------------------------- */
/* SLOT                                                                       */
/* center = satu dinding penuh. left/right = mode split (dua dinding).        */
/* -------------------------------------------------------------------------- */

const SLOTS: Record<Slot, { cx: number; keyLightSize: string; floorShadeSize: string }> = {
  center: { cx: 50, keyLightSize: '72% 42%', floorShadeSize: '340px 86px' },
  left: { cx: 25, keyLightSize: '40% 46%', floorShadeSize: '30% 14%' },
  right: { cx: 75, keyLightSize: '40% 46%', floorShadeSize: '30% 14%' },
}

const SLOT_KEYS = Object.keys(SLOTS) as Slot[]

/* -------------------------------------------------------------------------- */
/* BUILDER GRADIENT                                                           */
/* -------------------------------------------------------------------------- */

const rgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`

const vertical = (rgb: string, stops: Stop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops.map(([position, alpha]) => `${rgba(rgb, alpha)} ${position + offset}%`).join(', ')})`

// Warna dinding memudar pelan ke lantai hampir netral, tanpa garis potong.
const WALL_TO_FLOOR: Stop[] = [
  [0, 0.92], [12, 0.9], [24, 0.84], [36, 0.7], [47, 0.5],
  [57, 0.32], [67, 0.18], [78, 0.08], [90, 0.02], [100, 0],
]

// Cahaya meredup ke arah plafon.
const CEILING_FALLOFF: Stop[] = [[0, 0.12], [8, 0.08], [16, 0.045], [26, 0.015], [34, 0]]

// Cove: pita bayangan lembut tempat dinding melengkung ke lantai (relatif ke horizon).
const COVE: Stop[] = [[-26, 0], [-18, 0.025], [-10, 0.065], [-3, 0.1], [3, 0.11], [10, 0.08], [18, 0.04], [27, 0]]

const keyLight = (size: string, cx: number) =>
  `radial-gradient(ellipse ${size} at ${cx}% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.09) 28%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.01) 80%, rgba(255,255,255,0) 100%)`

const floorShade = (rgb: string, size: string, cx: number, horizon: number) =>
  `radial-gradient(ellipse ${size} at ${cx}% ${horizon + 3}%, ${rgba(rgb, 0.2)} 0%, ${rgba(rgb, 0.1)} 40%, ${rgba(rgb, 0.03)} 75%, ${rgba(rgb, 0)} 100%)`

const buildWall = ({ wall, shade }: Palette, slot: Slot, horizon: number) => {
  const { cx, keyLightSize, floorShadeSize } = SLOTS[slot]

  return [
    floorShade(shade, floorShadeSize, cx, horizon),
    vertical(shade, COVE, horizon),
    vertical(shade, CEILING_FALLOFF),
    keyLight(keyLightSize, cx),
    vertical(wall, WALL_TO_FLOOR),
  ].join(', ')
}

// Karena horizon bisa beda per pemakaian, hasilnya di-cache per nilai horizon.
const backdropCache = new Map<number, Record<Slot, Record<ThemeKey, string>>>()

const getBackdrops = (horizon: number) => {
  let hit = backdropCache.get(horizon)

  if (!hit) {
    hit = Object.fromEntries(
      SLOT_KEYS.map((slot) => [
        slot,
        Object.fromEntries(THEME_KEYS.map((key) => [key, buildWall(THEMES[key], slot, horizon)])),
      ]),
    ) as Record<Slot, Record<ThemeKey, string>>

    backdropCache.set(horizon, hit)
  }

  return hit
}

/* -------------------------------------------------------------------------- */
/* OVERLAY STATIS                                                             */
/* -------------------------------------------------------------------------- */

// Cahaya studio miring dari kiri atas: side-light lebar + cone tipis.
const SIDE_LIGHT = 'linear-gradient(112deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.06) 26%, rgba(255,255,255,0.02) 50%, rgba(255,255,255,0) 68%)'

const LIGHT_CONE = 'conic-gradient(from 0deg at -10% -16%, rgba(255,255,255,0) 104deg, rgba(255,255,255,0.015) 114deg, rgba(255,255,255,0.04) 124deg, rgba(255,255,255,0.07) 134deg, rgba(255,255,255,0.08) 141deg, rgba(255,255,255,0.065) 149deg, rgba(255,255,255,0.035) 160deg, rgba(255,255,255,0.012) 171deg, rgba(255,255,255,0) 182deg)'

// Cahaya miring memudar sendiri sebelum sampai lantai.
const FADE_BEFORE_FLOOR = 'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

// Sisi yang tidak kena cahaya sedikit lebih gelap, plus vignette halus.
const LIGHT_FALLOFF = 'linear-gradient(292deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 55%)'
const VIGNETTE = 'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 78%, rgba(0,0,0,0.3) 100%)'

// Mode split: sisi kanan di-crossfade ke sisi kiri supaya tidak ada garis keras.
const RIGHT_BLEND = 'linear-gradient(to right, transparent 38%, #000 62%)'

const SOFT_SHADOW = 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.18) 45%, rgba(0,0,0,0.06) 78%, rgba(0,0,0,0) 100%)'
const CONTACT_SHADOW = 'radial-gradient(ellipse closest-side, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.28) 48%, rgba(0,0,0,0.06) 80%, rgba(0,0,0,0) 100%)'

// Film grain halus: menyamarkan banding gradient dan memberi kesan matte.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

/* -------------------------------------------------------------------------- */
/* WALL (satu permukaan yang cross-fade antar mood)                           */
/* -------------------------------------------------------------------------- */

const StudioWall = memo(function StudioWall({
  slot,
  mood,
  horizon,
}: {
  slot: Slot
  mood?: Mood
  horizon: number
}) {
  const backdrops = getBackdrops(horizon)[slot]
  const active: ThemeKey = mood && mood in THEMES ? mood : 'empty'
  const mask = slot === 'right' ? RIGHT_BLEND : undefined

  return (
    <div
      className="absolute inset-0"
      style={mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined}
    >
      {THEME_KEYS.map((key) => (
        <div
          key={key}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ background: backdrops[key], opacity: key === active ? 1 : 0 }}
        />
      ))}
    </div>
  )
})

/* -------------------------------------------------------------------------- */
/* STUDIO BACKDROP                                                            */
/* -------------------------------------------------------------------------- */

interface StudioBackdropProps {
  /**
   * - `mood`                  -> satu dinding penuh
   * - `[moodKiri, moodKanan]` -> dua dinding (split), cross-fade di tengah + garis pemisah tipis
   */
  mood?: Mood | readonly [Mood | undefined, Mood | undefined]
  /** titik dinding menyatu dengan lantai (% tinggi). Geser agar pas dengan "kaki" karakter. */
  horizon?: number
  /** true = `fixed` (full layar), false = `absolute` (mengisi parent `relative`) */
  fixed?: boolean
  /** bayangan lantai besar di bawah MoodSelector (halaman check-in) */
  selectorShadow?: boolean
  className?: string
}

export const StudioBackdrop = memo(function StudioBackdrop({
  mood,
  horizon = 54,
  fixed = false,
  selectorShadow = false,
  className = '',
}: StudioBackdropProps) {
  const split = typeof mood === 'object'
  const [first, second] = typeof mood === 'object' ? mood : [mood, undefined]

  return (
    <div
      aria-hidden
      className={`pointer-events-none inset-0 overflow-hidden bg-[#0a0a0c] ${fixed ? 'fixed z-0' : 'absolute'} ${className}`}
    >
      {/* DINDING + COVE + LANTAI */}
      {split ? (
        <>
          <StudioWall slot="left" mood={first} horizon={horizon} />
          <StudioWall slot="right" mood={second} horizon={horizon} />
        </>
      ) : (
        <StudioWall slot="center" mood={first} horizon={horizon} />
      )}

      {/* CAHAYA STUDIO MIRING (memudar sebelum lantai) */}
      <div
        className="absolute inset-0"
        style={{
          background: `${LIGHT_CONE}, ${SIDE_LIGHT}`,
          maskImage: FADE_BEFORE_FLOOR,
          WebkitMaskImage: FADE_BEFORE_FLOOR,
        }}
      />

      {/* FALLOFF + VIGNETTE */}
      <div className="absolute inset-0" style={{ background: `${VIGNETTE}, ${LIGHT_FALLOFF}` }} />

      {/* BAYANGAN SELECTOR (opsional) */}
      {selectorShadow && (
        <>
          <div
            className="absolute left-1/2 h-28 w-[460px] -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${horizon + 3}%`, background: SOFT_SHADOW }}
          />
          <div
            className="absolute left-1/2 h-10 w-[210px] -translate-x-1/2 -translate-y-1/2"
            style={{ top: `${horizon + 3}%`, background: CONTACT_SHADOW }}
          />
        </>
      )}

      {/* FILM GRAIN */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: GRAIN }} />

      {/* GARIS PEMISAH TENGAH (hanya mode split) */}
      {split && <div className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-white/10" />}
    </div>
  )
})

/* -------------------------------------------------------------------------- */
/* BAYANGAN LANTAI UNTUK KARAKTER                                             */
/* 3 lapis: halo berwarna, penumbra lembut, contact shadow yang rapat.        */
/* Letakkan di dalam wrapper `relative` yang pas dengan kotak karakter.       */
/* -------------------------------------------------------------------------- */

export function StudioFloorShadow({ mood }: { mood: Mood }) {
  const { shade } = THEMES[mood]

  const layers = [
    {
      width: 124,
      height: 30,
      dx: 9,
      background: `radial-gradient(ellipse closest-side, ${rgba(shade, 0.26)} 0%, ${rgba(shade, 0.12)} 45%, ${rgba(shade, 0.03)} 78%, ${rgba(shade, 0)} 100%)`,
    },
    { width: 96, height: 20, dx: 6, background: SOFT_SHADOW },
    { width: 50, height: 10, dx: 2, background: CONTACT_SHADOW },
  ]

  return (
    <>
      {layers.map(({ width, height, dx, background }) => (
        <div
          key={width}
          aria-hidden
          className="pointer-events-none absolute bottom-0 left-1/2"
          style={{
            width,
            height,
            background,
            // pusat elips tepat di tepi bawah kotak karakter
            transform: `translate(calc(-50% + ${dx}px), 50%)`,
          }}
        />
      ))}
    </>
  )
}