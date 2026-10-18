'use client'

import { useEffect, useRef, useState } from 'react'
import { Clock, Trash2 } from 'lucide-react'
import { useFormatter, useTranslations } from 'next-intl'

import { UTC, wallClock } from '@/lib/date'

import type { PlannerEvent } from '../types'
import { useDeletePlannerEvent } from '../queries'

export type EventStatus = 'in-progress' | 'upcoming' | 'done'

export interface Participant {
  id?: string
  name: string
  avatarUrl?: string | null
}

interface EventCardProps {
  event: PlannerEvent
  status: EventStatus
  expanded: boolean
  onToggle: () => void
  /** Opsional: avatar yang tampil di kiri jam (mis. kamu + partner) */
  participants?: Participant[]
}

const statusMeta: Record<
  EventStatus,
  { labelKey: 'inProgress' | 'upcoming' | 'done'; text: string; bar: string }
> = {
  'in-progress': {
    labelKey: 'inProgress',
    text: 'text-pink-300',
    bar: 'bg-pink-400',
  },
  upcoming: {
    labelKey: 'upcoming',
    text: 'text-neutral-400',
    bar: 'bg-neutral-500',
  },
  done: {
    labelKey: 'done',
    text: 'text-neutral-500',
    bar: 'bg-neutral-700',
  },
}

function AvatarStack({ participants }: { participants: Participant[] }) {
  return (
    <div className="flex -space-x-1.5">
      {participants.map((person, index) => (
        <span
          key={person.id ?? `${person.name}-${index}`}
          title={person.name}
          className="relative flex size-6 items-center justify-center overflow-hidden rounded-full bg-neutral-700 text-[10px] font-semibold uppercase text-neutral-100 ring-2 ring-[#0f0f13]"
        >
          {person.avatarUrl ? (
            <img
              src={person.avatarUrl}
              alt={person.name}
              className="size-full object-cover"
            />
          ) : (
            person.name.charAt(0)
          )}
        </span>
      ))}
    </div>
  )
}

export default function EventCard({
  event,
  status,
  expanded,
  onToggle,
  participants,
}: EventCardProps) {
  const t = useTranslations('planner.card')
  const tc = useTranslations('planner.categories')
  const tCommon = useTranslations('common')
  const format = useFormatter()

  const [menuOpen, setMenuOpen] = useState(false)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const deleteMutation = useDeletePlannerEvent()
  const meta = statusMeta[status]

  // tutup menu "..." kalau klik di luar atau tekan Escape
  useEffect(() => {
    if (!menuOpen) return

    const handlePointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false)
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [menuOpen])

  const handleDelete = () => deleteMutation.mutate(event.id)

  const handleCancelDelete = () => {
    if (deleteMutation.isPending) return
    setIsConfirmingDelete(false)
  }

  /** "13:30:00" -> "1:30 PM" (en) / "13.30" (id) */
  const formatTime = (time: string) => {
  const [h, m] = time.split(':').map(Number)
  return format.dateTime(wallClock(h, m || 0), {
    hour: 'numeric',
    minute: '2-digit',
    ...UTC,
  })
}

  const categoryLabel = tc.has(event.category)
    ? tc(event.category)
    : event.category

  const showTime = !event.is_all_day && event.start_time

  return (
    <article className="relative w-full rounded-[1.4rem] border border-white/[0.08] bg-linear-to-br from-[#17171d] to-[#0c0c0f] shadow-[0_8px_25px_-20px_rgba(0,0,0,0.6)] transition-colors duration-300 hover:border-white/[0.14]">
      {isConfirmingDelete ? (
        /* ===== Konfirmasi hapus ===== */
        <div className="flex min-h-[104px] flex-col items-center justify-center gap-3 px-4 py-4 text-center sm:flex-row sm:justify-between sm:text-left">
          <div className="min-w-0">
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-red-500/15 text-red-400">
                <Trash2 size={12} strokeWidth={2} />
              </div>

              <p className="text-[13px] font-semibold tracking-[-0.02em] text-neutral-50">
                {t('deleteTitle')}
              </p>
            </div>

            <p className="mt-1 text-[10px] text-neutral-500 sm:ml-9">
              {t('deleteWarning')}
            </p>
          </div>

          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex min-h-8 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.06] px-4 text-[10px] font-semibold text-neutral-300 transition-all hover:bg-white/[0.12] hover:text-white active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {tCommon('cancel')}
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleteMutation.isPending}
              className="inline-flex min-h-8 items-center justify-center gap-1.5 rounded-full bg-white px-4 text-[10px] font-semibold text-neutral-900 transition-all hover:bg-neutral-200 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trash2 size={11} strokeWidth={2} />
              {deleteMutation.isPending ? t('deleting') : t('confirmYes')}
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* garis status di kiri */}
          <span
            aria-hidden
            className={`absolute bottom-4 left-3 top-4 w-[3px] rounded-full transition-colors ${meta.bar}`}
          />

          {/* area utama: klik untuk buka/tutup deskripsi */}
          <button
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            className="block w-full rounded-[1.4rem] py-4 pl-6 pr-12 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <h4 className="line-clamp-2 break-words text-[14px] font-medium leading-snug tracking-[-0.02em] text-neutral-50">
              {event.title}
            </h4>

            <p className={`mt-0.5 text-[12px] ${meta.text}`}>
              {t(`status.${meta.labelKey}`)}
            </p>

            <div className="mt-3 flex min-h-6 items-center justify-between gap-3">
              {participants && participants.length > 0 ? (
                <AvatarStack participants={participants} />
              ) : (
                <span />
              )}

              {showTime ? (
                <span className="flex shrink-0 items-center gap-1.5 text-[11px] tabular-nums text-neutral-300">
                  <Clock size={11} strokeWidth={2} />
                  {formatTime(event.start_time as string)}
                  {event.end_time && ` – ${formatTime(event.end_time)}`}
                </span>
              ) : (
                <span className="shrink-0 rounded-full bg-white/[0.08] px-2.5 py-0.5 text-[10px] font-medium text-neutral-300">
                  {t('allDay')}
                </span>
              )}
            </div>
          </button>

          {/* menu "..." */}
          <div ref={menuRef} className="absolute right-3 top-3">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={t('options')}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex size-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-white/[0.08] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
            >
              <span className="flex gap-[3px]">
                <span className="size-[3px] rounded-full bg-current" />
                <span className="size-[3px] rounded-full bg-current" />
                <span className="size-[3px] rounded-full bg-current" />
              </span>
            </button>

            {menuOpen && (
              <div
                role="menu"
                className="absolute right-0 top-9 z-20 w-36 rounded-xl border border-white/[0.1] bg-[#15151b] p-1 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.8)]"
              >
                <button
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    setMenuOpen(false)
                    setIsConfirmingDelete(true)
                  }}
                  className="flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[12px] font-medium text-red-400 transition-colors hover:bg-red-500/10"
                >
                  <Trash2 size={12} strokeWidth={2} />
                  {tCommon('delete')}
                </button>
              </div>
            )}
          </div>

          {/* deskripsi (expand) */}
          <div
            aria-hidden={!expanded}
            className={`grid transition-[grid-template-rows] duration-300 ease-out ${
              expanded ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
            }`}
          >
            <div className="overflow-hidden">
              <div className="pb-4 pl-6 pr-4">
                <div className="rounded-xl bg-white/[0.06] p-3">
                  <span className="inline-block rounded-full bg-white/[0.08] px-2 py-0.5 text-[9px] font-semibold uppercase tracking-[0.12em] text-neutral-400">
                    {categoryLabel}
                  </span>

                  <p className="mt-2 whitespace-pre-line text-[12px] leading-relaxed text-neutral-200">
                    {event.description?.trim() || t('noDescription')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </article>
  )
}