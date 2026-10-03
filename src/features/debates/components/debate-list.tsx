'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Plus,
  Trash2,
  X,
} from 'lucide-react'

import {
  useDebates,
  useDeleteDebate,
} from '../queries'
import { AiPersona } from '../types'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'
import CreateDebateModal from './create-debate-modal'

interface DebateListProps {
  relationshipId: string
}

type DebateFilter =
  | 'all'
  | 'today'
  | 'in_progress'
  | 'resolved'

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
  image: typeof happyEmot
}[] = [
  {
    value: 'formal',
    label: 'Formal',
    description: 'Neutral & structured',
    image: neutralEmot,
  },
  {
    value: 'lembut',
    label: 'Lembut',
    description: 'Calm & empathetic',
    image: happyEmot,
  },
  {
    value: 'kasar',
    label: 'Nyeletuk',
    description: 'Casual & witty',
    image: stressedEmot,
  },
  {
    value: 'lebay',
    label: 'Lebay',
    description: 'Expressive & dramatic',
    image: tiredEmot,
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

function DebateListItem({
  debate,
  relationshipId,
}: {
  debate: NonNullable<
    ReturnType<typeof useDebates>['data']
  >[number]
  relationshipId: string
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] =
    useState(false)

  const deleteDebateMutation =
    useDeleteDebate(relationshipId)

  const persona = getPersona(debate.ai_persona)
  const status = statusConfig[debate.status]

  const handleDeleteClick = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteDebateMutation.mutate(debate.id)
  }

  const handleCancelDelete = (
    event: React.MouseEvent,
  ) => {
    event.preventDefault()
    event.stopPropagation()

    setIsConfirmingDelete(false)
  }

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
                className={`size-1.5 rounded-full ${status.dot} ${
                  debate.status === 'active'
                    ? 'animate-pulse'
                    : ''
                }`}
              />

              {status.label}
            </span>
          </div>
        </div>
      </Link>

      <div className="absolute right-0 top-0 z-10 -translate-y-1/2 sm:right-[3.75rem]">
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
            aria-label={`Delete ${debate.title}`}
            className="flex size-8 items-center justify-center rounded-full border border-black/[0.05] bg-white text-neutral-300 shadow-[0_5px_20px_-12px_rgba(0,0,0,0.25)] transition-all hover:border-red-100 hover:bg-red-50 hover:text-red-500 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <Trash2
              size={12}
              strokeWidth={1.7}
            />
          </button>
        )}
      </div>
    </div>
  )
}

export default function DebateList({
  relationshipId,
}: DebateListProps) {
  const { data: debates, isLoading } =
    useDebates(relationshipId)

  const [showCreate, setShowCreate] =
    useState(false)

  const [activeFilter, setActiveFilter] =
    useState<DebateFilter>('all')

  if (isLoading) {
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
    <div>
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
                className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-3.5 sm:text-xs ${
                  isActive
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
          onClick={() => setShowCreate(true)}
          aria-label="Start a new debate"
          className="flex size-9 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-white transition-all duration-200 hover:scale-105 hover:bg-black active:scale-95"
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

      {/* EMPTY STATE */}
      {!filteredDebates.length && (
        <div className="relative overflow-hidden rounded-[1.8rem] border border-black/[0.05] bg-white px-6 py-12 text-center shadow-[0_15px_45px_-30px_rgba(0,0,0,0.15)]">
          <div className="pointer-events-none absolute -right-20 -top-20 size-44 rounded-full bg-pink-300/[0.06] blur-[70px]" />

          <div className="pointer-events-none absolute -left-20 bottom-[-50px] size-44 rounded-full bg-blue-300/[0.05] blur-[70px]" />

          <div className="relative">
            <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-[#faf9f6]">
              <Image
                src={neutralEmot}
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

      {/* DEBATE LIST */}
      {Boolean(filteredDebates.length) && (
        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="mt-1 text-xs text-neutral-400">
                {filteredDebates.length}{' '}
                {filteredDebates.length === 1
                  ? 'debate'
                  : 'debates'}
              </p>
            </div>

            <span className="text-xs font-medium text-neutral-300">
              AI mediated
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredDebates.map((debate) => (
              <DebateListItem
                key={debate.id}
                debate={debate}
                relationshipId={relationshipId}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}