'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Loader2,
  MessageSquareText,
  Plus,
  Smile,
  Trash2,
  X,
} from 'lucide-react'

import {
  useCreateDebate,
  useDebates,
  useDeleteDebate,
} from '../queries'
import { AiPersona } from '../types'

import happyEmot from '@/assets/emoticon/happy-emot.png'
import neutralEmot from '@/assets/emoticon/neutral-emot.png'
import sadEmot from '@/assets/emoticon/sad-emot.png'
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'

interface DebateListProps {
  relationshipId: string
}

const statusLabel = {
  active: {
    text: 'Active',
    color: 'bg-emerald-50/80 text-emerald-600 ring-1 ring-emerald-500/10',
  },
  pending_verdict: {
    text: 'Preparing conclusion',
    color: 'bg-amber-50/80 text-amber-600 ring-1 ring-amber-500/10',
  },
  resolved: {
    text: 'Resolved',
    color: 'bg-neutral-100/80 text-neutral-500 ring-1 ring-black/[0.04]',
  },
  archived: {
    text: 'Archived',
    color: 'bg-neutral-100/60 text-neutral-400 ring-1 ring-black/[0.03]',
  },
}

const personaOptions: {
  value: AiPersona
  label: string
  image: typeof happyEmot
}[] = [
    {
      value: 'formal',
      label: 'Formal',
      image: neutralEmot,
    },
    {
      value: 'lembut',
      label: 'Lembut',
      image: happyEmot,
    },
    {
      value: 'kasar',
      label: 'Nyeletuk',
      image: stressedEmot,
    },
    {
      value: 'lebay',
      label: 'Lebay',
      image: tiredEmot,
    },
  ]

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString(
    'id-ID',
    {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    },
  )
}

function DebateListItem({
  debate,
  relationshipId,
}: {
  debate: ReturnType<typeof useDebates>['data'] extends
  | (infer T)[]
  | undefined
  ? T
  : never
  relationshipId: string
}) {
  const [isConfirmingDelete, setIsConfirmingDelete] =
    useState(false)

  const deleteDebateMutation = useDeleteDebate(
    relationshipId,
  )

  const status = statusLabel[debate.status]

  const handleDeleteClick = (
    e: React.MouseEvent,
  ) => {
    e.preventDefault()
    e.stopPropagation()

    if (!isConfirmingDelete) {
      setIsConfirmingDelete(true)
      return
    }

    deleteDebateMutation.mutate(debate.id)
  }

  const handleCancelClick = (
    e: React.MouseEvent,
  ) => {
    e.preventDefault()
    e.stopPropagation()
    setIsConfirmingDelete(false)
  }

  return (
    <Link
      href={`/debates/${debate.id}`}
      className="
        group
        relative
        flex
        items-center
        justify-between
        gap-4
        overflow-hidden
        rounded-[1.75rem]
        border
        border-black/[0.055]
        bg-white
        px-4
        py-4
        shadow-[0_10px_35px_rgba(0,0,0,0.035)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-black/[0.09]
        hover:shadow-[0_18px_45px_rgba(0,0,0,0.07)]
        sm:px-5
        sm:py-4.5
      "
    >
      {/* subtle ambient accent */}
      <div
        className="
          pointer-events-none
          absolute
          -left-10
          -top-10
          size-24
          rounded-full
          bg-blue-400/10
          blur-2xl
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      <div className="relative flex min-w-0 items-center gap-3.5">
        <div
          className="
            relative
            flex
            size-10
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-[1.1rem]
            border
            border-black/[0.045]
            bg-neutral-50
            shadow-[0_4px_14px_rgba(0,0,0,0.04)]
          "
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400/[0.08] via-transparent to-pink-400/[0.08]" />

          <Smile
            size={14}
            strokeWidth={1.8}
            className="relative text-neutral-700"
          />
        </div>

        <div className="min-w-0">
          <h3
            className="
              truncate
              text-[13.5px]
              font-semibold
              tracking-[-0.025em]
              text-neutral-900
            "
          >
            {debate.title}
          </h3>

          <p
            className="
              mt-1
              text-[10px]
              font-medium
              tracking-[-0.005em]
              text-neutral-400
            "
          >
            Started {formatDate(debate.created_at)}
          </p>
        </div>
      </div>

      <div className="relative flex shrink-0 items-center gap-2">
        {isConfirmingDelete ? (
          <div
            className="
              flex
              items-center
              gap-1
              rounded-full
              border
              border-black/[0.06]
              bg-neutral-50
              p-1
            "
          >
            <button
              type="button"
              onClick={handleDeleteClick}
              disabled={deleteDebateMutation.isPending}
              className="
                rounded-full
                bg-neutral-900
                px-3
                py-1.5
                text-[9px]
                font-semibold
                text-white
                transition
                hover:bg-black
                disabled:opacity-50
              "
            >
              {deleteDebateMutation.isPending
                ? '...'
                : 'Delete'}
            </button>

            <button
              type="button"
              onClick={handleCancelClick}
              disabled={deleteDebateMutation.isPending}
              className="
                rounded-full
                px-3
                py-1.5
                text-[9px]
                font-semibold
                text-neutral-500
                transition
                hover:bg-white
                hover:text-neutral-800
                disabled:opacity-50
              "
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleDeleteClick}
            className="
              flex
              size-7
              items-center
              justify-center
              rounded-full
              text-neutral-300
              opacity-0
              transition-all
              duration-200
              hover:bg-red-50
              hover:text-red-500
              group-hover:opacity-100
            "
          >
            <Trash2 size={12} strokeWidth={1.8} />
          </button>
        )}

        <span
          className={`
            rounded-full
            px-2.5
            py-1.5
            text-[9px]
            font-semibold
            tracking-[-0.01em]
            ${status.color}
          `}
        >
          {status.text}
        </span>
      </div>
    </Link>
  )
}

export default function DebateList({
  relationshipId,
}: DebateListProps) {
  const {
    data: debates,
    isLoading,
  } = useDebates(relationshipId)

  const [showCreate, setShowCreate] = useState(false)
  const [title, setTitle] = useState('')
  const [selectedPersona, setSelectedPersona] = useState<AiPersona>('formal')

  const createDebateMutation = useCreateDebate(
    relationshipId,
  )

  const handleCreate = () => {
    if (!title.trim()) return

    createDebateMutation.mutate(
      {
        relationshipId,
        title: title.trim(),
        aiPersona: selectedPersona,
      },
      {
        onSuccess: () => {
          setTitle('')
          setSelectedPersona('formal')
          setShowCreate(false)
        },
      },
    )
  }

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((item) => (
          <div
            key={item}
            className="
              h-[76px]
              animate-pulse
              rounded-[1.75rem]
              border
              border-black/[0.04]
              bg-neutral-100/70
            "
          />
        ))}
      </div>
    )
  }

  return (
    <div>
      {/* CREATE */}

      <div className="mb-5">
        {showCreate ? (
          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-black/[0.07]
              bg-white
              p-4
              shadow-[0_18px_50px_rgba(0,0,0,0.07)]
              sm:p-5
            "
          >
            {/* ambient light */}

            <div
              className="
                pointer-events-none
                absolute
                -right-16
                -top-20
                size-40
                rounded-full
                bg-pink-400/[0.08]
                blur-[70px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -left-16
                bottom-0
                size-32
                rounded-full
                bg-blue-400/[0.07]
                blur-[60px]
              "
            />

            <div className="relative">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                    AI Debate
                  </p>

                  <p className="mt-1 text-[12px] text-neutral-500">
                    Choose a topic you want to discuss together.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="
                    flex
                    size-8
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-black/[0.05]
                    bg-neutral-50
                    text-neutral-400
                    transition
                    hover:bg-neutral-900
                    hover:text-white
                  "
                >
                  <X size={13} strokeWidth={1.8} />
                </button>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <input
                  value={title}
                  onChange={(e) =>
                    setTitle(e.target.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleCreate()
                    }
                  }}
                  placeholder="Example: Plans for your year-end vacation"
                  autoFocus
                  className="
                    min-w-0
                    flex-1
                    rounded-[1.15rem]
                    border
                    border-black/[0.06]
                    bg-neutral-50/80
                    px-4
                    py-3
                    text-[12px]
                    font-medium
                    text-neutral-900
                    outline-none
                    placeholder:text-neutral-300
                    transition
                    focus:border-black/[0.12]
                    focus:bg-white
                    focus:shadow-[0_0_0_4px_rgba(0,0,0,0.025)]
                  "
                />

                <button
                  type="button"
                  onClick={handleCreate}
                  disabled={
                    createDebateMutation.isPending ||
                    !title.trim()
                  }
                  className="
                    flex
                    shrink-0
                    items-center
                    justify-center
                    gap-2
                    rounded-[1.15rem]
                    bg-neutral-900
                    px-5
                    py-3
                    text-[11px]
                    font-semibold
                    tracking-[-0.01em]
                    text-white
                    shadow-[0_8px_20px_rgba(0,0,0,0.12)]
                    transition-all
                    hover:-translate-y-0.5
                    hover:bg-black
                    hover:shadow-[0_12px_25px_rgba(0,0,0,0.16)]
                    disabled:pointer-events-none
                    disabled:opacity-40
                    sm:w-auto
                  "
                >
                  {createDebateMutation.isPending && (
                    <Loader2
                      size={12}
                      className="animate-spin"
                    />
                  )}

                  Start discussion
                </button>
              </div>

              {/* AI PERSONA */}

              <div className="mt-3">
                <div className="mb-2 flex items-center justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-neutral-400">
                      AI Mediator Style
                    </p>

                    <p className="mt-0.5 text-[10px] text-neutral-300">
                      Choose how your AI mediator should behave.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {personaOptions.map((option) => {
                    const isSelected =
                      selectedPersona === option.value

                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() =>
                          setSelectedPersona(option.value)
                        }
                        className={`
            group
            relative
            flex
            items-center
            gap-2.5
            overflow-hidden
            rounded-[1.1rem]
            border
            px-3
            py-2.5
            text-left
            transition-all
            duration-200
            ${isSelected
                            ? `
                  border-neutral-900
                  bg-neutral-900
                  text-white
                  shadow-[0_6px_18px_rgba(0,0,0,0.12)]
                `
                            : `
                  border-black/[0.055]
                  bg-neutral-50/70
                  text-neutral-500
                  hover:border-black/[0.09]
                  hover:bg-white
                  hover:text-neutral-800
                `
                          }
          `}
                      >
                        {/* subtle accent */}
                        <span
                          className={`
              pointer-events-none
              absolute
              -right-4
              -top-4
              size-10
              rounded-full
              blur-xl
              transition-opacity
              ${isSelected
                              ? 'bg-pink-400/20 opacity-100'
                              : 'bg-blue-400/10 opacity-0 group-hover:opacity-100'
                            }
            `}
                        />

                        <span
                          className={`
    relative
    flex
    size-8
    shrink-0
    items-center
    justify-center
    rounded-[0.75rem]
    transition
    ${isSelected
                              ? 'bg-white/10'
                              : 'border border-black/[0.045] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.025)]'
                            }
  `}
                        >
                          <Image
                            src={option.image}
                            alt={option.label}
                            width={24}
                            height={24}
                            className="size-6 object-contain"
                          />
                        </span>

                        <span className="relative min-w-0">
                          <span
                            className={`
                block
                text-[10px]
                font-semibold
                tracking-[-0.01em]
                ${isSelected
                                ? 'text-white'
                                : 'text-neutral-600'
                              }
              `}
                          >
                            {option.label}
                          </span>

                          <span
                            className={`
                mt-0.5
                block
                text-[8.5px]
                ${isSelected
                                ? 'text-white/45'
                                : 'text-neutral-300'
                              }
              `}
                          >
                            {option.value === 'formal' &&
                              'Neutral & structured'}
                            {option.value === 'lembut' &&
                              'Calm & empathetic'}
                            {option.value === 'kasar' &&
                              'Casual & witty'}
                            {option.value === 'lebay' &&
                              'Expressive & dramatic'}
                          </span>
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="
              group
              relative
              flex
              w-full
              items-center
              justify-center
              gap-2.5
              overflow-hidden
              rounded-[1.75rem]
              border
              border-dashed
              border-black/[0.09]
              bg-white/60
              py-6
              text-[12px]
              font-semibold
              tracking-[-0.01em]
              text-neutral-400
              transition-all
              duration-300
              hover:border-black/[0.16]
              hover:bg-white
              hover:text-neutral-700
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.04)]
            "
          >
            <span
              className="
                flex
                size-7
                items-center
                justify-center
                rounded-full
                border
                border-black/[0.06]
                bg-neutral-50
                transition
                group-hover:bg-neutral-900
                group-hover:text-white
              "
            >
              <Plus size={13} strokeWidth={2} />
            </span>

            Start a new discussion
          </button>
        )}
      </div>

      {/* EMPTY */}

      {!debates?.length && !showCreate && (
        <div
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            border
            border-black/[0.055]
            bg-white
            px-6
            py-12
            text-center
            shadow-[0_12px_40px_rgba(0,0,0,0.025)]
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-20
              -top-20
              size-40
              rounded-full
              bg-pink-400/[0.06]
              blur-[70px]
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              -left-20
              bottom-0
              size-40
              rounded-full
              bg-blue-400/[0.06]
              blur-[70px]
            "
          />

          <div className="relative">
            <div
              className="
                mx-auto
                flex
                size-14
                items-center
                justify-center
                rounded-[1.25rem]
                border
                border-black/[0.05]
                bg-neutral-50
                shadow-[0_6px_20px_rgba(0,0,0,0.035)]
              "
            >
              <MessageSquareText
                size={19}
                strokeWidth={1.6}
                className="text-neutral-400"
              />
            </div>

            <p className="mt-5 text-[10px] font-semibold uppercase tracking-[0.15em] text-neutral-300">
              Your discussions
            </p>

            <h3
              className="
                mt-2
                text-[15px]
                font-semibold
                tracking-[-0.03em]
                text-neutral-800
              "
            >
              No discussions yet
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-[270px]
                text-[11.5px]
                leading-5
                text-neutral-400
              "
            >
              Start a conversation about something you haven't agreed on, with AI as your neutral mediator.
            </p>
          </div>
        </div>
      )}

      {/* LIST */}

      {Boolean(debates?.length) && (
        <div className="space-y-2.5">
          {debates!.map((debate) => (
            <DebateListItem
              key={debate.id}
              debate={debate}
              relationshipId={relationshipId}
            />
          ))}
        </div>
      )}
    </div>
  )
}