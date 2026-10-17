'use client'

import { memo, useMemo } from 'react'

import type { AiPersona } from '@/features/debates/types'

/* ===================================================== */
/* STUDIO BACKDROP (dark theme) - dipakai bersama        */
/* ===================================================== */

/* posisi default garis horizon (% tinggi layar) */
export const STUDIO_HORIZON = 46

/* wall = warna dinding gelap bernuansa persona,
   shade = warna aksen persona (cove glow, bayangan lantai & radar) */
export const personaTheme: Record<
  AiPersona,
  { wall: string; shade: string }
> = {
  formal: { wall: '34, 36, 36', shade: '120, 126, 124' },
  lembut: { wall: '62, 30, 48', shade: '225, 130, 175' },
  kasar: { wall: '66, 28, 28', shade: '210, 100, 100' },
  lebay: { wall: '26, 46, 76', shade: '90, 145, 210' },
}

const PERSONA_KEYS = Object.keys(personaTheme) as AiPersona[]

export const getPersonaTheme = (persona: AiPersona) =>
  personaTheme[persona] ?? personaTheme.formal

/* hitam murni untuk semua lapisan yang menggelapkan */
const DARK = '0, 0, 0'

type Stop = [position: number, alpha: number]

export const rgba = (rgb: string, alpha: number) =>
  `rgba(${rgb}, ${alpha})`

const vertical = (rgb: string, stops: Stop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops
    .map(
      ([position, alpha]) =>
        `${rgba(rgb, alpha)} ${position + offset}%`,
    )
    .join(', ')})`

const WALL_TO_FLOOR: Stop[] = [
  [0, 0.92], [12, 0.9], [24, 0.84], [36, 0.7], [47, 0.5],
  [57, 0.32], [67, 0.18], [78, 0.08], [90, 0.02], [100, 0],
]

/* atap: gelap di atas, memudar ke bawah */
const CEILING_FALLOFF: Stop[] = [
  [0, 0.45], [8, 0.32], [16, 0.2], [26, 0.08], [34, 0],
]

/* glow tipis aksen persona di garis horizon */
const COVE: Stop[] = [
  [-26, 0], [-18, 0.02], [-10, 0.05], [-3, 0.08],
  [3, 0.09], [10, 0.06], [18, 0.03], [27, 0],
]

/* pusat panggung: glow lembut warna persona (bukan putih) */
const keyLight = (shade: string) =>
  `radial-gradient(ellipse 72% 42% at 50% 30%, ${rgba(shade, 0.16)} 0%, ${rgba(shade, 0.1)} 28%, ${rgba(shade, 0.045)} 55%, ${rgba(shade, 0.012)} 80%, ${rgba(shade, 0)} 100%)`

const buildBackdrop = (
  { wall, shade }: { wall: string; shade: string },
  horizon: number,
) =>
  [
    vertical(shade, COVE, horizon),
    vertical(DARK, CEILING_FALLOFF),
    keyLight(shade),
    vertical(wall, WALL_TO_FLOOR),
  ].join(', ')

/* "cahaya" dari kiri atas berupa gradient gelap */
const SIDE_LIGHT =
  'linear-gradient(112deg, rgba(0,0,0,0.38) 0%, rgba(0,0,0,0.2) 26%, rgba(0,0,0,0.06) 50%, rgba(0,0,0,0) 68%)'

const LIGHT_CONE =
  'conic-gradient(from 0deg at -10% -16%, rgba(0,0,0,0) 104deg, rgba(0,0,0,0.06) 114deg, rgba(0,0,0,0.15) 124deg, rgba(0,0,0,0.26) 134deg, rgba(0,0,0,0.32) 141deg, rgba(0,0,0,0.25) 149deg, rgba(0,0,0,0.13) 160deg, rgba(0,0,0,0.05) 171deg, rgba(0,0,0,0) 182deg)'

const FADE_BEFORE_FLOOR =
  'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

const LIGHT_FALLOFF =
  'linear-gradient(292deg, rgba(0,0,0,0.22) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 55%)'

const VIGNETTE =
  'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(0,0,0,0) 45%, rgba(0,0,0,0.22) 76%, rgba(0,0,0,0.5) 100%)'

/* grain putih tipis supaya kelihatan di background gelap */
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

/* ===================================================== */
/* BAYANGAN LANTAI (export supaya bisa dipakai di bawah  */
/* gambar persona di halaman mana pun)                   */
/* ===================================================== */

export const SOFT_SHADOW =
  'radial-gradient(ellipse closest-side, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.2) 45%, rgba(0,0,0,0.06) 78%, rgba(0,0,0,0) 100%)'

export const CONTACT_SHADOW =
  'radial-gradient(ellipse closest-side, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.32) 48%, rgba(0,0,0,0.07) 80%, rgba(0,0,0,0) 100%)'

/* glow berwarna persona di lantai */
export const floorTint = (shade: string) =>
  `radial-gradient(ellipse closest-side, ${rgba(shade, 0.2)} 0%, ${rgba(shade, 0.09)} 45%, ${rgba(shade, 0.025)} 78%, ${rgba(shade, 0)} 100%)`

/* ===================================================== */
/* COMPONENT                                             */
/* ===================================================== */

interface StudioBackdropProps {
  persona: AiPersona
  /** posisi garis horizon dalam % tinggi layar (default 46) */
  horizon?: number
}

const StudioBackdrop = memo(function StudioBackdrop({
  persona,
  horizon = STUDIO_HORIZON,
}: StudioBackdropProps) {
  const activeKey: AiPersona = persona in personaTheme ? persona : 'formal'

  /* gradient tiap persona dibangun sekali per horizon */
  const layers = useMemo(
    () =>
      PERSONA_KEYS.map((key) => ({
        key,
        background: buildBackdrop(personaTheme[key], horizon),
      })),
    [horizon],
  )

  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-primary"
    >
      {/* dinding + cove + lantai: cross-fade saat persona berganti */}
      {layers.map(({ key, background }) => (
        <div
          key={key}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ background, opacity: key === activeKey ? 1 : 0 }}
        />
      ))}

      {/* gradient gelap dari kiri atas */}
      <div
        className="absolute inset-0"
        style={{
          background: `${LIGHT_CONE}, ${SIDE_LIGHT}`,
          maskImage: FADE_BEFORE_FLOOR,
          WebkitMaskImage: FADE_BEFORE_FLOOR,
        }}
      />

      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{ background: `${VIGNETTE}, ${LIGHT_FALLOFF}` }}
      />

      {/* film grain */}
      <div
        className="absolute inset-0 opacity-[0.045]"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  )
})

export default StudioBackdrop