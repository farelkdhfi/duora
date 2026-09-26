'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  ArrowUpRight,
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
    personaOptions.find((persona) => persona.value === aiPersona) ??
    personaOptions[0]
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
          <div className="flex size-10 shrink-0 items-center justify-center rounded-[1.1rem] border border-black/[0.045] bg-[#faf9f6] transition-transform duration-300 group-hover:scale-105">
            <Image
              src={persona.image}
              alt={persona.label}
              width={28}
              height={28}
              className="size-7 object-contain"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-xs font-semibold tracking-[-0.025em] text-neutral-900 sm:text-[14px]">
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

      <div className="absolute right-0 top-0 z-10 -translate-y-1/2 sm:right-[3.75rem]">
        {isConfirmingDelete ? (
          <div className="flex items-center gap-1 rounded-full border border-black/[0.05] bg-white p-1 shadow-[0_10px_30px_-15px_rgba(0,0,0,0.3)]">
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={
                deleteDebateMutation.isPending
              }
              className="rounded-full bg-neutral-900 px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-black disabled:opacity-50"
            >
              {deleteDebateMutation.isPending
                ? '...'
                : 'Delete'}
            </button>

            <button
              type="button"
              onClick={handleCancelDelete}
              disabled={
                deleteDebateMutation.isPending
              }
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

  return (
    <div>
      {/* CREATE BUTTON */}
      <button
        type="button"
        onClick={() => setShowCreate(true)}
        className="group relative mb-5 flex w-full items-center justify-between overflow-hidden rounded-[1.6rem] border border-black/[0.055] bg-white px-4 py-3.5 shadow-[0_10px_35px_-28px_rgba(0,0,0,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/[0.09] sm:px-5"
      >
        <div className="pointer-events-none absolute -right-10 -top-16 size-32 rounded-full bg-pink-300/[0.07] blur-[55px]" />

        <div className="relative flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-[1rem] bg-neutral-900 text-white transition-transform duration-300 group-hover:scale-105">
            <Plus
              size={14}
              strokeWidth={1.8}
            />
          </div>

          <div className="text-left">
            <p className="text-sm font-semibold text-neutral-800">
              Start a new debate
            </p>
          </div>
        </div>

        <ArrowUpRight
          size={14}
          strokeWidth={1.7}
          className="text-neutral-300 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-neutral-700"
        />
      </button>

      <CreateDebateModal
        relationshipId={relationshipId}
        open={showCreate}
        onClose={() => setShowCreate(false)}
      />

      {/* EMPTY STATE */}
      {!debates?.length && (
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
              No debates yet.
            </h3>

            <p className="mx-auto mt-1.5 max-w-xs text-sm leading-5 text-neutral-400">
              Start a conversation whenever you need a
              little help finding common ground.
            </p>

            <button
              type="button"
              onClick={() => setShowCreate(true)}
              className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-neutral-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-black"
            >
              <Plus
                size={11}
                strokeWidth={1.9}
              />
              Start debate
            </button>
          </div>
        </div>
      )}

      {/* DEBATE LIST */}
      {Boolean(debates?.length) && (
        <div>
          <div className="mb-3 flex items-center justify-between px-1">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.17em] text-neutral-300">
                Conversations
              </p>

              <p className="mt-1 text-sm text-neutral-400">
                {debates?.length}{' '}
                {debates?.length === 1
                  ? 'debate'
                  : 'debates'}
              </p>
            </div>

            <span className="text-xs font-medium text-neutral-300">
              AI mediated
            </span>
          </div>

          <div className="space-y-2.5">
            {debates!.map((debate) => (
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