'use client'

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useFormatter, useTimeZone, useTranslations } from 'next-intl'

import { isSameZonedDay } from '@/lib/date'
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

const LIST_PAGE_SIZE = 10

const statusConfig = {
  active: {
    dot: 'bg-emerald-400',
    className: 'bg-emerald-400/10 text-emerald-400',
  },
  pending_verdict: {
    dot: 'bg-amber-400',
    className: 'bg-amber-400/10 text-amber-400',
  },
  resolved: {
    dot: 'bg-neutral-400',
    className: 'bg-white/[0.06] text-description',
  },
  archived: {
    dot: 'bg-neutral-500',
    className: 'bg-white/[0.04] text-description',
  },
}

const personaOptions: {
  value: AiPersona
  image: typeof lembutAi
}[] = [
    { value: 'formal', image: formalAi },
    { value: 'lembut', image: lembutAi },
    { value: 'kasar', image: nyeletukAi },
    { value: 'lebay', image: lebayAi },
  ]

function useFormatDate() {
  const format = useFormatter()

  return (dateString: string) =>
    format.dateTime(new Date(dateString), {
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
  const t = useTranslations('debates.list')
  const tCommon = useTranslations('common')

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
        <div className="flex items-center gap-1 rounded-full border border-white/10 bg-primary p-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.6)]">
          <button
            type="button"
            onClick={handleDeleteClick}
            disabled={deleteDebateMutation.isPending}
            className="rounded-full bg-red-500 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-red-600 disabled:opacity-50"
          >
            {deleteDebateMutation.isPending
              ? '...'
              : tCommon('delete')}
          </button>

          <button
            type="button"
            onClick={handleCancelDelete}
            disabled={deleteDebateMutation.isPending}
            aria-label={t('cancelDeleteAria')}
            className="rounded-full px-2 py-1.5 text-xs font-semibold text-description transition hover:bg-white/10 hover:text-secondary disabled:opacity-50"
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
          aria-label={t('deleteAria', { title: debateTitle })}
          className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-subprimary text-secondary shadow-[0_5px_20px_-12px_rgba(0,0,0,0.6)] transition-all hover:border-red-400/30 hover:bg-red-500/10 hover:text-red-400 sm:opacity-0 sm:group-hover:opacity-100"
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
  const ts = useTranslations('debates.status')
  const tp = useTranslations('debates.personas')
  const formatDate = useFormatDate()

  const persona = getPersona(debate.ai_persona)
  const personaLabel = tp(`${debate.ai_persona}.label`)
  const status = statusConfig[debate.status]

  return (
    <div className="group relative">
      <Link
        href={`/debates/${debate.id}`}
        className="relative block overflow-hidden rounded-[1.6rem] border border-white/[0.08] bg-primary px-4 py-4 shadow-[0_10px_35px_-28px_rgba(0,0,0,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/[0.15] hover:shadow-[0_18px_45px_-28px_rgba(0,0,0,0.7)] sm:px-5 sm:py-4.5"
      >
        <div className="pointer-events-none absolute -right-16 -top-20 size-36 rounded-full bg-pink-300/[0.06] blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="pointer-events-none absolute -left-16 -bottom-20 size-36 rounded-full bg-blue-300/[0.05] blur-[60px] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative flex items-center gap-3.5">
          <div className="flex shrink-0 items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <Image
              src={persona.image}
              alt={personaLabel}
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-sm font-semibold tracking-[-0.025em] text-secondary sm:text-[14px]">
              {debate.title}
            </h3>

            <div className="mt-1.5 flex items-center gap-2">
              <span className="text-xs font-medium text-description">
                {personaLabel}
              </span>

              <span className="text-xs text-description/50">
                ·
              </span>

              <span className="text-[10px] text-description">
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

              {ts(debate.status)}
            </span>
          </div>
        </div>
      </Link>

      <DeleteControl
        debateId={debate.id}
        debateTitle={debate.title}
        relationshipId={relationshipId}
        className="absolute right-2 top-1/2 z-10 -translate-y-1/2 sm:right-[3.75rem]"
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
    card: 'border-white/10  hover:border-white/20',
    wall: '44, 46, 46',
    shade: '16, 18, 18',
    glow: 'bg-neutral-400/20',
    accentText: 'text-neutral-300',
    button: 'bg-neutral-900',
  },
  kasar: {
    card: 'border-red-400/15  hover:border-red-400/30',
    wall: '92, 38, 42',
    shade: '40, 14, 18',
    glow: 'bg-red-400/20',
    accentText: 'text-red-400',
    button: 'bg-red-500',
  },
  lebay: {
    card: 'border-blue-400/15  hover:border-blue-400/30',
    wall: '36, 60, 98',
    shade: '14, 26, 50',
    glow: 'bg-blue-400/20',
    accentText: 'text-blue-400',
    button: 'bg-blue-500',
  },
  lembut: {
    card: 'border-pink-400/15 hover:border-pink-400/30',
    wall: '90, 42, 66',
    shade: '44, 18, 32',
    glow: 'bg-pink-400/20',
    accentText: 'text-pink-400',
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

// Bloom key light di dinding, tepat di atas persona (diredam untuk dark mode).
const CARD_KEY_LIGHT =
  'radial-gradient(ellipse 72% 42% at 50% 30%, rgba(255,255,255,0.14) 0%, rgba(255,255,255,0.09) 28%, rgba(255,255,255,0.04) 55%, rgba(255,255,255,0.01) 80%, rgba(255,255,255,0) 100%)'

// Bayangan lantai berwarna di bawah persona (ukuran ellipse disesuaikan buat card).
const cardFloorShade = (rgb: string) =>
  `radial-gradient(ellipse 200px 60px at 50% ${CARD_HORIZON + 3}%, ${cardRgba(rgb, 0.5)} 0%, ${cardRgba(rgb, 0.25)} 40%, ${cardRgba(rgb, 0.08)} 75%, ${cardRgba(rgb, 0)} 100%)`

// Cahaya studio miring dari kiri atas (diredam untuk dark mode).
const CARD_SIDE_LIGHT =
  'linear-gradient(112deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 26%, rgba(255,255,255,0.015) 50%, rgba(255,255,255,0) 68%)'

const CARD_LIGHT_CONE =
  'conic-gradient(from 0deg at -10% -16%, rgba(255,255,255,0) 104deg, rgba(255,255,255,0.015) 114deg, rgba(255,255,255,0.04) 124deg, rgba(255,255,255,0.07) 134deg, rgba(255,255,255,0.085) 141deg, rgba(255,255,255,0.065) 149deg, rgba(255,255,255,0.035) 160deg, rgba(255,255,255,0.012) 171deg, rgba(255,255,255,0) 182deg)'

// Biar cahaya miring hilang sendiri sebelum sampai lantai.
const CARD_FADE_BEFORE_FLOOR =
  'linear-gradient(to bottom, #000 0%, #000 40%, transparent 80%)'

// Sisi yang tidak kena cahaya sedikit lebih gelap + vignette halus.
const CARD_LIGHT_FALLOFF =
  'linear-gradient(292deg, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0) 55%)'
const CARD_VIGNETTE =
  'radial-gradient(ellipse 85% 75% at 50% 44%, rgba(0,0,0,0) 50%, rgba(0,0,0,0.08) 78%, rgba(0,0,0,0.16) 100%)'

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
    <div aria-hidden className="pointer-events-none absolute inset-0 bg-primary">
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
  const ts = useTranslations('debates.status')
  const tp = useTranslations('debates.personas')
  const formatDate = useFormatDate()

  const persona = getPersona(debate.ai_persona)
  const personaLabel = tp(`${debate.ai_persona}.label`)
  const statusLabel = ts(debate.status)
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
            alt={personaLabel}
            fill
            sizes="(max-width: 640px) 66vw, 255px"
            className="object-contain drop-shadow-[0_16px_20px_rgba(0,0,0,0.35)] transition-transform duration-300 group-hover:scale-105"
          />
        </div>

        {/* TITLE + PERSONA */}
        <div className="relative mt-3 w-full px-5 text-center">
          <h3 className="line-clamp-2 min-h-[3.1rem] text-lg font-semibold leading-snug tracking-[-0.03em] text-secondary">
            {debate.title}
          </h3>

          <p className="mt-1.5 text-xs text-description">
            <span className={`font-semibold ${theme.accentText}`}>
              {personaLabel}
            </span>
            <span className="mx-1.5 text-description/50">·</span>
            {tp(`${debate.ai_persona}.description`)}
          </p>
        </div>

        {/* STATUS DOT + DATE */}
        <div className="relative mt-4 flex items-center justify-center gap-2 px-5">
          <span
            role="img"
            aria-label={statusLabel}
            title={statusLabel}
            className={`size-2 rounded-full ${status.dot} ${debate.status === 'active' ? 'animate-pulse' : ''
              }`}
          />

          <span className="text-xs text-description">
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
  const t = useTranslations('debates.list.carousel')
  const scrollerRef = useRef<HTMLDivElement>(null)

  const [activeIndex, setActiveIndex] = useState(0)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  const total = debates.length
  const currentIndex = Math.min(activeIndex, total - 1)

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
                  aria-label={t('goTo', { number: index + 1 })}
                  className={`h-1.5 rounded-full transition-all duration-300 ${index === currentIndex
                    ? 'w-5 bg-secondary'
                    : 'w-1.5 bg-white/20 hover:bg-white/40'
                    }`}
                />
              ))}
            </div>
          ) : (
            <span className="text-xs font-medium text-description">
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
                aria-label={t('previous')}
                className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-primary text-description transition hover:bg-white/10 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
                aria-label={t('next')}
                className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-primary text-description transition hover:bg-white/10 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
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
  const t = useTranslations('debates.list.viewMode')

  const options = [
    { mode: 'cards', label: t('cards'), Icon: GalleryHorizontal },
    { mode: 'list', label: t('list'), Icon: List },
  ] as const

  return (
    <div
      role="group"
      aria-label={t('groupLabel')}
      className="flex items-center gap-0.5 rounded-full bg-white/[0.06] p-1"
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
              ? 'bg-primary text-secondary shadow-[0_2px_8px_-4px_rgba(0,0,0,0.6)]'
              : 'text-description hover:text-secondary'
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
/*  Create debate button (tampil di card mode & list mode)                    */
/* -------------------------------------------------------------------------- */

function CreateDebateButton({
  onClick,
  disabled,
  used,
  max,
  floating = false,
}: {
  onClick: () => void
  disabled: boolean
  used: number
  max: number | null
  floating?: boolean
}) {
  const t = useTranslations('debates.list.create')

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={
        disabled
          ? t('limitTitle', { used, max: max ?? 0 })
          : t('tooltip')
      }
      className={`mx-auto flex h-12 w-40 shrink-0 items-center justify-center gap-1.5 rounded-full text-sm font-semibold transition-all duration-200 sm:w-[340px] ${floating
        ? 'fixed bottom-6 left-1/2 -translate-x-1/2 z-20 mt-6 shadow-[0_12px_30px_-10px_rgba(0,0,0,0.6)]'
        : 'mt-4'
        } ${disabled
          ? 'cursor-not-allowed bg-white/10 text-description'
          : 'bg-subprimary text-secondary hover:bg-subprimary/90 active:scale-[0.98]'
        }`}
    >
      <Plus
        size={15}
        strokeWidth={1.8}
      />
      {disabled ? t('limitReached') : t('button')}
    </button>
  )
}

/* -------------------------------------------------------------------------- */
/*  Pagination untuk list mode                                                */
/* -------------------------------------------------------------------------- */

function ListPagination({
  page,
  totalPages,
  onChange,
}: {
  page: number
  totalPages: number
  onChange: (page: number) => void
}) {
  const t = useTranslations('debates.list.pagination')

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className="mt-5 flex items-center justify-center gap-3 pb-20">
      <button
        type="button"
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label={t('previous')}
        className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-primary text-description transition hover:bg-white/10 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronLeft
          size={14}
          strokeWidth={1.8}
        />
      </button>

      <span className="text-xs font-medium text-description">
        {page} / {totalPages}
      </span>

      <button
        type="button"
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label={t('next')}
        className="flex size-8 items-center justify-center rounded-full border border-white/10 bg-primary text-description transition hover:bg-white/10 hover:text-secondary disabled:cursor-not-allowed disabled:opacity-40"
      >
        <ChevronRight
          size={14}
          strokeWidth={1.8}
        />
      </button>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/*  Main                                                                      */
/* -------------------------------------------------------------------------- */


export default function DebateList({
  relationshipId,
}: DebateListProps) {
  const t = useTranslations('debates.list')
  const timeZone = useTimeZone()

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

  const [listPage, setListPage] = useState(1)

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

  const handleListPageChange = (nextPage: number) => {
    setListPage(nextPage)

    // balik ke atas list setiap ganti halaman (hapus kalau tidak mau)
    contentEl?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  if (isLoading) {
    if (viewMode === 'cards') {
      return (
        <div className="flex flex-1 flex-col justify-center">
          <div className="flex gap-3 overflow-hidden px-1 pt-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-[340px] w-[88%] shrink-0 animate-pulse rounded-[2rem] border border-white/[0.06] bg-white/[0.06] sm:w-[340px]"
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
            className="h-[84px] animate-pulse rounded-[1.6rem] border border-white/[0.06] bg-white/[0.06]"
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
        return isSameZonedDay(
          debate.created_at,
          new Date().toISOString(),
          timeZone,
        )
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

  const totalPages = Math.max(
    1,
    Math.ceil(filteredDebates.length / LIST_PAGE_SIZE),
  )

  // di-clamp supaya aman kalau debat dihapus dan halaman terakhir jadi kosong
  const currentPage = Math.min(listPage, totalPages)

  const pagedDebates = filteredDebates.slice(
    (currentPage - 1) * LIST_PAGE_SIZE,
    currentPage * LIST_PAGE_SIZE,
  )

  const filterOptions: {
    value: DebateFilter
    label: string
  }[] = [
    { value: 'all', label: t('filters.all') },
    { value: 'today', label: t('filters.today') },
    { value: 'in_progress', label: t('filters.in_progress') },
    { value: 'resolved', label: t('filters.resolved') },
  ]

  return (
    <div className="flex flex-1 flex-col bg-primary">
      {/* TOOLBAR (filter saja) */}
      <div className="mb-5 flex items-center">
        <div className="flex min-w-0 items-center gap-1 overflow-x-auto rounded-full bg-white/[0.06] p-1 scrollbar-none">
          {filterOptions.map((filter) => {
            const isActive =
              activeFilter === filter.value

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => {
                  setActiveFilter(filter.value)
                  setListPage(1)
                }}
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-3.5 sm:text-xs ${isActive
                  ? 'bg-primary text-secondary shadow-[0_2px_8px_-4px_rgba(0,0,0,0.6)]'
                  : 'text-description hover:text-secondary'
                  }`}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      <CreateDebateModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* INFO + VIEW TOGGLE (tetap di atas, tidak ikut ditengahkan) */}
      <div className="mb-3 flex items-center justify-between px-1">
        <p className="text-xs text-description">
          {t('count', { count: filteredDebates.length })}
          <span className="mx-1.5 text-description/50">
            ·
          </span>
          <span className="font-medium text-description/70">
            {t('aiMediated')}
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
        className={`flex flex-col ${viewMode === 'cards' ? 'justify-center' : ''
          }`}
      >
        {/* EMPTY STATE */}
        {!filteredDebates.length && (
          <div className="relative overflow-hidden rounded-[1.8rem] border border-white/[0.08] bg-primary px-6 py-12 text-center shadow-[0_15px_45px_-30px_rgba(0,0,0,0.6)]">
            <div className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-pink-300/[0.06] blur-[70px]" />

            <div className="pointer-events-none absolute -left-20 bottom-[-50px] size-44 rounded-full bg-blue-300/[0.05] blur-[70px]" />

            <div className="relative">
              <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-white/[0.06]">
                <Image
                  src={formalAi}
                  alt={t('mediatorAlt')}
                  width={34}
                  height={34}
                  className="size-[34px] object-contain"
                />
              </div>

              <h3 className="mt-4 text-[16px] font-semibold tracking-[-0.03em] text-secondary">
                {t(`empty.${activeFilter}.title`)}
              </h3>

              <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-description">
                {t(`empty.${activeFilter}.description`)}
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
            <>
              <div className="space-y-2.5">
                {pagedDebates.map((debate) => (
                  <DebateListItem
                    key={debate.id}
                    debate={debate}
                    relationshipId={relationshipId}
                  />
                ))}
              </div>

              <ListPagination
                page={currentPage}
                totalPages={totalPages}
                onChange={handleListPageChange}
              />
            </>
          ))}

        {/* CREATE DEBATE (card mode: inline di bawah carousel) */}
        {viewMode === 'cards' && (
          <CreateDebateButton
            onClick={handleCreateClick}
            disabled={isRoomLimitReached}
            used={roomsThisMonth ?? 0}
            max={maxRoomsPerMonth}
          />
        )}
      </div>

      {/* CREATE DEBATE (list mode: sticky, selalu terlihat saat scroll) */}
      {viewMode === 'list' && (
        <CreateDebateButton
          floating
          onClick={handleCreateClick}
          disabled={isRoomLimitReached}
          used={roomsThisMonth ?? 0}
          max={maxRoomsPerMonth}
        />
      )}
    </div>
  )
}