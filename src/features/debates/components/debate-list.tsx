'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  GalleryHorizontal,
  List,
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import {
  useDebates,
  useDeleteDebate,
} from '../queries'
import { AiPersona } from '../types'

import {
  useMySubscription,
  useDebateRoomsCreatedThisMonth,
} from '@/features/subscription/queries'

import lembutAi from '@/assets/ai-persona/lembut-ai.png'
import formalAi from '@/assets/ai-persona/formal-ai.png'
import nyeletukAi from '@/assets/ai-persona/nyeletuk-ai.png'
import lebayAi from '@/assets/ai-persona/lebay-ai.png'
import CreateDebateModal from './create-debate-modal'

interface DebateListProps {
  relationshipId: string
}

type DebateFilter =
  | 'all'
  | 'today'
  | 'in_progress'
  | 'resolved'

type ViewMode = 'cards' | 'list'

type Debate = NonNullable<
  ReturnType<typeof useDebates>['data']
>[number]

const statusConfig = {
  active: {
    label: 'Active',
    dot: 'bg-emerald-400',
    className: 'bg-emerald-50 text-emerald-600',
  },
  pending_verdict: {
    label: 'Thinking',
    dot: 'bg-amber-400',
    className: 'bg-amber-50 text-amber-600',
  },
  resolved: {
    label: 'Resolved',
    dot: 'bg-neutral-400',
    className: 'bg-neutral-100 text-neutral-500',
  },
  archived: {
    label: 'Archived',
    dot: 'bg-neutral-300',
    className: 'bg-neutral-100/70 text-neutral-400',
  },
}

const personaOptions: {
  value: AiPersona
  label: string
  description: string
  image: typeof lembutAi
}[] = [
    {
      value: 'formal',
      label: 'Formal',
      description: 'Neutral & structured',
      image: formalAi,
    },
    {
      value: 'lembut',
      label: 'Lembut',
      description: 'Calm & empathetic',
      image: lembutAi,
    },
    {
      value: 'kasar',
      label: 'Nyeletuk',
      description: 'Casual & witty',
      image: nyeletukAi,
    },
    {
      value: 'lebay',
      label: 'Lebay',
      description: 'Expressive & dramatic',
      image: lebayAi,
    },
  ]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function getPersona(aiPersona: AiPersona) {
  return (
    personaOptions.find(
      (persona) => persona.value === aiPersona,
    ) ?? personaOptions[0]
  )
}

function isToday(dateString: string) {
  const date = new Date(dateString)
  const today = new Date()

  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  )
}

/* -------------------------------------------------------------------------- */
/*  Delete control (dipakai oleh list item & card)                            */
/* -------------------------------------------------------------------------- */

function DeleteControl({
  debateId,
  debateTitle,
  relationshipId,
  className,
}: {
  debateId: string
  debateTitle: string
  relationshipId: string
  className?: string
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] =
    useState(false)

  const deleteDebateMutation =
    useDeleteDebate(relationshipId)

  const handleDeleteClick = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteDebateMutation.mutate(debateId)
  }

  const handleCancelDelete = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    setIsConfirmingDelete(false)
  }

  return (
    <div className={className}>
      {isConfirmingDelete ? (
        <div className="flex items-center gap-1 rounded-full border border-black/[0.05] bg-white p-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)]">
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={deleteDebateMutation.isPending}
            className="rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50"
          >
            {deleteDebateMutation.isPending
              ? '...'
              : 'Delete'}
          </button>

          <button
            type="button"
            onClick={handleCancelDelete}
            disabled={deleteDebateMutation.isPending}
            aria-label="Cancel delete"
            className="rounded-full px-2 py-1.5 text-xs font-semibold text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-700 disabled:opacity-50"
          >
            <X
              size={10}
              strokeWidth={2}
            />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleDeleteClick}
          aria-label={`Delete ${debateTitle}`}
          className="flex size-8 items-center justify-center rounded-full border border-black/20 bg-white text-neutral-400 shadow-[0_5px_20px_-12px_rgba(0,0,0,0.25)] transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
        >
          <Trash2
            size={12}
            strokeWidth={1.7}
          />
        </button>
      )}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  List item (tampilan list)                                                 */
/* -------------------------------------------------------------------------- */

function DebateListItem({
  debate,
  relationshipId,
}: {
  debate: Debate
  relationshipId: string
}) {
  const persona = getPersona(debate.ai_persona)
  const status = statusConfig[debate.status]

  return (
    <div className="group relative">
      <Link
        href={`/debates/${debate.id}`}
        className="relative block overflow-hidden rounded-[1.6rem] border border-black/[0.055] bg-white px-4 py-4 shadow-[0_10px_35px_-28px_rgba(0,0,0,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[0.09] hover:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.2)] sm:px-5 sm:py-4.5"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 size-36 rounded-full bg-pink-300/[0.06] blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute -left-16 -bottom-20 size-36 rounded-full bg-blue-300/[0.05] blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-center gap-3.5">
          <div className="flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src={persona.image}
              alt={persona.label}
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold tracking-[-0.025em] text-neutral-900 sm:text-[14px]">
              {debate.title}
            </h3>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs font-medium text-neutral-400">
                {persona.label}
              </span>

              <span className="text-xs text-neutral-200">
                ·
              </span>

              <span className="text-[10px] text-neutral-300">
                {formatDate(debate.created_at)}
              </span>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <span
              className={`hidden items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold sm:flex ${status.className}`}
            >
              <span
                className={`size-1.5 rounded-full ${status.dot} ${debate.status === 'active'
                    ? 'animate-pulse'
                    : ''
                  }`}
              />

              {status.label}
            </span>
          </div>
        </div>
      </Link>

      <DeleteControl
        debateId={debate.id}
        debateTitle={debate.title}
        relationshipId={relationshipId}
        className="absolute right-0 top-0 z-10 -translate-y-1/2 sm:right-[3.75rem]"
      />
    </div>
  )
}

// ============================================================
// 1. TIPE + THEME KARTU
// ============================================================
type CardTheme = {
  card: string
  wall: string // RGB triplet, warna kertas backdrop
  shade: string // RGB triplet, versi lebih gelap untuk falloff & cove
  glow: string
  accentText: string
  button: string
}

const cardThemes: Record<string, CardTheme> = {
  formal: {
    card: 'border-neutral-200 shadow-[0_20px_50px_-30px_rgba(0,0,0,0.3)] hover:border-neutral-300',
    wall: '236, 238, 237',
    shade: '170, 175, 173',
    glow: 'bg-neutral-300/50',
    accentText: 'text-neutral-600',
    button: 'bg-neutral-900',
  },
  kasar: {
    card: 'border-red-100 shadow-[0_20px_50px_-30px_rgba(220,38,38,0.4)] hover:border-red-200',
    wall: '255, 195, 195',
    shade: '210, 100, 100',
    glow: 'bg-red-300/50',
    accentText: 'text-red-600',
    button: 'bg-red-500',
  },
  lebay: {
    card: 'border-blue-100 shadow-[0_20px_50px_-30px_rgba(37,99,235,0.4)] hover:border-blue-200',
    wall: '190, 220, 255',
    shade: '90, 145, 210',
    glow: 'bg-blue-300/50',
    accentText: 'text-blue-600',
    button: 'bg-blue-500',
  },
  lembut: {
    card: 'border-pink-100 shadow-[0_20px_50px_-30px_rgba(236,72,153,0.4)] hover:border-pink-200',
    wall: '255, 220, 235',
    shade: '225, 130, 175',
    glow: 'bg-pink-300/50',
    accentText: 'text-pink-600',
    button: 'bg-pink-500',
  },
}

function getCardTheme(aiPersona: AiPersona) {
  return cardThemes[aiPersona] ?? cardThemes.formal
}

// ============================================================
// 2. BACKDROP STUDIO UNTUK KARTU
// ============================================================

// Tinggi (%) card tempat dinding "meleleh" ke lantai.
// Atur supaya pas di belakang kaki persona.
const CARD_HORIZON = 62

type CardStop = [position: number, alpha: number]

const cardRgba = (rgb: string, alpha: number) => `rgba(${rgb}, ${alpha})`

const cardVertical = (rgb: string, stops: CardStop[], offset = 0) =>
  `linear-gradient(to bottom, ${stops
    .map(([position, alpha]) => `${cardRgba(rgb, alpha)} ${position + offset}%`)
    .join(', ')})`

// Wall colour yang fade pelan ke lantai, tanpa garis potong.
const CARD_WALL_TO_FLOOR: CardStop[] = [
  [0, 0.92], [12, 0.9], [24, 0.84], [36, 0.7], [47, 0.5],
  [57, 0.32], [67, 0.18], [78, 0.08], [90, 0.02], [100, 0],
]

// Cahaya meredup ke arah atas.
const CARD_CEILING_FALLOFF: CardStop[] = [
  [0, 0.12], [8, 0.08], [16, 0.045], [26, 0.015], [34, 0],
]

// Cove: band shade lembut di tempat dinding melengkung ke lantai.
// Posisi relatif terhadap CARD_HORIZON.
const CARD_COVE: CardStop[] = [
  [-26, 0], [-18, 0.025], [-10, 0.065], [-3, 0.1], [3, 0.11], [10, 0.08], [18, 0.04], [27, 0],
]

// Bloom key light di dinding, tepat di atas persona.
const CARD_KEY_LIGHT =
  'radial-gradient(ellipse 72% 42% at 50% 30%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.34) 28%, rgba(255,255,255,0.15) 55%, rgba(255,255,255,0.04) 80%, rgba(255,255,255,0) 100%)'

// Bayangan lantai berwarna di bawah persona (ukuran ellipse disesuaikan buat card).
const cardFloorShade = (rgb: string) =>
  `radial-gradient(ellipse 200px 60px at 50% ${CARD_HORIZON + 3}%, ${cardRgba(rgb, 0.2)} 0%, ${cardRgba(rgb, 0.1)} 40%, ${cardRgba(rgb, 0.03)} 75%, ${cardRgba(rgb, 0)} 100%)`

// Cahaya studio miring dari kiri atas.
const CARD_SIDE_LIGHT =
  'linear-gradient(112deg, rgba(255,255,255,0.42) 0%, rgba(255,255,255,0.2) 26%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 68%)'

const CARD_LIGHT_CONE =
  'conic-gradient(from 0deg at -10% -16%, rgba(255,255,255,0) 104deg, rgba(255,255,255,0.05) 114deg, rgba(255,255,255,0.13) 124deg, rgba(255,255,255,0.22) 134deg, rgba(255,255,255,0.26) 141deg, rgba(255,255,255,0.21) 149deg, rgba(255,255,255,0.11) 160deg, rgba(255,255,255,0.04) 171deg, rgba(255,255,255,0) 182deg)'

// Biar cahaya miring hilang sendiri sebelum sampai lantai.
const CARD_FADE_BEFORE_FLOOR =
  'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

// Sisi yang tidak kena cahaya sedikit lebih gelap + vignette halus.
const CARD_LIGHT_FALLOFF =
  'linear-gradient(292deg, rgba(24,24,32,0.05) 0%, rgba(24,24,32,0.022) 30%, rgba(24,24,32,0) 55%)'
const CARD_VIGNETTE =
  'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(24,24,32,0) 50%, rgba(24,24,32,0.026) 78%, rgba(24,24,32,0.052) 100%)'

// Film grain: nyamarin banding gradient + kesan matte fotografis.
const CARD_GRAIN = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='g'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 .55 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23g)'/%3E%3C/svg%3E")`

const buildCardBackdrop = (wall: string, shade: string) =>
  [
    cardFloorShade(shade),
    cardVertical(shade, CARD_COVE, CARD_HORIZON),
    cardVertical(shade, CARD_CEILING_FALLOFF),
    CARD_KEY_LIGHT,
    cardVertical(wall, CARD_WALL_TO_FLOOR),
  ].join(', ')

function CardBackdrop({ wall, shade }: { wall: string; shade: string }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-[#fafaf9]">
      {/* WALL + CURVED COVE + FLOOR */}
      <div className="absolute inset-0" style={{ background: buildCardBackdrop(wall, shade) }} />

      {/* ANGLED STUDIO LIGHT (fade out sebelum lantai) */}
      <div
        className="absolute inset-0"
        style={{
          background: `${CARD_LIGHT_CONE}, ${CARD_SIDE_LIGHT}`,
          maskImage: CARD_FADE_BEFORE_FLOOR,
          WebkitMaskImage: CARD_FADE_BEFORE_FLOOR,
        }}
      />

      {/* LIGHT FALLOFF + VIGNETTE */}
      <div
        className="absolute inset-0"
        style={{ background: `${CARD_VIGNETTE}, ${CARD_LIGHT_FALLOFF}` }}
      />

      {/* FILM GRAIN */}
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: CARD_GRAIN }} />
    </div>
  )
}

// ============================================================
// 3. DEBATE CARD
// ============================================================
function DebateCard({
  debate,
  relationshipId,
}: {
  debate: Debate
  relationshipId: string
}) {
  const persona = getPersona(debate.ai_persona)
  const status = statusConfig[debate.status]
  const theme = getCardTheme(debate.ai_persona)

  return (
    <div className="group relative flex w-[88%] shrink-0 min-h-90 snap-center sm:w-[340px]">
      <Link
        href={`/debates/${debate.id}`}
        className={`relative flex flex-1 flex-col items-center overflow-hidden rounded-[2rem] border pb-5 pt-17 transition-all duration-300 hover:-translate-y-0.5 ${theme.card}`}
      >
        {/* STUDIO BACKDROP (paling pertama di dalam Link) */}
        <CardBackdrop wall={theme.wall} shade={theme.shade} />

        {/* PERSONA IMAGE (2/4 lebar card) */}
        <div className="relative aspect-square w-2/4">
          <div
            className={`pointer-events-none absolute inset-[10%] rounded-full blur-2xl ${theme.glow}`}
          />

          <Image
            src={persona.image}
            alt={persona.label}
            fill
            sizes="(max-width: 640px) 66vw, 255px"
            className="object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.12)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* TITLE + PERSONA */}
        <div className="relative mt-3 w-full px-5 text-center">
          <h3 className="line-clamp-2 min-h-[3.1rem] text-lg font-semibold leading-snug tracking-[-0.03em] text-neutral-900">
            {debate.title}
          </h3>

          <p className="mt-1.5 text-xs text-neutral-500">
            <span className={`font-semibold ${theme.accentText}`}>
              {persona.label}
            </span>
            <span className="mx-1.5 text-neutral-300">·</span>
            {persona.description}
          </p>
        </div>

        {/* STATUS DOT + DATE */}
        <div className="relative mt-4 flex items-center justify-center gap-2 px-5">
          <span
            role="img"
            aria-label={status.label}
            title={status.label}
            className={`size-2 rounded-full ${status.dot} ${
              debate.status === 'active' ? 'animate-pulse' : ''
            }`}
          />

          <span className="text-xs text-neutral-400">
            {formatDate(debate.created_at)}
          </span>
        </div>
      </Link>

      <DeleteControl
        debateId={debate.id}
        debateTitle={debate.title}
        relationshipId={relationshipId}
        className="absolute right-3 top-3 z-10"
      />
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Carousel (swipe horizontal dengan scroll-snap)                            */
/* -------------------------------------------------------------------------- */

function DebateCarousel({
  debates,
  relationshipId,
}: {
  debates: Debate[]
  relationshipId: string
}) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const total = debates.length
  const currentIndex = Math.min(activeIndex, total - 1)
  const activeDebate = debates[currentIndex]

  const updateScrollState = useCallback(() => {
    const scroller = scrollerRef.current

    if (!scroller) {
      return
    }

    const items = Array.from(
      scroller.children,
    ) as HTMLElement[]

    if (!items.length) {
      return
    }

    const maxScrollLeft =
      scroller.scrollWidth - scroller.clientWidth

    setCanPrev(scroller.scrollLeft > 4)
    setCanNext(scroller.scrollLeft < maxScrollLeft - 4)

    if (scroller.scrollLeft <= 4) {
      setActiveIndex(0)
      return
    }

    if (scroller.scrollLeft >= maxScrollLeft - 4) {
      setActiveIndex(items.length - 1)
      return
    }

    const scrollerCenter =
      scroller.scrollLeft + scroller.clientWidth / 2

    let closestIndex = 0
    let closestDistance = Number.POSITIVE_INFINITY

    items.forEach((item, index) => {
      const itemCenter =
        item.offsetLeft + item.offsetWidth / 2
      const distance = Math.abs(
        scrollerCenter - itemCenter,
      )

      if (distance < closestDistance) {
        closestDistance = distance
        closestIndex = index
      }
    })

    setActiveIndex(closestIndex)
  }, [])

  useEffect(() => {
    updateScrollState()

    window.addEventListener('resize', updateScrollState)

    return () => {
      window.removeEventListener(
        'resize',
        updateScrollState,
      )
    }
  }, [updateScrollState, total])

  const scrollToIndex = (index: number) => {
    const scroller = scrollerRef.current
    const target = scroller?.children[index] as
      | HTMLElement
      | undefined

    if (!scroller || !target) {
      return
    }

    scroller.scrollTo({
      left:
        target.offsetLeft -
        (scroller.clientWidth - target.offsetWidth) / 2,
      behavior: 'smooth',
    })
  }

  return (
    <div>
      <div
        ref={scrollerRef}
        onScroll={updateScrollState}
        className="relative flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain scroll-smooth px-1 pb-5 scrollbar-none"
      >
        {debates.map((debate) => (
          <DebateCard
            key={debate.id}
            debate={debate}
            relationshipId={relationshipId}
          />
        ))}
      </div>

      {/* TOTAL PAGES */}
      {total > 1 && (
        <div className="flex items-center justify-center px-1 sm:justify-between">
          {total <= 6 ? (
            <div className="flex items-center gap-1.5">
              {debates.map((debate, index) => (
                <button
                  key={debate.id}
                  type="button"
                  onClick={() => scrollToIndex(index)}
                  aria-label={`Go to debate ${index + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                      ? 'w-5 bg-neutral-800'
                      : 'w-1.5 bg-neutral-200 hover:bg-neutral-300'
                    }`}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs font-medium text-neutral-400">
              {currentIndex + 1} / {total}
            </span>
          )}

          {(canPrev || canNext) && (
            <div className="hidden items-center gap-1.5 sm:flex">
              <button
                type="button"
                onClick={() =>
                  scrollToIndex(
                    Math.max(0, currentIndex - 1),
                  )
                }
                disabled={!canPrev}
                aria-label="Previous debate"
                className="flex size-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft
                  size={14}
                  strokeWidth={1.8}
                />
              </button>

              <button
                type="button"
                onClick={() =>
                  scrollToIndex(
                    Math.min(total - 1, currentIndex + 1),
                  )
                }
                disabled={!canNext}
                aria-label="Next debate"
                className="flex size-8 items-center justify-center rounded-full border border-black/[0.06] bg-white text-neutral-500 transition hover:bg-neutral-50 hover:text-neutral-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight
                  size={14}
                  strokeWidth={1.8}
                />
              </button>
            </div>
          )}
        </div>
      )}

      {/* OPEN DEBATE (membuka debat yang sedang aktif di carousel) */}
      <Link
        href={`/debates/${activeDebate.id}`}
        className={`mx-auto w-40 flex h-12 items-center justify-center gap-1.5 rounded-full bg-neutral-800 text-sm font-semibold text-white transition-all duration-200 hover:bg-black active:scale-[0.98] sm:w-[340px] ${total > 1 ? 'mt-4' : ''
          }`}
      >
        Open debate
      </Link>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  View mode toggle                                                          */
/* -------------------------------------------------------------------------- */

function ViewModeToggle({
  value,
  onChange,
}: {
  value: ViewMode
  onChange: (mode: ViewMode) => void
}) {
  const options = [
    {
      mode: 'cards',
      label: 'Card view',
      Icon: GalleryHorizontal,
    },
    {
      mode: 'list',
      label: 'List view',
      Icon: List,
    },
  ] as const

  return (
    <div
      role="group"
      aria-label="Debate view mode"
      className="flex items-center gap-0.5 rounded-full bg-neutral-100/80 p-1"
    >
      {options.map(({ mode, label, Icon }) => {
        const isActive = value === mode

        return (
          <button
            key={mode}
            type="button"
            onClick={() => onChange(mode)}
            aria-label={label}
            aria-pressed={isActive}
            title={label}
            className={`flex size-7 items-center justify-center rounded-full transition-all duration-200 ${isActive
                ? 'bg-white text-neutral-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.2)]'
                : 'text-neutral-400 hover:text-neutral-600'
              }`}
          >
            <Icon
              size={13}
              strokeWidth={1.8}
            />
          </button>
        )
      })}
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Hook: bikin elemen setinggi sisa layar (dari posisinya sampai bawah)      */
/* -------------------------------------------------------------------------- */

function getScrollParent(node: HTMLElement) {
  let parent = node.parentElement

  while (parent) {
    if (/(auto|scroll|overlay)/.test(getComputedStyle(parent).overflowY)) {
      return parent
    }

    parent = parent.parentElement
  }

  return null
}

function useFillViewportHeight(
  element: HTMLElement | null,
  bottomGap = 24,
) {
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    if (!element) {
      return
    }

    const scrollParent = getScrollParent(element)

    const measure = () => {
      const rect = element.getBoundingClientRect()

      const scrollTop = scrollParent
        ? scrollParent.scrollTop
        : window.scrollY

      // batas bawah area yang terlihat (tidak boleh melebihi tinggi layar)
      const visibleBottom = scrollParent
        ? Math.min(
          scrollParent.getBoundingClientRect().bottom,
          window.innerHeight,
        )
        : window.innerHeight

      // posisi atas elemen saat scroll berada di paling atas
      const top = rect.top + scrollTop

      setHeight(
        Math.max(0, Math.floor(visibleBottom - top - bottomGap)),
      )
    }

    measure()

    window.addEventListener('resize', measure)

    const observer = new ResizeObserver(measure)
    observer.observe(document.body)

    if (scrollParent) {
      observer.observe(scrollParent)
    }

    return () => {
      window.removeEventListener('resize', measure)
      observer.disconnect()
    }
  }, [element, bottomGap])

  return height
}


/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */


export default function DebateList({
  relationshipId,
}: DebateListProps) {
  const { data: debates, isLoading } =
    useDebates(relationshipId)

  const { data: subscription } =
    useMySubscription()

  const { data: roomsThisMonth } =
    useDebateRoomsCreatedThisMonth(relationshipId)

  const [showCreate, setShowCreate] =
    useState(false)

  const [activeFilter, setActiveFilter] =
    useState<DebateFilter>('all')

  const [viewMode, setViewMode] =
    useState<ViewMode>('cards')

  const [contentEl, setContentEl] =
    useState<HTMLDivElement | null>(null)

  const fillHeight = useFillViewportHeight(contentEl, 24)

  const maxRoomsPerMonth = subscription
    ? subscription.max_debate_rooms_per_month
    : 3

  const isRoomLimitReached =
    maxRoomsPerMonth !== null &&
    (roomsThisMonth ?? 0) >= maxRoomsPerMonth

  const handleCreateClick = () => {
    if (isRoomLimitReached) {
      return
    }

    setShowCreate(true)
  }

  if (isLoading) {
    if (viewMode === 'cards') {
      return (
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex gap-3 overflow-hidden px-1 pt-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[340px] w-[88%] shrink-0 animate-pulse rounded-[2rem] border border-black/[0.04] bg-neutral-100/70 sm:w-[340px]"
              />
            ))}
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-2.5">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-[84px] animate-pulse rounded-[1.6rem] border border-black/[0.04] bg-neutral-100/70"
          />
        ))}
      </div>
    )
  }

  const filteredDebates =
    debates?.filter((debate) => {
      if (activeFilter === 'all') {
        return true
      }

      if (activeFilter === 'today') {
        return isToday(debate.created_at)
      }

      if (activeFilter === 'in_progress') {
        return (
          debate.status === 'active' ||
          debate.status === 'pending_verdict'
        )
      }

      return (
        debate.status === 'resolved' ||
        debate.status === 'archived'
      )
    }) ?? []

  const filterOptions: {
    value: DebateFilter
    label: string
  }[] = [
      {
        value: 'all',
        label: 'All',
      },
      {
        value: 'today',
        label: 'Today',
      },
      {
        value: 'in_progress',
        label: 'In progress',
      },
      {
        value: 'resolved',
        label: 'Resolved',
      },
    ]

  return (
    <div className="flex flex-1 flex-col">
      {/* TOOLBAR */}
      <div className="mb-5 flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-neutral-100/80 p-1 scrollbar-none">
          {filterOptions.map((filter) => {
            const isActive =
              activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.value)
                }
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-3.5 sm:text-xs ${isActive
                    ? 'bg-white text-neutral-800 shadow-[0_2px_8px_-4px_rgba(0,0,0,0.2)]'
                    : 'text-neutral-400 hover:text-neutral-600'
                  }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>

        <button
          type="button"
          onClick={handleCreateClick}
          disabled={isRoomLimitReached}
          aria-label={
            isRoomLimitReached
              ? 'Monthly debate room limit reached'
              : 'Start a new debate'
          }
          title={
            isRoomLimitReached
              ? `Monthly limit reached (${roomsThisMonth ?? 0}/${maxRoomsPerMonth})`
              : 'Start a new debate'
          }
          className={`flex size-9 shrink-0 items-center justify-center rounded-full text-white transition-all duration-200 ${isRoomLimitReached
              ? 'cursor-not-allowed bg-neutral-200 text-neutral-400'
              : 'bg-neutral-800 hover:scale-105 hover:bg-black active:scale-95'
            }`}
        >
          <Plus
            size={15}
            strokeWidth={1.8}
          />
        </button>
      </div>

      <CreateDebateModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* CONTENT (di mode card: berada di tengah layar) */}
      {/* CONTENT (di mode card: penuh sampai bawah layar, isi di tengah) */}
            {/* INFO + VIEW TOGGLE (tetap di atas, tidak ikut ditengahkan) */}
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs text-neutral-400">
          {filteredDebates.length}{' '}
          {filteredDebates.length === 1
            ? 'debate'
            : 'debates'}
          <span className="mx-1.5 text-neutral-200">
            ·
          </span>
          <span className="font-medium text-neutral-300">
            AI mediated
          </span>
        </p>

        <ViewModeToggle
          value={viewMode}
          onChange={setViewMode}
        />
      </div>

      {/* CONTENT (di mode card: penuh sampai bawah layar, isi di tengah) */}
      <div
        ref={setContentEl}
        style={
          viewMode === 'cards' && fillHeight
            ? { minHeight: fillHeight }
            : undefined
        }
        className={`flex flex-col ${
          viewMode === 'cards' ? 'justify-center' : ''
        }`}
      >
        {/* EMPTY STATE */}
        {!filteredDebates.length && (
          <div className="relative overflow-hidden rounded-[1.8rem] border border-black/[0.05] bg-white px-6 py-12 text-center shadow-[0_15px_45px_-30px_rgba(0,0,0,0.15)]">
            <div className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-pink-300/[0.06] blur-[70px]" />

            <div className="pointer-events-none absolute -left-20 bottom-[-50px] size-44 rounded-full bg-blue-300/[0.05] blur-[70px]" />

            <div className="relative">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#faf9f6]">
                <Image
                  src={formalAi}
                  alt="Duora mediator"
                  width={34}
                  height={34}
                  className="size-[34px] object-contain"
                />
              </div>

              <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.03em] text-neutral-800">
                {activeFilter === 'all'
                  ? 'No debates yet.'
                  : activeFilter === 'today'
                    ? 'No debates today.'
                    : activeFilter === 'in_progress'
                      ? 'Nothing in progress.'
                      : 'No resolved debates.'}
              </h3>

              <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-neutral-400">
                {activeFilter === 'all'
                  ? 'Start your first debate whenever you need a little help finding common ground.'
                  : activeFilter === 'today'
                    ? 'Start a conversation whenever you need a little help finding common ground.'
                    : activeFilter === 'in_progress'
                      ? 'Your active debates will appear here.'
                      : 'Resolved conversations will appear here.'}
              </p>
            </div>
          </div>
        )}

        {/* DEBATES */}
        {Boolean(filteredDebates.length) &&
          (viewMode === 'cards' ? (
            <DebateCarousel
              key={activeFilter}
              debates={filteredDebates}
              relationshipId={relationshipId}
            />
          ) : (
            <div className="space-y-2.5">
              {filteredDebates.map((debate) => (
                <DebateListItem
                  key={debate.id}
                  debate={debate}
                  relationshipId={relationshipId}
                />
              ))}
            </div>
          ))}
      </div>
    </div>
  )
}