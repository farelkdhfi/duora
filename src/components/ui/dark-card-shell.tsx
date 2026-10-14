import type { ReactNode } from 'react'

export type DarkCardVariant = 'default' | 'sky' | 'rose' | 'violet' | 'white'

type Stop = [position: number, alpha: number]
type Palette = { wall: string; shade: string }

interface VariantStyle {
  /** wall = warna dinding studio, shade = hue sama tapi lebih gelap (falloff & lantai) */
  palette: Palette
  border: string
  accentA: string
  accentB: string
}

/* ============================================================= */
/* WARNA PER VARIANT                                             */
/* Format palette: string RGB tanpa "rgb()"                      */
/* ============================================================= */

const VARIANTS: Record<DarkCardVariant, VariantStyle> = {
  /* Periwinkle netral (PartnerCheckinCard) */
  default: {
    palette: { wall: '60, 58, 88', shade: '10, 10, 18' },
    border: 'border-white/[0.08]',
    accentA: '#F4B6CF',
    accentB: '#A9C7F5',
  },

  /* Sky / biru (Goals) */
  sky: {
    palette: { wall: '40, 84, 124', shade: '6, 16, 30' },
    border: 'border-sky-200/[0.12]',
    accentA: '#A8D1FF',
    accentB: '#A6E8F0',
  },

  /* Rose / pink (Planner) */
  rose: {
    palette: { wall: '118, 50, 84', shade: '28, 8, 16' },
    border: 'border-rose-200/[0.12]',
    accentA: '#FFB8D2',
    accentB: '#D8C2F5',
  },

  /* Violet / ungu (Q&A) */
  violet: {
    palette: { wall: '84, 58, 128', shade: '16, 9, 32' },
    border: 'border-violet-200/[0.12]',
    accentA: '#CDBDFF',
    accentB: '#F2B8F5',
  },

  /* White / abu terang (Debates) */
  white: {
    palette: { wall: '88, 90, 100', shade: '10, 10, 12' },
    border: 'border-white/[0.12]',
    accentA: '#F5F5FA',
    accentB: '#DADCE6',
  },
}

/* ============================================================= */
/* GRADIENT STUDIO                                               */
/* ============================================================= */

const rgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`

const vertical = (rgb: string, stops: Stop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops
    .map(([position, alpha]) => `${rgba(rgb, alpha)} ${position + offset}%`)
    .join(', ')})`

// Warna dinding memudar pelan ke lantai hampir netral, tanpa garis potong.
const WALL_TO_FLOOR: Stop[] = [
  [0, 0.92], [12, 0.9], [24, 0.84], [36, 0.7], [47, 0.5],
  [57, 0.32], [67, 0.18], [78, 0.08], [90, 0.02], [100, 0],
]

// Bayangan meredup ke arah plafon.
const CEILING_FALLOFF: Stop[] = [
  [0, 0.12], [8, 0.08], [16, 0.045], [26, 0.015], [34, 0],
]

// Cove: pita bayangan lembut tempat dinding melengkung ke lantai (relatif ke horizon).
const COVE: Stop[] = [
  [-26, 0], [-18, 0.025], [-10, 0.065], [-3, 0.1], [3, 0.11], [10, 0.08], [18, 0.04], [27, 0],
]

// Key shade hitam di area atas-tengah.
const KEY_SHADE =
  'radial-gradient(ellipse 72% 42% at 50% 30%, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.19) 28%, rgba(0,0,0,0.09) 55%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0) 100%)'

// Bayangan lantai. Pakai persen (bukan px) supaya pas di card kecil maupun besar.
const floorShade = (rgb: string, horizon: number) =>
  `radial-gradient(ellipse 70% 16% at 50% ${horizon + 3}%, ${rgba(rgb, 0.2)} 0%, ${rgba(rgb, 0.1)} 40%, ${rgba(rgb, 0.03)} 75%, ${rgba(rgb, 0)} 100%)`

const buildWall = ({ wall, shade }: Palette, horizon: number) =>
  [
    floorShade(shade, horizon),
    vertical(shade, COVE, horizon),
    vertical(shade, CEILING_FALLOFF),
    KEY_SHADE,
    vertical(wall, WALL_TO_FLOOR),
  ].join(', ')

// Cache per variant + horizon, supaya string gradient tidak dibuat ulang tiap render.
const wallCache = new Map<string, string>()

const getWall = (variant: DarkCardVariant, horizon: number) => {
  const key = `${variant}-${horizon}`
  let hit = wallCache.get(key)

  if (!hit) {
    hit = buildWall(VARIANTS[variant].palette, horizon)
    wallCache.set(key, hit)
  }

  return hit
}

/* ---------------- Overlay statis ---------------- */

// Bayangan studio miring dari kiri atas: side-shade lebar + cone tipis.
const SIDE_SHADE =
  'linear-gradient(112deg, rgba(0,0,0,0.26) 0%, rgba(0,0,0,0.13) 26%, rgba(0,0,0,0.045) 50%, rgba(0,0,0,0) 68%)'

const SHADE_CONE =
  'conic-gradient(from 0deg at -10% -16%, rgba(0,0,0,0) 104deg, rgba(0,0,0,0.03) 114deg, rgba(0,0,0,0.08) 124deg, rgba(0,0,0,0.14) 134deg, rgba(0,0,0,0.16) 141deg, rgba(0,0,0,0.13) 149deg, rgba(0,0,0,0.07) 160deg, rgba(0,0,0,0.024) 171deg, rgba(0,0,0,0) 182deg)'

// Bayangan miring memudar sendiri sebelum sampai lantai.
const FADE_BEFORE_FLOOR =
  'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

// Sisi seberang sedikit lebih gelap, plus vignette halus.
const LIGHT_FALLOFF =
  'linear-gradient(292deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.1) 30%, rgba(0,0,0,0) 55%)'

const VIGNETTE =
  'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.15) 78%, rgba(0,0,0,0.3) 100%)'

// Film grain halus: menyamarkan banding gradient dan memberi kesan matte.
const GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

function StudioGradient({
  variant,
  horizon,
}: {
  variant: DarkCardVariant
  horizon: number
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden bg-[#0a0a0c]"
    >
      {/* DINDING + COVE + LANTAI */}
      <div
        className="absolute inset-0"
        style={{ background: getWall(variant, horizon) }}
      />

      {/* BAYANGAN STUDIO MIRING (memudar sebelum lantai) */}
      <div
        className="absolute inset-0"
        style={{
          background: `${SHADE_CONE}, ${SIDE_SHADE}`,
          maskImage: FADE_BEFORE_FLOOR,
          WebkitMaskImage: FADE_BEFORE_FLOOR,
        }}
      />

      {/* FALLOFF + VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{ background: `${VIGNETTE}, ${LIGHT_FALLOFF}` }}
      />

      {/* FILM GRAIN */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: GRAIN }}
      />
    </div>
  )
}

/* ============================================================= */
/* ORNAMENTS — beda untuk tiap variant                           */
/* ============================================================= */

function Ornament({
  variant,
  accentA,
  accentB,
}: {
  variant: DarkCardVariant
  accentA: string
  accentB: string
}) {
  // id per variant. Kalau ada beberapa card dengan variant sama,
  // definisinya identik jadi aman dipakai bersama.
  const id = `dcs-${variant}`
  const fill = `url(#${id}-fill)`
  const soft = `url(#${id}-soft)`
  const glow = `url(#${id}-glow)`

  const defs = (
    <defs>
      {/* Fill utama: accentA -> accentB */}
      <linearGradient id={`${id}-fill`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={accentA} stopOpacity=".9" />
        <stop offset="1" stopColor={accentB} stopOpacity=".4" />
      </linearGradient>

      {/* Fill lembut untuk area besar */}
      <linearGradient id={`${id}-soft`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor={accentA} stopOpacity=".34" />
        <stop offset="1" stopColor={accentB} stopOpacity=".06" />
      </linearGradient>

      {/* Glow halus di belakang objek */}
      <radialGradient id={`${id}-glow`} cx=".5" cy=".5" r=".5">
        <stop offset="0" stopColor={accentA} stopOpacity=".3" />
        <stop offset="1" stopColor={accentA} stopOpacity="0" />
      </radialGradient>
    </defs>
  )

  if (variant === 'sky') {
    // Progress ring: track tebal + arc terisi + inti bercahaya
    return (
      <>
        {defs}

        <circle cx="32" cy="32" r="30" fill={glow} />

        {/* track */}
        <circle
          cx="32"
          cy="32"
          r="20.5"
          stroke="#ffffff"
          strokeOpacity=".07"
          strokeWidth="7"
        />
        <circle cx="32" cy="32" r="24" stroke="#ffffff" strokeOpacity=".12" />
        <circle cx="32" cy="32" r="17" stroke="#ffffff" strokeOpacity=".08" />

        {/* progress arc terisi */}
        <path
          d="M32 8A24 24 0 0 1 56 32L49 32A17 17 0 0 0 32 15Z"
          fill={fill}
          stroke={accentA}
          strokeOpacity=".5"
          strokeWidth=".8"
          strokeLinejoin="round"
        />
        <circle cx="56" cy="32" r="2.4" fill={accentA} />

        {/* inti */}
        <circle
          cx="32"
          cy="32"
          r="11"
          fill={soft}
          stroke={accentB}
          strokeOpacity=".4"
        />
        <circle cx="32" cy="32" r="3.2" fill={accentA} />
        <circle cx="30.8" cy="30.8" r="1" fill="#ffffff" fillOpacity=".7" />

        <path
          d="M32 2V6M32 58V62M2 32H6M58 32H62"
          stroke="#ffffff"
          strokeOpacity=".2"
          strokeLinecap="round"
        />
      </>
    )
  }

  if (variant === 'rose') {
    // Bintang 4 sudut terisi + sparkle kecil + orbit titik
    return (
      <>
        {defs}

        <circle cx="32" cy="32" r="30" fill={glow} />

        <circle
          cx="32"
          cy="32"
          r="26"
          stroke={accentB}
          strokeOpacity=".32"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />

        {/* bintang utama */}
        <path
          d="M32 12C33.2 25 38.5 30.8 52 32C38.5 33.2 33.2 39 32 52C30.8 39 25.5 33.2 12 32C25.5 30.8 30.8 25 32 12Z"
          fill={fill}
          stroke={accentA}
          strokeOpacity=".7"
          strokeWidth=".9"
          strokeLinejoin="round"
        />
        {/* highlight tengah */}
        <path
          d="M32 22C32.5 28.5 35.5 31.5 42 32C35.5 32.5 32.5 35.5 32 42C31.5 35.5 28.5 32.5 22 32C28.5 31.5 31.5 28.5 32 22Z"
          fill="#ffffff"
          fillOpacity=".22"
        />
        <circle cx="32" cy="32" r="2" fill="#ffffff" fillOpacity=".85" />

        {/* sparkle kecil */}
        <path
          d="M52 8C52.3 12 53.7 13.4 58 13.8C53.7 14.2 52.3 15.6 52 19.6C51.7 15.6 50.3 14.2 46 13.8C50.3 13.4 51.7 12 52 8Z"
          fill={accentB}
          fillOpacity=".9"
        />
        <path
          d="M11 44C11.2 46.4 12 47.2 14.6 47.4C12 47.6 11.2 48.4 11 50.8C10.8 48.4 10 47.6 7.4 47.4C10 47.2 10.8 46.4 11 44Z"
          fill={accentA}
          fillOpacity=".85"
        />
        <circle cx="54" cy="48" r="1.3" fill={accentA} fillOpacity=".8" />
      </>
    )
  }

  if (variant === 'violet') {
    // Love: hati terisi gradient + highlight + hati kecil melayang
    return (
      <>
        {defs}

        <circle cx="32" cy="32" r="30" fill={glow} />

        <circle
          cx="32"
          cy="32"
          r="27"
          stroke={accentB}
          strokeOpacity=".28"
          strokeDasharray="1 5"
          strokeLinecap="round"
        />

        {/* hati utama */}
        <path
          d="M32 52C32 52 12 40 12 26C12 19 17 14 23 14C27 14 30 16 32 19C34 16 37 14 41 14C47 14 52 19 52 26C52 40 32 52 32 52Z"
          fill={fill}
          stroke={accentA}
          strokeOpacity=".75"
          strokeWidth="1"
          strokeLinejoin="round"
        />
        {/* kilau di sisi kiri atas */}
        <path
          d="M19 25C19 21.8 21.2 19.6 24 19.6"
          stroke="#ffffff"
          strokeOpacity=".5"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <circle cx="19.2" cy="29.2" r="1" fill="#ffffff" fillOpacity=".5" />

        {/* hati kecil */}
        <path
          d="M51 18C51 18 45.5 14.8 45.5 11.4C45.5 9.7 46.8 8.6 48.2 8.6C49.3 8.6 50.4 9.2 51 10.3C51.6 9.2 52.7 8.6 53.8 8.6C55.2 8.6 56.5 9.7 56.5 11.4C56.5 14.8 51 18 51 18Z"
          fill={accentB}
          fillOpacity=".9"
        />

        <circle cx="10" cy="50" r="1.6" fill={accentA} fillOpacity=".85" />
        <circle cx="57" cy="46" r="1.2" fill={accentB} fillOpacity=".8" />
      </>
    )
  }

  if (variant === 'white') {
    // Timbangan: balok, tiang, dan piringan semua terisi
    return (
      <>
        {defs}

        <circle cx="32" cy="32" r="30" fill={glow} />
        <circle cx="32" cy="32" r="28" stroke="#ffffff" strokeOpacity=".08" />

        {/* alas */}
        <rect
          x="20"
          y="52"
          width="24"
          height="4.5"
          rx="2.25"
          fill={fill}
          stroke={accentA}
          strokeOpacity=".5"
          strokeWidth=".7"
        />
        {/* tiang meruncing */}
        <path
          d="M30.4 16H33.6L34.8 52H29.2Z"
          fill={soft}
          stroke={accentA}
          strokeOpacity=".45"
          strokeWidth=".7"
          strokeLinejoin="round"
        />

        {/* tali piringan */}
        <path
          d="M12 19L4 36M12 19L20 36M52 9L44 26M52 9L60 26"
          stroke={accentB}
          strokeOpacity=".5"
          strokeWidth=".9"
          strokeLinecap="round"
        />

        {/* balok */}
        <path
          d="M12 19L52 9"
          stroke={accentA}
          strokeOpacity=".95"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* piringan kiri */}
        <path
          d="M3.5 36H20.5C20.5 41 16.8 44.5 12 44.5C7.2 44.5 3.5 41 3.5 36Z"
          fill={fill}
          stroke={accentA}
          strokeOpacity=".6"
          strokeWidth=".8"
          strokeLinejoin="round"
        />
        {/* piringan kanan */}
        <path
          d="M43.5 26H60.5C60.5 31 56.8 34.5 52 34.5C47.2 34.5 43.5 31 43.5 26Z"
          fill={fill}
          stroke={accentA}
          strokeOpacity=".6"
          strokeWidth=".8"
          strokeLinejoin="round"
        />

        {/* poros */}
        <circle
          cx="32"
          cy="14"
          r="5"
          fill={soft}
          stroke={accentA}
          strokeOpacity=".5"
          strokeWidth=".8"
        />
        <circle cx="32" cy="14" r="2.6" fill={accentA} />
        <circle cx="31.2" cy="13.2" r=".8" fill="#ffffff" fillOpacity=".8" />
        <circle cx="32" cy="7" r="1.4" fill={accentB} fillOpacity=".8" />
      </>
    )
  }

  // default: orb dengan cincin konsentris
  return (
    <>
      {defs}

      <circle cx="32" cy="32" r="30" fill={glow} />

      <circle
        cx="32"
        cy="32"
        r="23"
        fill={soft}
        stroke="#ffffff"
        strokeOpacity=".14"
      />
      <circle
        cx="32"
        cy="32"
        r="17"
        stroke={accentA}
        strokeOpacity=".45"
        strokeDasharray="2 6"
        strokeLinecap="round"
      />
      <circle
        cx="32"
        cy="32"
        r="10"
        fill={fill}
        stroke={accentB}
        strokeOpacity=".6"
        strokeWidth=".9"
      />
      <circle cx="28.8" cy="28.8" r="3" fill="#ffffff" fillOpacity=".28" />

      <circle cx="48" cy="21" r="2.4" fill={accentA} />
      <circle cx="20" cy="46" r="2" fill={accentB} />
      <circle cx="49" cy="46" r="1" fill={accentA} fillOpacity=".7" />
    </>
  )
}

/* ============================================================= */
/* SHELL                                                         */
/* ============================================================= */

interface DarkCardShellProps {
  children: ReactNode
  variant?: DarkCardVariant
  /** Untuk card setengah lebar (2 kolom) */
  compact?: boolean
  /**
   * Titik dinding menyatu dengan lantai (% tinggi card).
   * Makin besar = dinding berwarna makin tinggi, lantai gelap makin pendek.
   */
  horizon?: number
}

export default function DarkCardShell({
  children,
  variant = 'default',
  compact = false,
  horizon = 68,
}: DarkCardShellProps) {
  const v = VARIANTS[variant]

  return (
    <div
      className={`relative isolate overflow-hidden border bg-black shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)] ${v.border} ${
        compact ? 'flex flex-col rounded-[1.5rem]' : 'rounded-[2rem]'
      }`}
    >
      {/* gradient studio (dinding -> lantai) */}
      <StudioGradient variant={variant} horizon={horizon} />

      <svg
        className={`pointer-events-none absolute ${
          compact
            ? '-bottom-5 -right-5 size-24 opacity-50'
            : 'right-8 top-8 size-16 opacity-[0.6]'
        }`}
        viewBox="0 0 64 64"
        fill="none"
        aria-hidden="true"
      >
        <Ornament variant={variant} accentA={v.accentA} accentB={v.accentB} />
      </svg>

      <div
        className={
          compact
            ? 'relative flex flex-1 flex-col p-4 sm:p-5'
            : 'relative p-5 sm:p-6'
        }
      >
        {children}
      </div>
    </div>
  )
}