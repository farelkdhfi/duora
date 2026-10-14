import type { ReactNode } from 'react'

export type DarkCardVariant = 'default' | 'sky' | 'rose' | 'violet' | 'white'

interface VariantStyle {
  background: string
  border: string
  accentA: string
  accentB: string
}

/* Gradient kecil & lembut di pojok, sisanya hitam */
const VARIANTS: Record<DarkCardVariant, VariantStyle> = {
  /* Biru kanan atas + pink kiri bawah (PartnerCheckinCard) */
  default: {
    background: [
      'radial-gradient(ellipse 45% 40% at 100% 0%, rgba(90,130,210,0.10) 0%, rgba(90,130,210,0) 100%)',
      'radial-gradient(ellipse 45% 40% at 0% 100%, rgba(214,100,150,0.08) 0%, rgba(214,100,150,0) 100%)',
      'linear-gradient(to bottom, #0c0c10 0%, #000000 100%)',
    ].join(', '),
    border: 'border-white/[0.07]',
    accentA: '#e9a8bd',
    accentB: '#9eb9df',
  },

  /* Sky / biru lembut (Goals) */
  sky: {
    background: [
      'radial-gradient(ellipse 50% 42% at 100% 0%, rgba(110,160,235,0.11) 0%, rgba(110,160,235,0) 100%)',
      'radial-gradient(ellipse 40% 34% at 0% 100%, rgba(125,211,230,0.05) 0%, rgba(125,211,230,0) 100%)',
      'linear-gradient(to bottom, #090b10 0%, #000000 100%)',
    ].join(', '),
    border: 'border-sky-200/[0.09]',
    accentA: '#9cc4f5',
    accentB: '#8adbe8',
  },

  /* Rose / pink lembut (Planner) */
  rose: {
    background: [
      'radial-gradient(ellipse 50% 42% at 100% 0%, rgba(236,140,180,0.10) 0%, rgba(236,140,180,0) 100%)',
      'radial-gradient(ellipse 40% 34% at 0% 100%, rgba(190,150,235,0.06) 0%, rgba(190,150,235,0) 100%)',
      'linear-gradient(to bottom, #100a0d 0%, #000000 100%)',
    ].join(', '),
    border: 'border-rose-200/[0.09]',
    accentA: '#f3b6cd',
    accentB: '#cfb4f0',
  },

  /* Violet / ungu lembut (Q&A) */
  violet: {
    background: [
      'radial-gradient(ellipse 50% 42% at 100% 0%, rgba(167,139,250,0.12) 0%, rgba(167,139,250,0) 100%)',
      'radial-gradient(ellipse 40% 34% at 0% 100%, rgba(232,121,249,0.05) 0%, rgba(232,121,249,0) 100%)',
      'linear-gradient(to bottom, #0b0914 0%, #000000 100%)',
    ].join(', '),
    border: 'border-violet-200/[0.09]',
    accentA: '#c4b5fd',
    accentB: '#e9a8f5',
  },

  /* White / putih lembut (Debates) */
  white: {
    background: [
      'radial-gradient(ellipse 50% 42% at 100% 0%, rgba(255,255,255,0.10) 0%, rgba(255,255,255,0) 100%)',
      'radial-gradient(ellipse 40% 34% at 0% 100%, rgba(220,220,220,0.05) 0%, rgba(220,220,220,0) 100%)',
      'linear-gradient(to bottom, #0d0d0d 0%, #000000 100%)',
    ].join(', '),
    border: 'border-white/[0.09]',
    accentA: '#f5f5f5',
    accentB: '#cfcfcf',
  },
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
}

export default function DarkCardShell({
  children,
  variant = 'default',
  compact = false,
}: DarkCardShellProps) {
  const v = VARIANTS[variant]

  return (
    <div
      className={`relative overflow-hidden border bg-black shadow-[0_20px_60px_-35px_rgba(0,0,0,0.6)] ${v.border} ${
        compact ? 'flex flex-col rounded-[1.5rem]' : 'rounded-[2rem]'
      }`}
      style={{ backgroundImage: v.background }}
    >
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