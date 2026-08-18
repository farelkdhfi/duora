'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import {
  Loader2,
  MessageSquareText,
  Plus,
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
import stressedEmot from '@/assets/emoticon/stressed-emot.png'
import tiredEmot from '@/assets/emoticon/tired-emot.png'

interface DebateListProps {
  relationshipId: string
}

/* ============================================================= */
/* STATUS */
/* ============================================================= */

const statusLabel = {
  active: {
    text: 'Active',
    color:
      'bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/10',
  },

  pending_verdict: {
    text: 'Preparing conclusion',
    color:
      'bg-amber-50 text-amber-600 ring-1 ring-amber-500/10',
  },

  resolved: {
    text: 'Resolved',
    color:
      'bg-neutral-100 text-neutral-500 ring-1 ring-black/[0.04]',
  },

  archived: {
    text: 'Archived',
    color:
      'bg-neutral-100/70 text-neutral-400 ring-1 ring-black/[0.03]',
  },
}

/* ============================================================= */
/* PERSONA */
/* ============================================================= */

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

/* ============================================================= */
/* DATE */
/* ============================================================= */

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

/* ============================================================= */
/* DEBATE ITEM */
/* ============================================================= */

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

  const deleteDebateMutation =
    useDeleteDebate(relationshipId)

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
        min-w-0
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
        shadow-[0_10px_35px_-28px_rgba(0,0,0,0.2)]
        transition-all
        duration-300
        hover:-translate-y-0.5
        hover:border-black/[0.09]
        hover:shadow-[0_18px_45px_-25px_rgba(0,0,0,0.16)]
        sm:px-5
        sm:py-4.5
      "
    >
      {/* Ambient */}

      <div
        className="
          pointer-events-none
          absolute
          -left-12
          -top-12
          size-28
          rounded-full
          bg-blue-400/[0.08]
          blur-3xl
          opacity-0
          transition-opacity
          duration-500
          group-hover:opacity-100
        "
      />

      {/* Content */}

      <div className="relative flex min-w-0 items-center gap-3.5">

        <div
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-[1.1rem]
            border
            border-black/[0.045]
            bg-neutral-50
            text-neutral-500
            shadow-[0_4px_14px_rgba(0,0,0,0.025)]
          "
        >
          <MessageSquareText
            size={15}
            strokeWidth={1.7}
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
              text-neutral-400
            "
          >
            Started {formatDate(debate.created_at)}
          </p>

        </div>

      </div>

      {/* Right */}

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
            <Trash2
              size={12}
              strokeWidth={1.8}
            />
          </button>
        )}

        <span
          className={`
            rounded-full
            px-2.5
            py-1.5
            text-[9px]
            font-semibold
            ${status.color}
          `}
        >
          {status.text}
        </span>

      </div>
    </Link>
  )
}

/* ============================================================= */
/* PERSONA CARD */
/* ============================================================= */

function PersonaCard({
  option,
  selected,
  onSelect,
}: {
  option: (typeof personaOptions)[number]
  selected: boolean
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={`
        group
        relative
        min-h-[170px]
        overflow-hidden
        rounded-[1.5rem]
        border
        p-5
        text-left
        transition-all
        duration-300
        focus:outline-none
        focus-visible:ring-4
        focus-visible:ring-black/[0.04]

        ${
          selected
            ? `
              border-neutral-900
              bg-neutral-900
              text-white
              shadow-[0_18px_35px_-20px_rgba(0,0,0,0.4)]
              sm:-translate-y-1
            `
            : `
              border-black/[0.055]
              bg-neutral-50/70
              text-neutral-800
              hover:-translate-y-1
              hover:border-black/[0.09]
              hover:bg-white
              hover:shadow-[0_15px_35px_-20px_rgba(0,0,0,0.18)]
            `
        }
      `}
    >
      {/* Ambient */}

      <div
        className={`
          pointer-events-none
          absolute
          -right-10
          -top-10
          size-28
          rounded-full
          blur-3xl
          transition-opacity
          duration-500
          ${
            selected
              ? 'bg-pink-400/20 opacity-100'
              : 'bg-blue-400/10 opacity-0 group-hover:opacity-100'
          }
        `}
      />

      {/* Image */}

      <div
        className={`
          relative
          flex
          size-[72px]
          items-center
          justify-center
          rounded-[1.25rem]
          transition-all
          duration-300
          ${
            selected
              ? 'bg-white/10'
              : 'border border-black/[0.045] bg-white shadow-[0_5px_15px_-8px_rgba(0,0,0,0.2)]'
          }
        `}
      >
        <Image
          src={option.image}
          alt={option.label}
          width={52}
          height={52}
          className="
            size-[52px]
            object-contain
            transition-transform
            duration-300
            group-hover:scale-105
          "
        />
      </div>

      {/* Text */}

      <div className="relative mt-5">

        <p
          className={`
            text-[13px]
            font-semibold
            tracking-[-0.02em]
            ${
              selected
                ? 'text-white'
                : 'text-neutral-800'
            }
          `}
        >
          {option.label}
        </p>

        <p
          className={`
            mt-1
            text-[10px]
            leading-4
            ${
              selected
                ? 'text-white/45'
                : 'text-neutral-400'
            }
          `}
        >
          {option.description}
        </p>

      </div>

      {/* Selected line */}

      {selected && (
        <div
          className="
            absolute
            bottom-0
            left-5
            right-5
            h-0.5
            rounded-full
            bg-white/70
          "
        />
      )}
    </button>
  )
}

/* ============================================================= */
/* MAIN */
/* ============================================================= */

export default function DebateList({
  relationshipId,
}: DebateListProps) {
  const {
    data: debates,
    isLoading,
  } = useDebates(relationshipId)

  const [showCreate, setShowCreate] =
    useState(false)

  const [title, setTitle] =
    useState('')

  const [selectedPersona, setSelectedPersona] =
    useState<AiPersona>('formal')

  const createDebateMutation =
    useCreateDebate(relationshipId)

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

  /* =========================================================== */
  /* LOADING */
  /* =========================================================== */

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

      {/* ===================================================== */}
      {/* CREATE */}
      {/* ===================================================== */}

      <div className="mb-5">

        {showCreate ? (

          <div
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-black/[0.06]
              bg-white
              shadow-[0_25px_70px_-35px_rgba(0,0,0,0.2)]
            "
          >

            {/* Ambient */}

            <div
              className="
                pointer-events-none
                absolute
                -right-24
                -top-24
                size-64
                rounded-full
                bg-pink-400/[0.07]
                blur-[110px]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                -left-24
                bottom-0
                size-56
                rounded-full
                bg-blue-400/[0.06]
                blur-[100px]
              "
            />

            <div className="relative p-5 sm:p-7 lg:p-8">

              {/* Header */}

              <div className="flex items-start justify-between gap-5">

                <div>

                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.17em]
                      text-neutral-300
                    "
                  >
                    New AI Debate
                  </p>

                  <h2
                    className="
                      mt-2
                      text-lg
                      font-semibold
                      tracking-[-0.035em]
                      text-neutral-900
                      sm:text-xl
                    "
                  >
                    What do you want to discuss?
                  </h2>

                  <p
                    className="
                      mt-1.5
                      max-w-md
                      text-[11px]
                      leading-5
                      text-neutral-400
                      sm:text-[12px]
                    "
                  >
                    Choose a topic and let your AI
                    mediator help you see both sides.
                  </p>

                </div>

                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="
                    flex
                    size-8
                    shrink-0
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
                  <X
                    size={14}
                    strokeWidth={1.8}
                  />
                </button>

              </div>

              {/* Topic */}

              <div className="mt-7">

                <label
                  htmlFor="debate-title"
                  className="
                    text-[10px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    text-neutral-400
                  "
                >
                  Discussion topic
                </label>

                <div className="mt-2 flex flex-col gap-2 sm:flex-row">

                  <input
                    id="debate-title"
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
                      rounded-[1.25rem]
                      border
                      border-black/[0.06]
                      bg-neutral-50/80
                      px-4
                      py-3.5
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
                      h-[46px]
                      shrink-0
                      items-center
                      justify-center
                      gap-2
                      rounded-[1.25rem]
                      bg-neutral-900
                      px-5
                      text-[11px]
                      font-semibold
                      text-white
                      shadow-[0_10px_25px_-12px_rgba(0,0,0,0.35)]
                      transition-all
                      hover:-translate-y-0.5
                      hover:bg-black
                      disabled:pointer-events-none
                      disabled:opacity-40
                      sm:h-auto
                    "
                  >

                    {createDebateMutation.isPending && (
                      <Loader2
                        size={13}
                        className="animate-spin"
                      />
                    )}

                    Start discussion

                  </button>

                </div>

              </div>

              {/* ================================================= */}
              {/* PERSONA */}
              {/* ================================================= */}

              <div className="mt-9">

                <div className="mb-4">

                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-neutral-400
                    "
                  >
                    AI mediator style
                  </p>

                  <p
                    className="
                      mt-1
                      text-[11px]
                      leading-5
                      text-neutral-300
                    "
                  >
                    Pick the personality you want
                    your mediator to use.
                  </p>

                </div>

                <div
                  className="
                    grid
                    grid-cols-1
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-4
                  "
                >
                  {personaOptions.map(
                    (option) => (
                      <PersonaCard
                        key={option.value}
                        option={option}
                        selected={
                          selectedPersona ===
                          option.value
                        }
                        onSelect={() =>
                          setSelectedPersona(
                            option.value,
                          )
                        }
                      />
                    ),
                  )}
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
              text-neutral-400
              transition-all
              duration-300
              hover:border-black/[0.16]
              hover:bg-white
              hover:text-neutral-700
              hover:shadow-[0_10px_30px_-20px_rgba(0,0,0,0.15)]
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
              <Plus
                size={13}
                strokeWidth={2}
              />
            </span>

            Start a new discussion

          </button>

        )}

      </div>

      {/* ===================================================== */}
      {/* EMPTY */}
      {/* ===================================================== */}

      {!debates?.length &&
        !showCreate && (

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
              shadow-[0_12px_40px_-25px_rgba(0,0,0,0.12)]
              sm:py-14
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
                  text-neutral-400
                "
              >
                <MessageSquareText
                  size={19}
                  strokeWidth={1.6}
                />
              </div>

              <p
                className="
                  mt-5
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-[0.15em]
                  text-neutral-300
                "
              >
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
                  max-w-[280px]
                  text-[11.5px]
                  leading-5
                  text-neutral-400
                "
              >
                Start a conversation about
                something you haven't agreed on,
                with AI as your neutral mediator.
              </p>

            </div>

          </div>

        )}

      {/* ===================================================== */}
      {/* LIST */}
      {/* ===================================================== */}

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